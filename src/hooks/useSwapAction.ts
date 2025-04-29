
import { useState } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useAccount, useWriteContract, useReadContract, useChainId } from 'wagmi';
import { ERC20_ABI, DEX_CONFIG } from '../config/contracts';
import { SwapState } from '../types/token';
import { toast } from 'sonner';

const useSwapAction = (swapState: SwapState) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  
  // Use the hooks
  const { writeContractAsync: writeApproveAsync } = useWriteContract();
  const { writeContractAsync: writeSwapAsync } = useWriteContract();
  
  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: swapState.tokenIn?.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, DEX_CONFIG.address],
    query: {
      enabled: !!address && !!swapState.tokenIn,
    }
  });
  
  const performSwap = async () => {
    if (!swapState.tokenIn || !swapState.tokenOut || !swapState.amountIn || !address) {
      console.error('Missing required swap parameters');
      return;
    }
    
    try {
      // Parse amounts with the correct decimal precision
      const amountInWei = parseUnits(swapState.amountIn, swapState.tokenIn.decimals);
      const minAmountOut = parseUnits(
        (parseFloat(swapState.amountOut) * (1 - swapState.slippage / 100)).toFixed(swapState.tokenOut.decimals), 
        swapState.tokenOut.decimals
      );
      
      // Check allowance
      if (allowance !== undefined && allowance < amountInWei) {
        console.log('Approving tokens...');
        setIsApproving(true);
        
        try {
          // Approve tokens
          const approveTx = await writeApproveAsync({
            abi: ERC20_ABI,
            address: swapState.tokenIn.address,
            functionName: 'approve',
            args: [DEX_CONFIG.address, amountInWei],
            // Add missing properties to fix TypeScript errors
            chain: { id: chainId },
            account: address,
          });
          
          console.log('Approval transaction sent:', approveTx);
          toast.success('Token approval successful');
          
          await refetchAllowance();
        } catch (error) {
          console.error('Approval failed:', error);
          toast.error('Token approval failed');
          throw error;
        } finally {
          setIsApproving(false);
        }
      }
      
      // Execute swap
      console.log('Swapping tokens...');
      setIsSwapping(true);
      
      try {
        // Calculate deadline (current time + deadline minutes)
        const deadline = Math.floor(Date.now() / 1000) + swapState.deadline * 60;
        
        // Prepare swap path
        const path = [swapState.tokenIn.address, swapState.tokenOut.address];
        
        // Execute swap transaction
        const swapTx = await writeSwapAsync({
          abi: DEX_CONFIG.abi,
          address: DEX_CONFIG.address,
          functionName: 'swapExactTokensForTokens',
          args: [amountInWei, minAmountOut, path, address, BigInt(deadline)],
          // Add missing properties to fix TypeScript errors
          chain: { id: chainId },
          account: address,
        });
        
        console.log('Swap transaction sent:', swapTx);
        toast.success('Swap successful!');
        
        return swapTx;
      } catch (error) {
        console.error('Swap failed:', error);
        toast.error('Swap failed');
        throw error;
      } finally {
        setIsSwapping(false);
      }
    } catch (error) {
      console.error('Error in swap process:', error);
      toast.error('An error occurred during the swap process');
      throw error;
    }
  };
  
  return {
    performSwap,
    isApproving,
    isSwapping,
  };
};

export default useSwapAction;

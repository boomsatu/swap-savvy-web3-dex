
import { useState } from 'react';
import { parseUnits } from 'viem';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { DEX_CONFIG, ERC20_ABI } from '../config/contracts';
import { SwapState, Token } from '../types/token';
import { toast } from 'sonner';

export function useSwapAction(swapState: SwapState) {
  const { address } = useAccount();
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  
  // Get current timestamp in seconds + deadline minutes
  const getDeadline = () => {
    return Math.floor(Date.now() / 1000) + swapState.deadline * 60;
  };
  
  // Calculate minimum amount out based on slippage
  const calculateAmountOutMin = () => {
    if (!swapState.amountOut || !swapState.tokenOut) return BigInt(0);
    
    const amountOut = parseUnits(swapState.amountOut, swapState.tokenOut.decimals);
    const slippageFactor = 100 - swapState.slippage;
    const amountOutMin = (amountOut * BigInt(slippageFactor)) / BigInt(100);
    
    return amountOutMin;
  };
  
  // Check token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: swapState.tokenIn?.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, DEX_CONFIG.address],
    query: {
      enabled: !!(swapState.tokenIn && address),
    },
  });
  
  // Approve token spending
  const { writeContractAsync: approveToken } = useWriteContract();
  
  // Execute swap
  const { writeContractAsync: executeSwap } = useWriteContract();
  
  // Perform token approval if needed
  const checkAndApproveToken = async () => {
    if (!swapState.tokenIn || !address || !swapState.amountIn) {
      toast.error('Missing token or amount information');
      return false;
    }
    
    try {
      setIsApproving(true);
      const amountIn = parseUnits(swapState.amountIn, swapState.tokenIn.decimals);
      
      // Check if we need to approve
      if (allowance && BigInt(allowance.toString()) < amountIn) {
        const approveTx = await approveToken({
          address: swapState.tokenIn.address,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [DEX_CONFIG.address, amountIn],
        });
        
        if (approveTx) {
          toast.success('Token approval successful');
          await refetchAllowance();
          return true;
        }
      } else {
        // Already approved
        return true;
      }
    } catch (error) {
      console.error('Approval error:', error);
      toast.error('Failed to approve token');
      return false;
    } finally {
      setIsApproving(false);
    }
    
    return false;
  };
  
  // Perform the swap
  const performSwap = async () => {
    if (!swapState.tokenIn || !swapState.tokenOut || !address || !swapState.amountIn) {
      toast.error('Missing swap information');
      return;
    }
    
    try {
      setIsSwapping(true);
      
      // First check and approve if needed
      const isApproved = await checkAndApproveToken();
      if (!isApproved) return;
      
      const amountIn = parseUnits(swapState.amountIn, swapState.tokenIn.decimals);
      const amountOutMin = calculateAmountOutMin();
      const path = [swapState.tokenIn.address, swapState.tokenOut.address];
      const deadline = getDeadline();
      
      // Execute the swap
      const swapTx = await executeSwap({
        address: DEX_CONFIG.address,
        abi: DEX_CONFIG.abi,
        functionName: 'swapExactTokensForTokens',
        args: [amountIn, amountOutMin, path, address, BigInt(deadline)],
      });
      
      if (swapTx) {
        toast.success('Swap executed successfully!');
      }
    } catch (error: any) {
      console.error('Swap error:', error);
      toast.error(`Swap failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSwapping(false);
    }
  };
  
  return {
    performSwap,
    isApproving,
    isSwapping,
    checkAndApproveToken,
  };
}

export default useSwapAction;

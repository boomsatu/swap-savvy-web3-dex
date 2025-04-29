
import { useState, useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { DEX_CONFIG } from '../config/contracts';
import { SwapState } from '../types/token';

export function useSwap(swapState: SwapState) {
  const { tokenIn, tokenOut, amountIn } = swapState;
  const [isLoading, setIsLoading] = useState(false);
  const [priceImpact, setPriceImpact] = useState('0.00');
  
  // Get estimated amount out
  const { data: amountOutRaw, isPending: isLoadingAmountOut } = useReadContract({
    address: DEX_CONFIG.address,
    abi: DEX_CONFIG.abi,
    functionName: 'getAmountOut',
    args: [
      tokenIn && amountIn ? parseUnits(amountIn, tokenIn.decimals) : BigInt(0),
      tokenIn?.address ?? '0x',
      tokenOut?.address ?? '0x'
    ],
    query: {
      enabled: !!(tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0),
    }
  });
  
  // Get token price
  const { data: priceData, isPending: isLoadingPrice } = useReadContract({
    address: DEX_CONFIG.address,
    abi: DEX_CONFIG.abi,
    functionName: 'getTokenPrice',
    args: [
      tokenIn?.address ?? '0x',
      tokenOut?.address ?? '0x'
    ],
    query: {
      enabled: !!(tokenIn && tokenOut),
    }
  });
  
  // Calculate formatted amount out
  const [amountOut, setAmountOut] = useState('0');
  
  useEffect(() => {
    setIsLoading(isLoadingAmountOut || isLoadingPrice);
    
    if (amountOutRaw && tokenOut) {
      const formatted = formatUnits(amountOutRaw as bigint, tokenOut.decimals);
      setAmountOut(formatted);
      
      // Calculate price impact
      if (priceData && amountIn && parseFloat(amountIn) > 0) {
        const expectedPrice = formatUnits(priceData as bigint, 18);
        const actualPrice = parseFloat(formatted) / parseFloat(amountIn);
        const impact = Math.abs(((parseFloat(expectedPrice) - actualPrice) / parseFloat(expectedPrice)) * 100);
        setPriceImpact(impact.toFixed(2));
      }
    } else {
      setAmountOut('0');
    }
  }, [amountOutRaw, priceData, tokenOut, amountIn, isLoadingAmountOut, isLoadingPrice]);
  
  return {
    amountOut,
    priceImpact,
    isLoading,
  };
}

export default useSwap;

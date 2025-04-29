
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { ERC20_ABI } from '../config/contracts';
import { Token } from '../types/token';

export function useTokenBalance(token: Token | null) {
  const { address } = useAccount();
  const [formattedBalance, setFormattedBalance] = useState<string>('0');
  
  const { data: balance, isPending, isError, refetch } = useReadContract({
    address: token?.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!token,
    }
  });
  
  useEffect(() => {
    if (balance && token) {
      const formatted = formatUnits(balance as bigint, token.decimals);
      setFormattedBalance(parseFloat(formatted).toFixed(6));
    } else {
      setFormattedBalance('0');
    }
  }, [balance, token]);
  
  return {
    balance: formattedBalance,
    isLoading: isPending,
    isError,
    refetch,
  };
}

export default useTokenBalance;

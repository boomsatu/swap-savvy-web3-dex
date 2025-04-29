
import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { ERC20_ABI, DEFAULT_TOKENS } from '../config/contracts';
import { Token } from '../types/token';
import { Address } from 'viem';

export function useTokenSearch() {
  const [searchResults, setSearchResults] = useState<Token[]>(DEFAULT_TOKENS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: tokenName, isPending: isLoadingName } = useReadContract({
    address: searchTerm as Address,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: searchTerm?.startsWith('0x') && searchTerm.length === 42,
    }
  });
  
  const { data: tokenSymbol, isPending: isLoadingSymbol } = useReadContract({
    address: searchTerm as Address,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: searchTerm?.startsWith('0x') && searchTerm.length === 42,
    }
  });
  
  const { data: tokenDecimals, isPending: isLoadingDecimals } = useReadContract({
    address: searchTerm as Address,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: searchTerm?.startsWith('0x') && searchTerm.length === 42,
    }
  });
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setError(null);
    
    // If empty, show default tokens
    if (!term) {
      setSearchResults(DEFAULT_TOKENS);
      return;
    }
    
    // If it's an address
    if (term.startsWith('0x') && term.length === 42) {
      setIsLoading(true);
      // Wait for token data to load from contract
    } else {
      // Filter tokens by name or symbol
      const filteredTokens = DEFAULT_TOKENS.filter(token => 
        token.name.toLowerCase().includes(term.toLowerCase()) || 
        token.symbol.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredTokens);
    }
  };
  
  // Add custom token when data is loaded
  const addCustomToken = () => {
    if (tokenName && tokenSymbol && tokenDecimals !== undefined && searchTerm) {
      const newToken: Token = {
        address: searchTerm as Address,
        name: tokenName as string,
        symbol: tokenSymbol as string,
        decimals: Number(tokenDecimals),
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', // Default logo
      };
      
      // Add to results if not already in the list
      if (!searchResults.some(token => token.address === newToken.address)) {
        setSearchResults([newToken, ...searchResults]);
      }
      
      setError(null);
      setIsLoading(false);
      return newToken;
    }
    
    if (!isLoadingName && !isLoadingSymbol && !isLoadingDecimals && searchTerm?.startsWith('0x')) {
      setError('Invalid token address or contract');
      setIsLoading(false);
    }
    
    return null;
  };
  
  // Check if we have loaded token data
  if (tokenName && tokenSymbol && tokenDecimals !== undefined && searchTerm?.startsWith('0x')) {
    addCustomToken();
  }
  
  return {
    searchResults,
    handleSearch,
    isLoading: isLoading || isLoadingName || isLoadingSymbol || isLoadingDecimals,
    error,
    addCustomToken,
  };
}

export default useTokenSearch;

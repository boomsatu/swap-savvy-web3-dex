
import { useState, useEffect } from 'react';
import { useReadContract, useChainId } from 'wagmi';
import { ERC20_ABI, DEFAULT_TOKENS } from '../config/contracts';
import { Token } from '../types/token';
import { Address } from 'viem';
import { bsc, bscTestnet } from 'wagmi/chains';

export function useTokenSearch() {
  const [searchResults, setSearchResults] = useState<Token[]>(DEFAULT_TOKENS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();
  
  // Update default tokens when network changes
  useEffect(() => {
    if (chainId) {
      setSearchResults(DEFAULT_TOKENS);
    }
  }, [chainId]);

  const { data: tokenName, isPending: isLoadingName } = useReadContract({
    address: searchTerm as Address,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: Boolean(searchTerm?.startsWith('0x') && searchTerm.length === 42),
    }
  });
  
  const { data: tokenSymbol, isPending: isLoadingSymbol } = useReadContract({
    address: searchTerm as Address,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: Boolean(searchTerm?.startsWith('0x') && searchTerm.length === 42),
    }
  });
  
  const { data: tokenDecimals, isPending: isLoadingDecimals } = useReadContract({
    address: searchTerm as Address,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: Boolean(searchTerm?.startsWith('0x') && searchTerm.length === 42),
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
      console.log("Searching for token by address:", term);
      // Actual token data loading is handled by the useReadContract hooks above
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
      const networkName = chainId === bscTestnet.id ? 'Testnet' : 'Mainnet';
      const newToken: Token = {
        address: searchTerm as Address,
        name: tokenName as string,
        symbol: tokenSymbol as string,
        decimals: Number(tokenDecimals),
        // Use network-specific logo or fallback
        logoURI: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${searchTerm}/logo.png`,
        network: chainId === bscTestnet.id ? 'testnet' : 'mainnet',
      };
      
      console.log(`Token found on ${networkName}:`, newToken);
      
      // Add to results if not already in the list
      if (!searchResults.some(token => token.address.toLowerCase() === newToken.address.toLowerCase())) {
        setSearchResults([newToken, ...searchResults]);
      }
      
      setError(null);
      setIsLoading(false);
      return newToken;
    }
    
    if (!isLoadingName && !isLoadingSymbol && !isLoadingDecimals && searchTerm?.startsWith('0x')) {
      setError('Invalid token address or contract not found on this network');
      setIsLoading(false);
    }
    
    return null;
  };
  
  // Check if we have loaded token data
  useEffect(() => {
    if (tokenName && tokenSymbol && tokenDecimals !== undefined && searchTerm?.startsWith('0x')) {
      addCustomToken();
    }
  }, [tokenName, tokenSymbol, tokenDecimals, searchTerm]);
  
  // Update loading state based on contract read status
  useEffect(() => {
    if (searchTerm?.startsWith('0x') && searchTerm.length === 42) {
      setIsLoading(isLoadingName || isLoadingSymbol || isLoadingDecimals);
    }
  }, [isLoadingName, isLoadingSymbol, isLoadingDecimals, searchTerm]);
  
  return {
    searchResults,
    handleSearch,
    isLoading: isLoading,
    error,
    addCustomToken,
  };
}

export default useTokenSearch;

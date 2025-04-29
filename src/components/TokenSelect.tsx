
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronDown } from 'lucide-react';
import { Token } from '../types/token';
import useTokenSearch from '../hooks/useTokenSearch';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { useToast } from '@/components/ui/use-toast';
import NetworkSelector from './token/NetworkSelector';
import TokenSearch from './token/TokenSearch';
import TokenList from './token/TokenList';

interface TokenSelectProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  label: string;
  className?: string;
}

const TokenSelect = ({ selectedToken, onTokenSelect, label, className }: TokenSelectProps) => {
  const [open, setOpen] = useState(false);
  const { searchResults, handleSearch, isLoading, error, addCustomToken } = useTokenSearch();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();
  const [addressInput, setAddressInput] = useState('');
  
  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setOpen(false);
    setAddressInput('');
  };
  
  const handleNetworkSwitch = (chainId: number) => {
    if (switchChain) {
      switchChain({ chainId });
      toast({
        title: "Network Changed",
        description: `Switched to ${chainId === bsc.id ? 'BSC Mainnet' : 'BSC Testnet'}`,
      });
    }
  };

  const handleAddressInput = (value: string) => {
    setAddressInput(value);
    handleSearch(value);
  };

  const handleSearchOrAdd = () => {
    if (addressInput && addressInput.startsWith('0x') && addressInput.length === 42) {
      const token = addCustomToken();
      if (token) {
        toast({
          title: "Token Added",
          description: `${token.symbol} (${token.name}) has been added to the list`,
        });
      }
    }
  };

  const showAddButton = addressInput && addressInput.startsWith('0x') && addressInput.length === 42;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex justify-between w-full h-14 gap-2 px-4 border border-white/10 bg-transparent hover:bg-white/5 ${className}`}
          disabled={!isConnected}
        >
          {selectedToken ? (
            <div className="flex items-center gap-2">
              {selectedToken.logoURI && (
                <img 
                  src={selectedToken.logoURI} 
                  alt={selectedToken.symbol} 
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-semibold">{selectedToken.symbol}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{label}</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel border-none max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Select a token</span>
            <NetworkSelector 
              chainId={chainId}
              onNetworkSwitch={handleNetworkSwitch}
            />
          </DialogTitle>
          
          <TokenSearch 
            searchTerm={addressInput}
            onSearchChange={handleAddressInput}
            isLoading={isLoading}
            onAddToken={handleSearchOrAdd}
            showAddButton={showAddButton}
          />
        </DialogHeader>
        
        <TokenList 
          tokens={searchResults}
          isLoading={isLoading}
          error={error}
          onSelect={handleTokenSelect}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelect;


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader, ChevronDown, Search, Network } from 'lucide-react';
import { Token } from '../types/token';
import useTokenSearch from '../hooks/useTokenSearch';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { useToast } from '@/components/ui/use-toast';

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
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={chainId === bsc.id ? "default" : "outline"} 
                onClick={() => handleNetworkSwitch(bsc.id)}
                className="text-xs"
              >
                <Network className="h-3 w-3 mr-1" /> Mainnet
              </Button>
              <Button 
                size="sm" 
                variant={chainId === bscTestnet.id ? "default" : "outline"} 
                onClick={() => handleNetworkSwitch(bscTestnet.id)}
                className="text-xs"
              >
                <Network className="h-3 w-3 mr-1" /> Testnet
              </Button>
            </div>
          </DialogTitle>
          <div className="relative mt-4 flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute top-3 left-3 h-4 w-4 opacity-50" />
              <Input
                placeholder="Search by name, symbol, or paste address"
                className="pl-10 bg-white/5 border-white/10"
                value={addressInput}
                onChange={(e) => handleAddressInput(e.target.value)}
                autoFocus
              />
            </div>
            {addressInput && addressInput.startsWith('0x') && addressInput.length === 42 && (
              <Button onClick={handleSearchOrAdd} disabled={isLoading}>
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-80 mt-2 pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="h-8 w-8 animate-spin opacity-70" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">No tokens found</div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((token) => (
                <Button
                  key={token.address}
                  variant="ghost"
                  className="w-full justify-start h-14 px-4 hover:bg-white/5"
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="flex items-center gap-3">
                    {token.logoURI && (
                      <img 
                        src={token.logoURI} 
                        alt={token.symbol} 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{token.symbol}</span>
                      <span className="text-xs text-muted-foreground">{token.name}</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelect;

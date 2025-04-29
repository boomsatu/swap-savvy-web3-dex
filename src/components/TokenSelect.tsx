
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
import { Loader, ChevronDown, Search } from 'lucide-react';
import { Token } from '../types/token';
import useTokenSearch from '../hooks/useTokenSearch';
import { useAccount } from 'wagmi';

interface TokenSelectProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  label: string;
  className?: string;
}

const TokenSelect = ({ selectedToken, onTokenSelect, label, className }: TokenSelectProps) => {
  const [open, setOpen] = useState(false);
  const { searchResults, handleSearch, isLoading, error } = useTokenSearch();
  const { isConnected } = useAccount();
  
  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setOpen(false);
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
          <DialogTitle>Select a token</DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute top-3 left-3 h-4 w-4 opacity-50" />
            <Input
              placeholder="Search by name, symbol, or paste address"
              className="pl-10 bg-white/5 border-white/10"
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
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

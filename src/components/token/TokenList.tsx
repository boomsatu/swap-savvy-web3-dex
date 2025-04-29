
import { Loader } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Token } from '../../types/token';
import TokenItem from './TokenItem';

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  onSelect: (token: Token) => void;
}

const TokenList = ({ tokens, isLoading, error, onSelect }: TokenListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="h-8 w-8 animate-spin opacity-70" />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }
  
  if (tokens.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No tokens found</div>;
  }

  return (
    <ScrollArea className="h-80 mt-2 pr-4">
      <div className="space-y-1">
        {tokens.map((token) => (
          <TokenItem 
            key={token.address} 
            token={token} 
            onSelect={onSelect} 
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TokenList;

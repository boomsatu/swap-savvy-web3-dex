
import { Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TokenSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  onAddToken: () => void;
  showAddButton: boolean;
}

const TokenSearch = ({ 
  searchTerm, 
  onSearchChange, 
  isLoading,
  onAddToken,
  showAddButton
}: TokenSearchProps) => {
  return (
    <div className="relative mt-4 flex gap-2">
      <div className="relative flex-grow">
        <Search className="absolute top-3 left-3 h-4 w-4 opacity-50" />
        <Input
          placeholder="Search by name, symbol, or paste address"
          className="pl-10 bg-white/5 border-white/10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
        />
      </div>
      {showAddButton && (
        <Button onClick={onAddToken} disabled={isLoading}>
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Add"}
        </Button>
      )}
    </div>
  );
};

export default TokenSearch;

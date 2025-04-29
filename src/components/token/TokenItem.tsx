
import { Token } from '../../types/token';

interface TokenItemProps {
  token: Token;
  onSelect: (token: Token) => void;
}

const TokenItem = ({ token, onSelect }: TokenItemProps) => {
  return (
    <button
      className="w-full justify-start h-14 px-4 hover:bg-white/5 text-left flex items-center gap-3"
      onClick={() => onSelect(token)}
    >
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
    </button>
  );
};

export default TokenItem;

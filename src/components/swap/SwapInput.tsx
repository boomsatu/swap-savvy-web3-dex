
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TokenSelect from '../TokenSelect';
import { Token } from '../../types/token';

interface SwapInputProps {
  token: Token | null;
  amount: string;
  onTokenSelect: (token: Token) => void;
  onAmountChange?: (value: string) => void;
  showMaxButton?: boolean;
  onMaxClick?: () => void;
  balance?: string;
  disabled?: boolean;
  isOutput?: boolean;
}

const SwapInput = ({
  token,
  amount,
  onTokenSelect,
  onAmountChange,
  showMaxButton = false,
  onMaxClick,
  balance,
  disabled = false,
  isOutput = false,
}: SwapInputProps) => {
  return (
    <div className="relative bg-white/5 rounded-xl p-4">
      <div className="flex justify-between mb-2">
        <TokenSelect
          selectedToken={token}
          onTokenSelect={onTokenSelect}
          label="Select token"
          className="max-w-[140px] h-10"
        />
        {token && balance && (
          <Button 
            variant="link" 
            className="text-xs h-5 p-0 text-dex-purple hover:text-dex-pink"
            onClick={onMaxClick}
            disabled={!showMaxButton}
          >
            Balance: {balance} {showMaxButton && <span className="ml-1">MAX</span>}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="0.0"
          className="text-2xl font-medium bg-transparent border-none h-12 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={isOutput ? parseFloat(amount || '0').toFixed(6) : amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          disabled={disabled || isOutput}
        />
      </div>
    </div>
  );
};

export default SwapInput;

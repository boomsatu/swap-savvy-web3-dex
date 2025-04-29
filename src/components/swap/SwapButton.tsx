
import { Button } from '@/components/ui/button';
import { Loader, ArrowRight } from 'lucide-react';

interface SwapButtonProps {
  isConnected: boolean;
  isInsufficientBalance: boolean;
  hasTokenSelection: boolean;
  hasAmount: boolean;
  isLoadingSwap: boolean;
  isApproving: boolean;
  isSwapping: boolean;
  onClick: () => void;
  disabled: boolean;
}

const SwapButton = ({ 
  isConnected,
  isInsufficientBalance,
  hasTokenSelection,
  hasAmount,
  isLoadingSwap,
  isApproving,
  isSwapping,
  onClick,
  disabled
}: SwapButtonProps) => {
  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isInsufficientBalance) return 'Insufficient Balance';
    if (!hasTokenSelection) return 'Select Tokens';
    if (!hasAmount) return 'Enter Amount';
    
    if (isLoadingSwap) {
      return (
        <div className="flex items-center">
          <Loader className="h-4 w-4 mr-2 animate-spin" />
          Calculating
        </div>
      );
    }
    
    if (isApproving) {
      return (
        <div className="flex items-center">
          <Loader className="h-4 w-4 mr-2 animate-spin" />
          Approving
        </div>
      );
    }
    
    if (isSwapping) {
      return (
        <div className="flex items-center">
          <Loader className="h-4 w-4 mr-2 animate-spin" />
          Swapping
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center">
        Swap
        <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    );
  };

  return (
    <Button
      className="w-full bg-dex-gradient hover:opacity-90 text-white h-12"
      disabled={disabled}
      onClick={onClick}
    >
      {getButtonText()}
    </Button>
  );
};

export default SwapButton;

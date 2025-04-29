
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, Settings } from 'lucide-react';
import { Token, SwapState } from '../types/token';
import useTokenBalance from '../hooks/useTokenBalance';
import useSwap from '../hooks/useSwap';
import useSwapAction from '../hooks/useSwapAction';
import { DEFAULT_TOKENS } from '@/config/contracts';
import { toast } from 'sonner';

// Import our new components
import SwapInput from './swap/SwapInput';
import SwapDetails from './swap/SwapDetails';
import SwapButton from './swap/SwapButton';

const SwapCard = () => {
  const { isConnected } = useAccount();
  const [swapState, setSwapState] = useState<SwapState>({
    tokenIn: null,
    tokenOut: null,
    amountIn: '',
    amountOut: '0',
    slippage: 0.5,
    deadline: 20,
  });
  
  // Get token balances
  const { balance: balanceIn } = useTokenBalance(swapState.tokenIn);
  const { balance: balanceOut } = useTokenBalance(swapState.tokenOut);
  
  // Calculate swap details
  const { amountOut, priceImpact, isLoading: isLoadingSwap } = useSwap(swapState);
  
  // Swap action hook
  const { performSwap, isApproving, isSwapping } = useSwapAction(swapState);
  
  // Set initial tokens when connected
  useEffect(() => {
    if (isConnected && !swapState.tokenIn && !swapState.tokenOut) {
      setSwapState((prev) => ({
        ...prev,
        tokenIn: DEFAULT_TOKENS[0], // WBNB
        tokenOut: DEFAULT_TOKENS[1], // USDT
      }));
    }
  }, [isConnected, swapState.tokenIn, swapState.tokenOut]);
  
  // Update amount out when calculation updates
  useEffect(() => {
    if (amountOut) {
      setSwapState((prev) => ({
        ...prev,
        amountOut,
      }));
    }
  }, [amountOut]);
  
  // Handle input amount change
  const handleAmountInChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setSwapState((prev) => ({
        ...prev,
        amountIn: value,
      }));
    }
  };
  
  // Handle token selection
  const handleSelectTokenIn = (token: Token) => {
    // Prevent selecting same token
    if (swapState.tokenOut && token.address === swapState.tokenOut.address) {
      // Swap tokens
      setSwapState((prev) => ({
        ...prev,
        tokenIn: prev.tokenOut,
        tokenOut: prev.tokenIn,
      }));
    } else {
      setSwapState((prev) => ({
        ...prev,
        tokenIn: token,
      }));
    }
  };
  
  const handleSelectTokenOut = (token: Token) => {
    // Prevent selecting same token
    if (swapState.tokenIn && token.address === swapState.tokenIn.address) {
      // Swap tokens
      setSwapState((prev) => ({
        ...prev,
        tokenIn: prev.tokenOut,
        tokenOut: prev.tokenIn,
      }));
    } else {
      setSwapState((prev) => ({
        ...prev,
        tokenOut: token,
      }));
    }
  };
  
  // Switch tokens
  const handleSwitchTokens = () => {
    setSwapState((prev) => ({
      ...prev,
      tokenIn: prev.tokenOut,
      tokenOut: prev.tokenIn,
      amountIn: prev.amountOut !== '0' ? prev.amountOut : prev.amountIn,
      amountOut: prev.amountIn,
    }));
  };
  
  // Set max amount
  const handleSetMaxAmount = () => {
    if (swapState.tokenIn && balanceIn) {
      handleAmountInChange(balanceIn);
    }
  };
  
  // Handle swap
  const handleSwap = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      await performSwap();
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed. Please try again.');
    }
  };
  
  const isInsufficientBalance = swapState.tokenIn && swapState.amountIn && 
    parseFloat(swapState.amountIn) > parseFloat(balanceIn || '0');
    
  const shouldEnableSwap = swapState.tokenIn && swapState.tokenOut && 
    swapState.amountIn && parseFloat(swapState.amountIn) > 0 && !isInsufficientBalance;
  
  return (
    <Card className="glass-panel purple-glow w-full max-w-md border-none">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-medium">Swap</h2>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Input token */}
        <SwapInput
          token={swapState.tokenIn}
          amount={swapState.amountIn}
          onTokenSelect={handleSelectTokenIn}
          onAmountChange={handleAmountInChange}
          showMaxButton={!!swapState.tokenIn && !!balanceIn}
          onMaxClick={handleSetMaxAmount}
          balance={balanceIn}
          disabled={!isConnected}
        />
        
        {/* Switch button */}
        <div className="relative flex justify-center -my-2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 bg-dex-gradient shadow-md"
            onClick={handleSwitchTokens}
          >
            <ArrowDown className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        {/* Output token */}
        <SwapInput
          token={swapState.tokenOut}
          amount={swapState.amountOut}
          onTokenSelect={handleSelectTokenOut}
          balance={balanceOut}
          disabled={!isConnected}
          isOutput={true}
        />
        
        {/* Swap details */}
        {swapState.tokenIn && swapState.tokenOut && swapState.amountIn && parseFloat(swapState.amountIn) > 0 && (
          <SwapDetails swapState={swapState} priceImpact={priceImpact} />
        )}
      </CardContent>
      <CardFooter>
        <SwapButton
          isConnected={isConnected}
          isInsufficientBalance={!!isInsufficientBalance}
          hasTokenSelection={!!(swapState.tokenIn && swapState.tokenOut)}
          hasAmount={!!(swapState.amountIn && parseFloat(swapState.amountIn) > 0)}
          isLoadingSwap={isLoadingSwap}
          isApproving={isApproving}
          isSwapping={isSwapping}
          onClick={handleSwap}
          disabled={!shouldEnableSwap || isLoadingSwap || isApproving || isSwapping}
        />
      </CardFooter>
    </Card>
  );
};

export default SwapCard;

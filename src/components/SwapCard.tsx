
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TokenSelect from './TokenSelect';
import { ArrowDown, Settings, ArrowRight, Loader } from 'lucide-react';
import { Token, SwapState } from '../types/token';
import useTokenBalance from '../hooks/useTokenBalance';
import useSwap from '../hooks/useSwap';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_TOKENS } from '@/config/contracts';
import { toast } from 'sonner';

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
  const handleSwap = () => {
    toast.success('Swap initiated! This is a demo - no actual swap will occur.');
  };
  
  // Format price if both tokens are selected
  const getPriceText = () => {
    if (swapState.tokenIn && swapState.tokenOut && swapState.amountIn && parseFloat(swapState.amountOut) > 0) {
      const price = parseFloat(swapState.amountOut) / parseFloat(swapState.amountIn);
      return `1 ${swapState.tokenIn.symbol} = ${price.toFixed(6)} ${swapState.tokenOut.symbol}`;
    }
    return '—';
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
        <div className="relative bg-white/5 rounded-xl p-4 mb-2">
          <div className="flex justify-between mb-2">
            <TokenSelect
              selectedToken={swapState.tokenIn}
              onTokenSelect={handleSelectTokenIn}
              label="Select token"
              className="max-w-[140px] h-10"
            />
            {swapState.tokenIn && balanceIn && (
              <Button 
                variant="link" 
                className="text-xs h-5 p-0 text-dex-purple hover:text-dex-pink"
                onClick={handleSetMaxAmount}
              >
                Balance: {balanceIn} <span className="ml-1">MAX</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="0.0"
              className="text-2xl font-medium bg-transparent border-none h-12 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={swapState.amountIn}
              onChange={(e) => handleAmountInChange(e.target.value)}
              disabled={!isConnected || !swapState.tokenIn}
            />
          </div>
        </div>
        
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
        <div className="relative bg-white/5 rounded-xl p-4 mt-2">
          <div className="flex justify-between mb-2">
            <TokenSelect
              selectedToken={swapState.tokenOut}
              onTokenSelect={handleSelectTokenOut}
              label="Select token"
              className="max-w-[140px] h-10"
            />
            {swapState.tokenOut && balanceOut && (
              <span className="text-xs text-muted-foreground">
                Balance: {balanceOut}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="0.0"
              className="text-2xl font-medium bg-transparent border-none h-12 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={parseFloat(swapState.amountOut).toFixed(6)}
              disabled={true}
            />
          </div>
        </div>
        
        {/* Swap details */}
        {swapState.tokenIn && swapState.tokenOut && swapState.amountIn && parseFloat(swapState.amountIn) > 0 && (
          <div className="mt-4 space-y-2 bg-white/5 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price</span>
              <span>{getPriceText()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price Impact</span>
              <span className={parseFloat(priceImpact) > 5 ? 'text-red-500' : ''}>
                {priceImpact}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span>{swapState.slippage}%</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-dex-gradient hover:opacity-90 text-white h-12"
          disabled={!shouldEnableSwap || isLoadingSwap}
          onClick={handleSwap}
        >
          {!isConnected ? (
            'Connect Wallet'
          ) : isInsufficientBalance ? (
            'Insufficient Balance'
          ) : !swapState.tokenIn || !swapState.tokenOut ? (
            'Select Tokens'
          ) : !swapState.amountIn || parseFloat(swapState.amountIn) === 0 ? (
            'Enter Amount'
          ) : isLoadingSwap ? (
            <div className="flex items-center">
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Calculating
            </div>
          ) : (
            <div className="flex items-center justify-center">
              Swap
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SwapCard;

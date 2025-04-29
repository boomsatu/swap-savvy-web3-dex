
import { SwapState } from '../../types/token';

interface SwapDetailsProps {
  swapState: SwapState;
  priceImpact: string;
}

const SwapDetails = ({ swapState, priceImpact }: SwapDetailsProps) => {
  // Format price if both tokens are selected
  const getPriceText = () => {
    if (swapState.tokenIn && swapState.tokenOut && swapState.amountIn && parseFloat(swapState.amountOut) > 0) {
      const price = parseFloat(swapState.amountOut) / parseFloat(swapState.amountIn);
      return `1 ${swapState.tokenIn.symbol} = ${price.toFixed(6)} ${swapState.tokenOut.symbol}`;
    }
    return '—';
  };
  
  return (
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
  );
};

export default SwapDetails;

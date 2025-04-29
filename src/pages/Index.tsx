
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SwapCard from '@/components/SwapCard';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

const Index = () => {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Show welcome toast when user connects wallet
  useEffect(() => {
    if (mounted && isConnected) {
      toast.success('Wallet connected! Welcome to SwapSavvy DEX.');
    }
  }, [isConnected, mounted]);
  
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-screen-xl w-full flex flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-dex-gradient">
              Swap Tokens Instantly
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fast, secure token swaps with minimal slippage and the best rates on Binance Smart Chain.
            </p>
          </div>
          
          <SwapCard />
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>This is a demo DEX interface. No real transactions are processed.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;


import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { web3Modal } from '@/config/wagmi';
import { Loader } from 'lucide-react';

const ConnectButton = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });
  
  // Handle wallet connection
  const openWeb3Modal = () => {
    web3Modal.open();
  };
  
  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Make sure we're not rendering during SSR
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div>
      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-dex-gradient hover:opacity-90 text-white">
              {isBalanceLoading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <span className="mr-2">
                  {balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(4) : '0'} BNB
                </span>
              )}
              {address && formatAddress(address)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-panel border-none">
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-dex-hover" 
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(address || '');
                }
              }}
            >
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-dex-hover"
              onClick={() => disconnect()}
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={openWeb3Modal} className="bg-dex-gradient hover:opacity-90 text-white">
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectButton;

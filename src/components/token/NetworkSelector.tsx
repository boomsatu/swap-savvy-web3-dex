
import { Button } from '@/components/ui/button';
import { Network } from 'lucide-react';
import { bsc, bscTestnet } from 'wagmi/chains';

interface NetworkSelectorProps {
  chainId: number;
  onNetworkSwitch: (chainId: number) => void;
}

const NetworkSelector = ({ chainId, onNetworkSwitch }: NetworkSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant={chainId === bsc.id ? "default" : "outline"} 
        onClick={() => onNetworkSwitch(bsc.id)}
        className="text-xs"
      >
        <Network className="h-3 w-3 mr-1" /> Mainnet
      </Button>
      <Button 
        size="sm" 
        variant={chainId === bscTestnet.id ? "default" : "outline"} 
        onClick={() => onNetworkSwitch(bscTestnet.id)}
        className="text-xs"
      >
        <Network className="h-3 w-3 mr-1" /> Testnet
      </Button>
    </div>
  );
};

export default NetworkSelector;

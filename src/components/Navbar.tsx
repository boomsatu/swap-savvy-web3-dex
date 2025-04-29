
import { useAccount } from 'wagmi';
import ConnectButton from './ConnectButton';

const Navbar = () => {
  const { isConnected } = useAccount();

  return (
    <nav className="py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-dex-gradient">
          SwapSavvy
        </span>
      </div>
      <ConnectButton />
    </nav>
  );
};

export default Navbar;

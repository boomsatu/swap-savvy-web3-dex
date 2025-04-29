
import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi';
import { walletConnect } from 'wagmi/connectors';
import { injected } from 'wagmi/connectors';

// Get projectId from WalletConnect Cloud
const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID';

// Support both mainnet and testnet
const chains = [bsc, bscTestnet];

export const config = createConfig({
  chains: chains as any, // Type assertion to avoid type errors with readonly array
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http()
  },
  connectors: [
    injected(),
    walletConnect({ projectId })
  ],
});

export const wagmiConfig = config;

export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#8B5CF6',
    '--w3m-color-bg': '#1A1F2C' // Corrected property name
  },
  featuredWalletIds: [],
});

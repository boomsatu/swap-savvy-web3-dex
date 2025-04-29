
import { http, createConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi';
import { walletConnect } from 'wagmi/connectors';
import { injected } from 'wagmi/connectors';

// Get projectId from WalletConnect Cloud
const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID';

export const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http()
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
    '--w3m-background-color': '#1A1F2C'
  },
  featuredWalletIds: [],
});


import { Address } from 'viem';

export const DEX_CONFIG = {
  address: '0x10ED43C718714eb63d5aA57B78B54704E256024E' as Address, // PancakeSwap Router - for demo purposes
  abi: [
    {
      "inputs": [
        { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
        { "internalType": "address", "name": "tokenIn", "type": "address" },
        { "internalType": "address", "name": "tokenOut", "type": "address" }
      ],
      "name": "getAmountOut",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "tokenIn", "type": "address" },
        { "internalType": "address", "name": "tokenOut", "type": "address" }
      ],
      "name": "getTokenPrice",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "WBNB",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "factory",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feePercent",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as Address
};

export const ERC20_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const DEFAULT_TOKENS = [
  {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as Address,
    symbol: 'WBNB',
    name: 'Wrapped BNB',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png'
  },
  {
    address: '0x55d398326f99059fF775485246999027B3197955' as Address,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
  },
  {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' as Address,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
  },
  {
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c' as Address,
    symbol: 'BTC',
    name: 'Bitcoin BEP20',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
  },
  {
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8' as Address,
    symbol: 'ETH',
    name: 'Ethereum BEP20',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  }
];

import { AbstractConnector } from '@web3-react/abstract-connector';

import { injected } from '../connectors';

export const NetworkContextName = 'NETWORK';

export interface WalletInfo {
  color: string;
  connector?: AbstractConnector;
  description: string;
  href: string | null;
  iconName: string;
  mobile?: true;
  mobileOnly?: true;
  name: string;
  primary?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    color: '#010101',
    connector: injected,
    description: 'Injected web3 provider.',
    href: null,
    iconName: 'arrow-right.svg',
    name: 'Injected',
    primary: true,
  },
  METAMASK: {
    color: '#E8831D',
    connector: injected,
    description: 'Easy-to-use browser extension.',
    href: null,
    iconName: 'metamask.png',
    name: 'MetaMask',
  },
};

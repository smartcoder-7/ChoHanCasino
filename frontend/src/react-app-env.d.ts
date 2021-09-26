/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    autoRefreshOnNetworkChange?: boolean;
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
  };
  web3?: Record<string, unknown>;
}

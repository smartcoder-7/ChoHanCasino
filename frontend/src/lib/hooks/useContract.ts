import { Contract, ContractInterface } from '@ethersproject/contracts';
import { useMemo } from 'react';

import config from '../../config';
import casinoContractAbi from '../../contracts/abis/ChoHanCasino.json';
import getContract from '../utils/getContract';
import { useActiveWeb3React } from './useConnect';

export default function useContract(
  address: string | undefined,
  ABI: ContractInterface,
  withSignerIfPossible = true,
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) {
      return null;
    }
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useCasinoContract(): Contract | null {
  return useContract(config.casinoContractAddress, casinoContractAbi.abi);
}

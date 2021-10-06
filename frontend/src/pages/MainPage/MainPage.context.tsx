import { useWeb3React } from '@web3-react/core';
import { Contract, utils } from 'ethers';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { GameStatusProps } from '../../components/modules/MainPage/GameStatusCard/GameStatusCard';
import { createContext } from '../../lib/utils/context';
import { mapToGameStatus } from './MainPage.utils';

const ADMIN_ADDRESS = '0xABd2b1DF2AA03Df2c804af40A73BeddA8148588E';

interface Props {
  children: ReactNode;
  contract: Contract;
}

interface MainPageContextProps {
  gameStatus: GameStatusProps | null;
  handleBet: () => void;
  handleEndBet: () => void;
  isAdmin: boolean;
  setGameStatus: Dispatch<SetStateAction<GameStatusProps | null>>;
  tableData: GameStatusProps[];
}

const MainPageContext = createContext<MainPageContextProps>();

function useContextSetup({
  contract,
}: {
  contract: Contract;
}): MainPageContextProps {
  const { account } = useWeb3React();

  const [gameStatus, setGameStatus] = useState<GameStatusProps | null>(null);
  const [tableData, setTableData] = useState<GameStatusProps[]>([]);

  useEffect(() => {
    if (!contract) {
      return;
    }

    contract.on('BetPlaced', (status, totalBet, numberOfPlayers, event) => {
      console.info('Bet placed', status, totalBet, numberOfPlayers, event);
    });

    contract.on('Won', (status, address, amount) => {
      console.info('Won event', status, address, amount);
    });
  }, [contract]);

  //fetch initial data
  useEffect(() => {
    if (!contract) {
      return;
    }
    (async () => {
      const currentBetId = await contract.currentBetId();
      const currentBet = await contract.bets(currentBetId);

      console.info('currentBetId', currentBetId.toNumber());

      const promises = Array(currentBetId)
        .fill(0)
        .map((_, index) => {
          return contract.bets(index);
        });

      const results = await Promise.all(promises);
      setTableData(results.map((result) => mapToGameStatus(result)));
      setGameStatus(mapToGameStatus(currentBet));
    })();
  }, [contract]);

  const handleBet = async () => {
    try {
      const overrides = {
        from: account,
        value: utils.parseEther('0.1'),
      };
      await contract.bet(0, overrides);
    } catch (error) {
      console.error('error');
    }
  };

  const handleEndBet = async () => {
    try {
      await contract.betEnd();
    } catch (error) {
      console.error('error', error);
    }
  };

  const isAdmin = ADMIN_ADDRESS === account;

  return {
    gameStatus,
    handleBet,
    handleEndBet,
    isAdmin,
    setGameStatus,
    tableData,
  };
}

export function MainPageContextProvider({ children, contract }: Props) {
  const value = useContextSetup({ contract });

  return (
    <MainPageContext.Provider value={value}>
      {children}
    </MainPageContext.Provider>
  );
}

export const useMainPageContext = MainPageContext.useContext;

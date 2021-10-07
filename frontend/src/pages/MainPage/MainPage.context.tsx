import { useWeb3React } from '@web3-react/core';
import { Contract, utils } from 'ethers';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { FormValues } from '../../components/modules/MainPage/GameBoard/GameBoard';
import { GameStatusProps } from '../../components/modules/MainPage/GameStatusCard/GameStatusCard';
import config from '../../config';
import { createContext } from '../../lib/utils/context';
import notifier from '../../lib/utils/notifier';
import { GameStatus } from './MainPage.types';
import { mapToGameStatus } from './MainPage.utils';

interface Props {
  children: ReactNode;
  contract: Contract;
}

interface MainPageContextProps {
  gameStatus: GameStatusProps | null;
  handleBet: (values: FormValues) => void;
  handleEndBet: () => void;
  isAdmin: boolean;
  isLoading: boolean;
  setGameStatus: Dispatch<SetStateAction<GameStatusProps | null>>;
  tableData: GameStatus[];
}

const MainPageContext = createContext<MainPageContextProps>();

function useContextSetup({
  contract,
}: {
  contract: Contract;
}): MainPageContextProps {
  const { account } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatusProps | null>(null);
  const [tableData, setTableData] = useState<GameStatus[]>([]);

  //listen to events
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
    try {
      setIsLoading(true);
      (async () => {
        const currentBetId = await contract.currentBetId();
        const currentBet = await contract.bets(currentBetId);
        const minimumBet = await contract.minimumBet();

        const promises = Array(currentBetId)
          .fill(0)
          .map((_, index) => {
            return contract.bets(index);
          });

        const results = await Promise.all(promises);
        setTableData(results.map((result) => mapToGameStatus(result)));
        setGameStatus({
          ...mapToGameStatus(currentBet),
          minimumBet: parseFloat(utils.formatUnits(minimumBet, 18).toString()),
        });
      })();
    } catch (error) {
      notifier.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const handleBet = async ({ amount, choice }: FormValues) => {
    try {
      setIsLoading(true);
      const overrides = {
        from: account,
        value: utils.parseEther(amount + ''),
      };
      await contract.bet(choice, overrides);
    } catch (error) {
      notifier.error('Something went wrong!');
      console.error('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndBet = async () => {
    try {
      setIsLoading(true);
      await contract.betEnd();
    } catch (error) {
      notifier.error('Something went wrong!');
      console.error('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = config.adminAddress === account;

  return {
    gameStatus,
    handleBet,
    handleEndBet,
    isAdmin,
    isLoading,
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

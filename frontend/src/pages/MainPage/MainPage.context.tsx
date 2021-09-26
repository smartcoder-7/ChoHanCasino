import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

import { createContext } from '../../lib/utils/context';
import { GameStatus } from './MainPage.types';

interface Props {
  children: ReactNode;
}

interface MainPageContextProps {
  gameStatus?: GameStatus;
  setGameStatus: Dispatch<SetStateAction<GameStatus | undefined>>;
}

const MainPageContext = createContext<MainPageContextProps>();

function useContextSetup(): MainPageContextProps {
  const [gameStatus, setGameStatus] = useState<GameStatus | undefined>();

  return {
    gameStatus,
    setGameStatus,
  };
}

export function MainPageContextProvider({ children }: Props) {
  const value = useContextSetup();

  return (
    <MainPageContext.Provider value={value}>
      {children}
    </MainPageContext.Provider>
  );
}

export const useCartSummaryContext = MainPageContext.useContext;

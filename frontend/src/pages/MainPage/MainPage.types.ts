import { BigNumber } from 'ethers';

export interface Bet {
  ended: boolean;
  id: BigNumber;
  numberOfPlayers: BigNumber;
  numberWinner: BigNumber;
  totalBet: BigNumber;
}

export interface GameStatus {
  ended: string;
  id: number;
  numberOfPlayers: number;
  numberWinner: number;
  totalBet: number;
}

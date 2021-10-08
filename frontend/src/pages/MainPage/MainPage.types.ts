import { BigNumber } from 'ethers';

export interface Bet {
  ended: boolean;
  id: BigNumber;
  numberOfPlayers: BigNumber;
  pair: BigNumber[];
  pairity: number;
  totalBet: BigNumber;
}

export interface GameStatus {
  ended: string;
  id: number;
  numberOfPlayers: number;
  pair: string;
  pairity: string;
  totalBet: number;
}

export enum CasinoEvent {
  BET_ENDED = 'BetEnded',
  BET_PLACED = 'BetPlaced',
  BET_RESULT = 'BetResult',
}

export interface PlayerInfo {
  amountBet: BigNumber;
  id: BigNumber;
  pairity: number;
  playerAddress: string;
}

export interface Player {
  amountBet: number;
  id: number;
  pairity: string;
  playerAddress: string;
}

import { BigNumber } from 'ethers';

export interface Bet {
  ended: boolean;
  id: BigNumber;
  numberOfPlayers: BigNumber;
  numberWinner: BigNumber;
  totalBet: BigNumber;
}

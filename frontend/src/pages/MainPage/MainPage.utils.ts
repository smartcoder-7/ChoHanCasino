import { utils } from 'ethers';

import { HeadCell } from '../../components/modules/MainPage/BetTable/BetTableHead';
import { Bet, GameStatus } from './MainPage.types';

export const mapToGameStatus = (bet: Bet): GameStatus => ({
  ended: bet.ended ? 'Ended' : 'In progress',
  id: bet.id.toNumber(),
  numberOfPlayers: bet.numberOfPlayers.toNumber(),
  numberWinner: bet.numberWinner.toNumber(),
  totalBet: parseFloat(utils.formatUnits(bet.totalBet, 18).toString()),
});

export const HEAD_CELLS: HeadCell[] = [
  { id: 'id', label: 'Id', numeric: true },
  { id: 'numberOfPlayers', label: '# of players', numeric: true },
  { id: 'totalBet', label: 'Total bet', numeric: true },
  { id: 'numberWinner', label: 'Number Winner', numeric: true },
  { id: 'ended', label: 'Ended', numeric: false },
];

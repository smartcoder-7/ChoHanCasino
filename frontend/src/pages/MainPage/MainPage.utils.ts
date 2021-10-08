import { utils } from 'ethers';

import { HeadCell } from '../../components/modules/MainPage/BetTable/BetTableHead';
import { Bet, GameStatus, Player, PlayerInfo } from './MainPage.types';

export const mapToGameStatus = (bet: Bet): GameStatus => ({
  ended: bet.ended ? 'Ended' : 'In progress',
  id: bet.id.toNumber(),
  numberOfPlayers: bet.numberOfPlayers.toNumber(),
  pair: [bet.pair[0].toNumber(), bet.pair[1].toNumber()].join(','),
  pairity: bet.pairity === 2 ? 'Unknown' : !bet.pairity ? 'Odd' : 'Even',
  totalBet: parseFloat(utils.formatUnits(bet.totalBet, 18).toString()),
});

export const mapToPlayer = (player: PlayerInfo): Player => ({
  id: player.id.toNumber(),
  amountBet: parseFloat(utils.formatUnits(player.amountBet, 18).toString()),
  pairity: player.pairity === 2 ? 'Unknown' : !player.pairity ? 'Odd' : 'Even',
  playerAddress: player.playerAddress.toString(),
});

export const HEAD_CELLS: HeadCell[] = [
  { id: 'id', label: 'Id', numeric: true },
  { id: 'numberOfPlayers', label: '# of players', numeric: true },
  { id: 'totalBet', label: 'Total bet', numeric: true },
  { id: 'ended', label: 'Ended', numeric: false },
  { id: 'pair', label: 'Pair', numeric: false },
  { id: 'pairity', label: 'Pairity', numeric: false },
];

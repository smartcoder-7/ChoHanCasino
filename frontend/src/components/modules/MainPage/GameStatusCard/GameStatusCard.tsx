import {
  Box,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';

import { GameStatus } from '../../../../pages/MainPage/MainPage.types';

export interface GameStatusProps extends GameStatus {
  minimumBet: number;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);

function DataRow({
  label,
  value,
  unit = '',
}: {
  label: string;
  unit?: string;
  value: number | string;
}) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="body1" color="textSecondary" component="p">
        {label + ':'}
      </Typography>
      <Typography component="p">{`${value}  ${unit}`}</Typography>
    </Box>
  );
}

export default function GameStatusCard({
  id,
  numberOfPlayers,
  totalBet,
  minimumBet,
}: GameStatusProps) {
  return (
    <Card>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" color="textSecondary" component="h6">
              Game Status
            </Typography>
          }
        />
        <CardContent>
          <DataRow label="Id" value={id} />
          <DataRow
            label="# of players"
            value={numberOfPlayers}
            unit={'people'}
          />
          <DataRow label="Total amount" value={totalBet} unit={'ETH'} />
          <DataRow label="Min-bet amount" value={minimumBet} unit={'ETH'} />
        </CardContent>
      </Card>
    </Card>
  );
}

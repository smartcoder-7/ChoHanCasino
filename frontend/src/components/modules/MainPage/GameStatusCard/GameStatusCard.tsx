import {
  Box,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';

export interface GameStatusProps {
  ended: string;
  id: number;
  numberOfPlayers: number;
  numberWinner: number;
  totalBet: number;
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
  value: number;
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
        </CardContent>
      </Card>
    </Card>
  );
}

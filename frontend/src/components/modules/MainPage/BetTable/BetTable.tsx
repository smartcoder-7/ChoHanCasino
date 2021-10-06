import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { GameStatusProps } from '../GameStatusCard/GameStatusCard';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  label: {
    textAlign: 'center',
  },
});

interface TableProps {
  data: GameStatusProps[];
}

export default function BetTable({ data }: TableProps) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell align="right">Destiny</StyledTableCell>
            <StyledTableCell align="right">Total bet(ETH)</StyledTableCell>
            <StyledTableCell align="right">Number of players</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 &&
            data.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.id + 1}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.numberWinner === 3
                    ? 'Unknown'
                    : row.numberWinner === 0
                    ? 'Even'
                    : 'Odd'}
                </StyledTableCell>
                <StyledTableCell align="right">{row.totalBet}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.numberOfPlayers}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.ended ? 'Ended' : 'In Progress'}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          {!data.length && (
            <StyledTableRow>
              <StyledTableCell component="th" scope="row" colSpan={5}>
                <Typography className={classes.label}>
                  No table data!
                </Typography>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

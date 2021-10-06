import { TableCell, TableRow } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { GameStatus } from '../../../../pages/MainPage/MainPage.types';
import { useStyles } from './BetTable';
import { Order } from './BetTable.utils';

export interface HeadCell {
  id: keyof GameStatus;
  label: string;
  numeric: boolean;
}

interface TableHeadProps {
  classes: ReturnType<typeof useStyles>;
  headCells: HeadCell[];
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof GameStatus,
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export default function BetTableHead({
  classes,
  order,
  orderBy,
  onRequestSort,
  headCells,
}: TableHeadProps) {
  const createSortHandler =
    (property: keyof GameStatus) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

import {
  Box,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';

import BetTable from '../../components/modules/MainPage/BetTable';
import GameBoard from '../../components/modules/MainPage/GameBoard';
import GameStatusCard from '../../components/modules/MainPage/GameStatusCard';
import { useMainPageContext } from './MainPage.context';
import { HEAD_CELLS } from './MainPage.utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing(5),
    },
    statusCard: {
      textAlign: 'center',
    },
  }),
);

function MainPage() {
  const classes = useStyles();
  const { handleBet, handleEndBet, isAdmin, gameStatus, tableData } =
    useMainPageContext();

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box>
              <GameBoard
                onBet={handleBet}
                isAdmin={isAdmin}
                onEndBet={handleEndBet}
                mininumBet={gameStatus?.minimumBet || 0}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className={classes.statusCard}>
              {gameStatus && <GameStatusCard {...gameStatus} />}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BetTable rows={tableData} headCells={HEAD_CELLS} />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default MainPage;

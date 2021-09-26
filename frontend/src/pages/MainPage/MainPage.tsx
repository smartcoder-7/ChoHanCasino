// import { BigNumber } from '@ethersproject/bignumber';
import {
  Box,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';

import GameBoard from '../../components/modules/MainPage/GameBoard';
import GameStatusCard from '../../components/modules/MainPage/GameStatusCard';
import { useCasinoContract } from '../../lib/hooks/useContract';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing(5),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

function Login() {
  const classes = useStyles();
  const casinoContract = useCasinoContract();
  if (casinoContract) {
    (async () => {
      try {
        console.info(await casinoContract.numberOfPlayers());
      } catch (error) {
        console.error('errror==>', error);
      }
    })();
  }

  const handleBet = async () => {
    if (!casinoContract) {
      return;
    }
    try {
      const result = await casinoContract.bet(1);
      console.info('result====>', result);
    } catch (error) {
      console.error('error');
    }
  };

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box className={classes.paper}>
              <GameBoard onBet={handleBet} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className={classes.paper}>
              <GameStatusCard />
            </Box>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default Login;

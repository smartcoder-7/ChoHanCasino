// import { BigNumber } from '@ethersproject/bignumber';
import {
  Box,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import { useEffect } from 'react';

import GameBoard from '../../components/modules/MainPage/GameBoard';
import GameStatusCard from '../../components/modules/MainPage/GameStatusCard';
import { useCasinoContract } from '../../lib/hooks/useContract';

const ADMIN_ADDRESS = '0xABd2b1DF2AA03Df2c804af40A73BeddA8148588E';

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
  const { active, account } = useWeb3React();
  const casinoContract = useCasinoContract();

  useEffect(() => {
    if (!casinoContract) {
      return;
    }

    casinoContract.on('BetPlaced', (status, event) => {
      console.info('Bet placed', status, event);
    });

    casinoContract.on('Won', (status, address, amount) => {
      console.info('Won event', status, address, amount);
    });
  }, [casinoContract]);

  if (!active && !account) {
    return <div>connect wallet</div>;
  }

  if (!casinoContract) {
    return <div>Something went wrong with contract</div>;
  }

  const handleBet = async () => {
    try {
      const overrides = {
        from: account,
        value: utils.parseEther('0.1'),
      };
      await casinoContract.bet(0, overrides);
    } catch (error) {
      console.error('error');
    }
  };

  const handleEndBet = async () => {
    try {
      await casinoContract.betEnd();
    } catch (error) {
      console.error('error', error);
    }
  };

  if (casinoContract) {
    (async () => {
      try {
        console.info(await casinoContract.numberOfPlayers());
      } catch (error) {
        console.error('errror==>', error);
      }
    })();
  }

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box className={classes.paper}>
              <GameBoard
                onBet={handleBet}
                isAdmin={ADMIN_ADDRESS === account}
                onEndBet={handleEndBet}
              />
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

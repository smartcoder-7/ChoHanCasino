import {
  Box,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { useEffect, useState } from 'react';

import BetTable from '../../components/modules/MainPage/BetTable';
import GameBoard from '../../components/modules/MainPage/GameBoard';
import GameStatusCard from '../../components/modules/MainPage/GameStatusCard';
import { GameStatusProps } from '../../components/modules/MainPage/GameStatusCard/GameStatusCard';
import { useCasinoContract } from '../../lib/hooks/useContract';

const ADMIN_ADDRESS = '0xABd2b1DF2AA03Df2c804af40A73BeddA8148588E';

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

const mapToGameStatus = (bet: Record<string, BigNumber>): GameStatusProps => ({
  id: bet.id.toNumber(),
  numberOfPlayers: bet.numberOfPlayers.toNumber(),
  totalBet: parseFloat(utils.formatUnits(bet.totalBet, 18).toString()),
  numberWinner: bet.numberWinner.toNumber(),
});

function MainPage() {
  const classes = useStyles();
  const { active, account } = useWeb3React();
  const casinoContract = useCasinoContract();
  const [gameStatus, setGameStatus] = useState<GameStatusProps | null>(null);
  const [tableData, setTableData] = useState<GameStatusProps[]>([]);

  //listening events only
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

  //fetch initial data
  useEffect(() => {
    if (!casinoContract) {
      return;
    }
    (async () => {
      const currentBetId = await casinoContract.currentBetId();
      const currentBet = await casinoContract.bets(currentBetId);

      const promises = Array(currentBetId + 1)
        .fill(0)
        .map((_, index) => {
          return casinoContract.bets(index);
        });
      const results = await Promise.all(promises);
      setTableData(results.map((result) => mapToGameStatus(result)));
      setGameStatus(mapToGameStatus(currentBet));
    })();
  }, [casinoContract]);

  if (!active && !account) {
    return <div>connect wallet</div>;
  }

  if (!casinoContract) {
    return <div>Something went wrong with contract</div>;
  }

  console.info('bet result====>', tableData);

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
            <Box>
              <GameBoard
                onBet={handleBet}
                isAdmin={ADMIN_ADDRESS === account}
                onEndBet={handleEndBet}
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
            <BetTable data={tableData} />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default MainPage;

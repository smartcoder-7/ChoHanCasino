import {
  CircularProgress,
  Container,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import { useCasinoContract } from '../../lib/hooks/useContract';
import MainPage from './MainPage';
import { MainPageContextProvider } from './MainPage.context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      marginTop: theme.spacing(30),
    },
  }),
);

function MainPageContainer() {
  const classes = useStyles();
  const casinoContract = useCasinoContract();
  const { active } = useWeb3React();

  if (!active) {
    return (
      <Container className={classes.root} maxWidth="md">
        <Typography variant="h3">Please try to connect wallet!</Typography>
      </Container>
    );
  }

  if (!casinoContract) {
    return (
      <Container className={classes.root} maxWidth="md">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <MainPageContextProvider contract={casinoContract}>
      <MainPage />
    </MainPageContextProvider>
  );
}

export default MainPageContainer;

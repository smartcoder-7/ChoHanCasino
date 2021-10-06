import {
  CircularProgress,
  Container,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';

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

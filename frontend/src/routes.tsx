import Notifier from './components/global/Notifier';
import Web3ReactManager from './components/global/Web3ReactManager';
import MainLayout from './containers/layout/MainLayout';
import Routes from './pages';

function AppRoutes() {
  return (
    <MainLayout>
      <Web3ReactManager>
        <>
          <Routes />
          <Notifier />
        </>
      </Web3ReactManager>
    </MainLayout>
  );
}

export default AppRoutes;

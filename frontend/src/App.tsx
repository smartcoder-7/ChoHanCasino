import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/styles';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';

import { NetworkContextName } from './lib/constants';
import getLibrary from './lib/utils/getLibrary';
import Routes from './routes';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Router>
          <StylesProvider injectFirst>
            <CssBaseline />
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Routes />
            </SnackbarProvider>
          </StylesProvider>
        </Router>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
}

export default App;

import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import Link from '../../../components/global/Link';
import { SUPPORTED_WALLETS } from '../../../lib/constants';
import notifier from '../../../lib/utils/notifier';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

interface ConnectedMenuProps {
  account?: string | null;
  anchorEl: Element | null | undefined;
  handleClose: () => void;
  handleDisconnect: () => void;
  id?: string;
}

function ConnectedMenu({
  id,
  anchorEl,
  handleClose,
  account,
  handleDisconnect,
}: ConnectedMenuProps) {
  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {account && <MenuItem onClick={handleClose}>{account}</MenuItem>}
      <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
    </Menu>
  );
}

export default function Header() {
  const classes = useStyles();
  const { active, account, deactivate, activate } = useWeb3React();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = async () => {
    setAnchorEl(null);
    await deactivate();
  };

  const handleLogin = async () => {
    SUPPORTED_WALLETS['METAMASK'].connector &&
      (await activate(SUPPORTED_WALLETS['METAMASK'].connector));
  };

  useEffect(() => {
    if (active) {
      notifier.success('Wallet has been connected.');
    } else {
      notifier.info('Wallet has been connected.');
    }
  }, [active]);

  const rightElement = active ? (
    <>
      <Button color="inherit" onClick={handleClick}>
        Connected
      </Button>
      <ConnectedMenu
        handleClose={handleClose}
        id="connected-menu"
        anchorEl={anchorEl}
        handleDisconnect={handleDisconnect}
        account={account}
      />
    </>
  ) : (
    <Button color="inherit" onClick={handleLogin}>
      Login
    </Button>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Link to="/">
              <MenuIcon />
            </Link>
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Cho Han Casino
          </Typography>
          {rightElement}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

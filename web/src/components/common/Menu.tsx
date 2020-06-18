import React from 'react';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Router, { withRouter } from 'next/router';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/styles';

import { AuthHelper } from 'src/helpers/auth.helper';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  navigations: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const MenuComponent = (props) => {
  const classes = useStyles();
  const [menuAnchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const isActive = (path) => {
    if (props.router && props.router.pathname == path)
      return { color: '#ffa726' };
    else return { color: '#ffffff' };
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = () => (
    <>
      <IconButton
        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
        aria-haspopup='true'
        onClick={handleProfileMenuOpen}
        color='inherit'
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id='material-appbar'
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => '/profile/' + AuthHelper.isAuthenticated().user._id}
        >
          My Profile
        </MenuItem>
        <MenuItem onClick={() => AuthHelper.signout(() => Router.push('/'))}>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <AppBar position='static'>
      <Container maxWidth='lg' className={classes.grow}>
        <Toolbar>
          <Typography variant='h4' color='inherit'>
            Nexpress
          </Typography>
          <div className={classes.grow} />
          <div className={classes.navigations}>
            <Link href='/'>
              <IconButton aria-label='Home' style={isActive('/')}>
                <HomeIcon />
              </IconButton>
            </Link>
            {!AuthHelper.isAuthenticated() && (
              <span>
                <Link href='/signup'>
                  <Button style={isActive('/signup')}>Sign up</Button>
                </Link>
                <Link href='/signin'>
                  <Button style={isActive('/signin')}>Sign In</Button>
                </Link>
              </span>
            )}
          </div>
          {AuthHelper.isAuthenticated() && renderMenu()}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default withRouter(MenuComponent);

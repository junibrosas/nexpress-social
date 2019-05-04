import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { AuthHelper } from 'src/helpers/auth.helper';
import Router, { withRouter } from 'next/router';

const MenuComponent = (props) => {
  const isActive = (path) => {
    if (props.router && props.router.pathname == path)
      return { color: '#ffa726' }
    else
      return { color: '#ffffff' }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit">
          MERN Social
        </Typography>
        <Link href="/">
          <IconButton aria-label="Home" style={isActive("/")}>
            <HomeIcon />
          </IconButton>
        </Link>
        {
          !AuthHelper.isAuthenticated() && (<span>
            <Link href="/signup">
              <Button style={isActive("/signup")}>Sign up
                </Button>
            </Link>
            <Link href="/signin">
              <Button style={isActive("/signin")}>Sign In
                </Button>
            </Link>
          </span>)
        }
        {
          AuthHelper.isAuthenticated() && (<span>
            <Link href={"/user/" + AuthHelper.isAuthenticated().user._id}>
              <Button style={isActive("/user/" + AuthHelper.isAuthenticated().user._id)}>My Profile</Button>
            </Link>
            <Button color="inherit" onClick={() => {
              AuthHelper.signout(() => Router.push('/'))
            }}>Sign out</Button>
          </span>)
        }
      </Toolbar>
    </AppBar>
  )
}

export const Menu = withRouter(MenuComponent); 
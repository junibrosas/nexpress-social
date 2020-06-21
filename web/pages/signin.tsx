import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Router from 'next/router';
import { makeStyles } from '@material-ui/core';

import { AuthApiService } from 'src/services/authapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';
import Page from 'src/components/common/Page';

type ComponentState = {
  email: string;
  password: string;
  error: string;
  redirectToReferrer: boolean;
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: 'middle',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

const Signin = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState>({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false,
  });

  const { redirectToReferrer } = state;

  if (redirectToReferrer) {
    Router.push('/');
  }

  const clickSubmit = () => {
    const user = {
      email: state.email || undefined,
      password: state.password || undefined,
    };

    AuthApiService.signin(user).then((data) => {
      if (data && data.error) {
        setState({ ...state, error: data.error });
      } else {
        AuthHelper.authenticate(data, () => {
          setState({ ...state, redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value } as any);
  };

  return (
    <Page>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h4' className={classes.title}>
            Sign In
          </Typography>
          <TextField
            id='email'
            type='email'
            label='Email'
            className={classes.textField}
            value={state.email}
            onChange={handleChange('email')}
            margin='normal'
          />
          <br />
          <TextField
            id='password'
            type='password'
            label='Password'
            className={classes.textField}
            value={state.password}
            onChange={handleChange('password')}
            margin='normal'
          />
          <br />{' '}
          {state.error && (
            <Typography component='p' color='error'>
              <Icon color='error' className={classes.error}>
                error
              </Icon>
              {state.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color='primary'
            variant='contained'
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </Page>
  );
};

export default Signin;

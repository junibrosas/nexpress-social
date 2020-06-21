import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router';

import { UserApiService } from 'src/services/userapi.service';
import Page from 'src/components/common/Page';

type ComponentState = {
  name: string;
  password: string;
  email: string;
  open: boolean;
  error: string;
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

const Signup = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState>({
    name: '',
    password: '',
    email: '',
    open: false,
    error: '',
  });

  const handleChange = (name) => (event) => {
    setState({ [name]: event.target.value } as any);
  };

  const handleSignIn = () => {
    Router.push('/');
  };

  const clickSubmit = () => {
    const user = {
      name: state.name || undefined,
      email: state.email || undefined,
      password: state.password || undefined,
    };

    UserApiService.create(user).then((data) => {
      if (data && data.error) {
        setState({ ...state, error: data.error });
      } else {
        setState({ ...state, error: '', open: true });
      }
    });
  };

  return (
    <Page>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h2' className={classes.title}>
            Sign Up
          </Typography>
          <TextField
            id='name'
            label='Name'
            className={classes.textField}
            value={state.name}
            onChange={handleChange('name')}
            margin='normal'
          />
          <br />
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
      <Dialog open={state.open} disableBackdropClick={true}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            autoFocus={true}
            variant='contained'
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default Signup;

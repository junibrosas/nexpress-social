import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Router from 'next/router';
import { withStyles } from '@material-ui/core';

import { AuthApiService } from 'src/services/authapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';
import { Page } from 'src/components/common/Page';

interface IState {
  email: string;
  password: string;
  error: string;
  redirectToReferrer: boolean;
}

interface IProps {
  classes: any;
  location: any;
}

const styles = (theme) => ({
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
    color: theme.palette.openTitle,
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
});

class Signin extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferrer: false,
    };
  }

  render() {
    const { classes } = this.props;
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      Router.push('/');
    }

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
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin='normal'
            />
            <br />
            <TextField
              id='password'
              type='password'
              label='Password'
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange('password')}
              margin='normal'
            />
            <br />{' '}
            {this.state.error && (
              <Typography component='p' color='error'>
                <Icon color='error' className={classes.error}>
                  error
                </Icon>
                {this.state.error}
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button
              color='primary'
              variant='contained'
              onClick={this.clickSubmit}
              className={classes.submit}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      </Page>
    );
  }

  clickSubmit = () => {
    const user = {
      email: this.state.email || undefined,
      password: this.state.password || undefined,
    };

    AuthApiService.signin(user).then((data) => {
      if (data && data.error) {
        this.setState({ error: data.error });
      } else {
        AuthHelper.authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value } as any);
  };
}

export default withStyles(styles as any)(Signin);

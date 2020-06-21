import React, { Component } from 'react';
import FileUpload from '@material-ui/icons/CloudUpload';
import {
  CardContent,
  CardActions,
  Card,
  Button,
  TextField,
  Typography,
  Icon,
  Avatar,
  withStyles,
} from '@material-ui/core';
import Router from 'next/router';

import { AuthHelper } from 'src/helpers/auth.helper';
import { UserApiService } from 'src/services/userapi.service';
import Page from 'src/components/common/Page';

interface IState {
  id: string;
  name: string;
  about: string;
  photo: any;
  email: string;
  password: string;
  redirectToProfile: boolean;
  error: string;
  user: any;
}

interface IProps {
  classes: any;
  userId: number;
}

const styles = (theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: 'middle',
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
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  input: {
    display: 'none',
  },
  filename: {
    marginLeft: '10px',
  },
});

class EditProfileComponent extends Component<IProps, IState> {
  userData: FormData;

  static getInitialProps(context) {
    return { userId: context.query.userId };
  }

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      about: '',
      photo: undefined,
      email: '',
      password: '',
      redirectToProfile: false,
      error: '',
      user: undefined,
    };
  }

  componentDidMount = () => {
    this.userData = new FormData();
    const jwt = AuthHelper.isAuthenticated();

    UserApiService.read(
      {
        userId: this.props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };
  clickSubmit = () => {
    const jwt = AuthHelper.isAuthenticated();

    UserApiService.update(
      {
        userId: this.props.userId,
      },
      {
        t: jwt.token,
      },
      this.userData
    ).then((data) => {
      if (data && data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ redirectToProfile: true });
      }
    });
  };

  handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    this.userData.set(name, value);
    this.setState({ [name]: value } as any);
  };
  render() {
    const { classes } = this.props;
    const photoUrl =
      this.state.user && this.state.user._id
        ? UserApiService.getPhotoUrl(this.state.user._id)
        : UserApiService.getDefaultPhotoUrl();

    if (this.state.redirectToProfile) {
      Router.push('/profile/' + this.state.id);
    }

    return (
      <Page>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant='h4' component='h2' className={classes.title}>
              Edit Profile
            </Typography>
            <Avatar src={photoUrl} className={classes.bigAvatar} />
            <br />
            <input
              accept='image/*'
              onChange={this.handleChange('photo')}
              className={classes.input}
              id='icon-button-file'
              type='file'
            />
            <label htmlFor='icon-button-file'>
              <Button variant='contained' color='default' component='span'>
                Upload &nbsp;
                <FileUpload />
              </Button>
            </label>{' '}
            <span className={classes.filename}>
              {this.state.photo ? this.state.photo.name : ''}
            </span>
            <br />
            <TextField
              id='name'
              label='Name'
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin='normal'
            />
            <br />
            <TextField
              id='multiline-flexible'
              label='About'
              multiline
              rows='2'
              value={this.state.about}
              onChange={this.handleChange('about')}
              className={classes.textField}
              margin='normal'
            />
            <br />
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
}

export default withStyles(styles as any)(EditProfileComponent);

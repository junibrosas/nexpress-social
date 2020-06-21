import React from 'react';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router';

import { AuthHelper } from 'src/helpers/auth.helper';
import { UserApiService } from 'src/services/userapi.service';
import Page from 'src/components/common/Page';

type ComponentState = {
  id: string;
  name: string;
  about: string;
  photo: any;
  email: string;
  password: string;
  redirectToProfile: boolean;
  error: string;
  user: any;
};

interface ComponentProps {
  userId: number;
}

const useStyles = makeStyles((theme) => ({
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
}));

const EditProfile = (props: ComponentProps) => {
  const classes = useStyles();
  const [userData, setUserData] = React.useState<FormData>(undefined);
  const [state, setState] = React.useState<ComponentState>({
    id: '',
    name: '',
    about: '',
    photo: undefined,
    email: '',
    password: '',
    redirectToProfile: false,
    error: '',
    user: undefined,
  });

  React.useEffect(() => {
    setUserData(new FormData());

    const jwt = AuthHelper.isAuthenticated();

    UserApiService.read(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        setState({ ...state, error: data.error });
      } else {
        setState({
          ...state,
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  }, []);

  const clickSubmit = () => {
    const jwt = AuthHelper.isAuthenticated();

    UserApiService.update(
      {
        userId: props.userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setState({ ...state, error: data.error });
      } else {
        setState({ ...state, redirectToProfile: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    userData.set(name, value);
    setState({ ...state, [name]: value } as any);
  };

  const photoUrl =
    state.user && state.user._id
      ? UserApiService.getPhotoUrl(state.user._id)
      : UserApiService.getDefaultPhotoUrl();

  if (state.redirectToProfile) {
    Router.push('/profile/' + state.id);
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
            onChange={handleChange('photo')}
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
            {state.photo ? state.photo.name : ''}
          </span>
          <br />
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
            id='multiline-flexible'
            label='About'
            multiline
            rows='2'
            value={state.about}
            onChange={handleChange('about')}
            className={classes.textField}
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
    </Page>
  );
};

EditProfile.getInitialProps = (context) => {
  return { userId: context.query.userId };
};

export default EditProfile;

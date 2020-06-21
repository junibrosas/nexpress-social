import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Typography,
  Avatar,
  Icon,
  TextField,
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { PostApiService } from 'src/services/postapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';
import { UserApiService } from 'src/services/userapi.service';

import { makeStyles } from '@material-ui/core/styles';

type ComponentProps = {
  addUpdate: (post: any) => void;
};

type ComponentState = {
  text: string;
  photo: any;
  error: string;
  user: any;
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing(3)}px 0px 1px`,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none',
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  photoButton: {
    height: 30,
    marginBottom: 5,
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '90%',
  },
  submit: {
    margin: theme.spacing(2),
  },
  filename: {
    verticalAlign: 'super',
  },
}));

const NewPost = (props: ComponentProps) => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState>({
    text: '',
    photo: '',
    error: '',
    user: {},
  });

  let postData: FormData;

  React.useEffect(() => {
    postData = new FormData();
    setState({ ...state, user: AuthHelper.isAuthenticated().user });
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    postData.set(name, value);
    setState({ [name]: value } as any);
  };

  const clickPost = async () => {
    const jwt = AuthHelper.isAuthenticated();

    const data = await PostApiService.create(
      { userId: jwt.user._id },
      { t: jwt.token },
      postData
    );

    if (data && data.error) {
      setState({ ...state, error: data.error });
    } else {
      setState({ ...state, text: '', photo: '' });
      props.addUpdate(data);
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={UserApiService.getPhotoUrl(state.user._id)} />}
          title={state.user.name}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <TextField
            placeholder='Share your thoughts ...'
            multiline
            rows='3'
            value={state.text}
            onChange={handleChange('text')}
            className={classes.textField}
            margin='normal'
          />
          <input
            accept='image/*'
            onChange={handleChange('photo')}
            className={classes.input}
            id='icon-button-file'
            type='file'
          />
          <label htmlFor='icon-button-file'>
            <IconButton
              color='secondary'
              className={classes.photoButton}
              component='span'
            >
              <PhotoCamera />
            </IconButton>
          </label>{' '}
          <span className={classes.filename}>
            {state.photo ? state.photo.name : ''}
          </span>
          {state.error && (
            <Typography component='p' color='error'>
              <Icon color='error'>error</Icon>
              {state.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color='primary'
            variant='contained'
            disabled={state.text === ''}
            onClick={clickPost}
            className={classes.submit}
          >
            POST
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NewPost;

import React from 'react';
import Edit from '@material-ui/icons/Edit';
import Router from 'next/router';
import Link from 'next/link';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ProfileTabs from 'src/components/user/ProfileTabs';
import FollowProfileButton from 'src/components/user/FollowProfileButton';
import DeleteUser from 'src/components/user/DeleteUser';
import Page from 'src/components/common/Page';
import { AuthHelper } from 'src/helpers/auth.helper';
import { UserApiService } from 'src/services/userapi.service';
import { PostApiService } from 'src/services/postapi.service';

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing()}px 0`,
    fontSize: '1em',
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
}));

type ComponentProps = {
  classes: any;
  userId: string;
};

type ComponentState = {
  user: any; // TODO: add proper typing
  redirectToSignin: boolean;
  following: boolean;
  posts: any; // TODO: add proper typing
};

const Profile = ({ userId }: ComponentProps) => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState | null>({
    user: undefined,
    redirectToSignin: false,
    following: false,
    posts: [],
  });

  const redirectToSignin = state.redirectToSignin;

  const photoUrl =
    state.user && state.user._id
      ? UserApiService.getPhotoUrl(state.user._id)
      : UserApiService.getDefaultPhotoUrl();

  if (redirectToSignin) {
    return Router.push('/signin');
  }

  const fetchPosts = async (user) => {
    const jwt = AuthHelper.isAuthenticated();
    return PostApiService.listByUser(
      {
        userId: user,
      },
      {
        t: jwt.token,
      }
    );
  };

  const fetchUserProfile = async () => {
    const jwt = AuthHelper.isAuthenticated();
    return UserApiService.read(
      {
        userId: userId,
      },
      { t: jwt.token }
    );
  };

  const checkFollow = (user) => {
    const jwt = AuthHelper.isAuthenticated();
    const match = user.followers.find((following) => {
      return following._id === jwt.user._id;
    });

    return match;
  };

  const clickFollowButton = (callApi) => {
    const jwt = AuthHelper.isAuthenticated();
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      this.state.user._id
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setState({ ...state, user: data, following: !state.following });
      }
    });
  };

  const removePost = (post) => {
    const updatedPosts = this.state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setState({ ...state, posts: updatedPosts });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUserProfile();
      if (user.error) {
        Router.push('/signin');
      } else {
        const following = checkFollow(user);
        const posts = await fetchPosts(user._id);
        setState({ ...state, user, following, posts });
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Page>
      <Paper className={classes.root} elevation={4}>
        <Typography variant='h6' className={classes.title}>
          Profile
        </Typography>
        {state.user && (
          <React.Fragment>
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={photoUrl} className={classes.bigAvatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={state.user.name}
                  secondary={state.user.email}
                />{' '}
                {AuthHelper.isAuthenticated().user &&
                AuthHelper.isAuthenticated().user._id == state.user._id ? (
                  <ListItemSecondaryAction>
                    <Link href={'/profile/edit/' + state.user._id}>
                      <IconButton aria-label='Edit' color='primary'>
                        <Edit />
                      </IconButton>
                    </Link>
                    <DeleteUser userId={state.user._id} />
                  </ListItemSecondaryAction>
                ) : (
                  <FollowProfileButton
                    following={state.following}
                    onButtonClick={clickFollowButton}
                  />
                )}
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={state.user.about}
                  secondary={
                    'Joined: ' + new Date(state.user.created).toDateString()
                  }
                />
              </ListItem>
            </List>
            <ProfileTabs
              user={state.user}
              posts={state.posts}
              removePostUpdate={removePost}
            />
          </React.Fragment>
        )}
      </Paper>
    </Page>
  );
};

Profile.getInitialProps = (context) => {
  return { userId: context.query.userId };
};

export default Profile;

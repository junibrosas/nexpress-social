import React from 'react';
import { Card, Typography, Divider, makeStyles } from '@material-ui/core';
import NewPost from 'src/components/post/NewPost';
import { PostApiService } from 'src/services/postapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';
import PostList from './PostList';

type ComponentState = {
  posts: any;
};

const useStyles = makeStyles((theme) => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    fontSize: '1em',
  },
  media: {
    minHeight: 330,
  },
}));

const NewsFeed = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState>({
    posts: [],
  });

  const loadPosts = () => {
    const jwt = AuthHelper.isAuthenticated();

    PostApiService.listNewsFeed(
      { userId: jwt.user._id },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setState({ posts: data });
      }
    });
  };

  React.useEffect(() => {
    loadPosts();
  }, []);

  const addPost = (post) => {
    const updatedPosts = state.posts;
    updatedPosts.unshift(post);
    setState({ posts: updatedPosts });
  };

  const removePost = (post) => {
    const updatedPosts = state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setState({ posts: updatedPosts });
  };

  return (
    <Card className={classes.card}>
      <Typography variant='h6' className={classes.title}>
        Newsfeed
      </Typography>
      <Divider />
      <NewPost addUpdate={addPost} />
      <Divider />
      <PostList removeUpdate={removePost} posts={state.posts} />
    </Card>
  );
};

export default NewsFeed;

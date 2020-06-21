import React from 'react';
import { AuthHelper } from 'src/helpers/auth.helper';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Divider,
  makeStyles,
} from '@material-ui/core';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import Link from 'next/link';

import Comments from 'src/components/post/Comments';
import { PostApiService } from 'src/services/postapi.service';
import { UserApiService } from 'src/services/userapi.service';

type ComponentProps = {
  post: any;
  onRemove: (post: any) => void;
};

type ComponentState = {
  like: boolean;
  likes: number;
  comments: any;
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing(2)}px 0px`,
  },
  cardHeader: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
  },
  text: {
    margin: theme.spacing(2),
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding: theme.spacing(),
  },
  media: {
    height: 200,
  },
  button: {
    margin: theme.spacing(),
  },
}));

const checkLike = (likes) => {
  const jwt = AuthHelper.isAuthenticated();
  let match = likes.indexOf(jwt.user._id) !== -1;
  return match;
};

const Post = (props: ComponentProps) => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState>({
    like: false,
    likes: 0,
    comments: [],
  });

  React.useEffect(() => {
    setState({
      ...state,
      like: checkLike(props.post.likes),
      likes: props.post.likes.length,
      comments: props.post.comments,
    });
  }, [props.post.likes, props.post.likes.length, props.post.comments]);

  const like = () => {
    let callApi = state.like ? PostApiService.unlike : PostApiService.like;
    const jwt = AuthHelper.isAuthenticated();
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.post._id
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setState({ ...state, like: !state.like, likes: data.likes.length });
      }
    });
  };

  const updateComments = (comments) => {
    setState({ ...state, comments: comments });
  };

  const deletePost = () => {
    const jwt = AuthHelper.isAuthenticated();
    PostApiService.remove(
      {
        postId: props.post._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        props.onRemove(props.post);
      }
    });
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar src={UserApiService.getPhotoUrl(props.post.postedBy._id)} />
        }
        action={
          props.post.postedBy._id === AuthHelper.isAuthenticated().user._id && (
            <IconButton onClick={deletePost}>
              <DeleteIcon />
            </IconButton>
          )
        }
        title={
          <Link href={'/profile/' + props.post.postedBy._id}>
            <a>{props.post.postedBy.name}</a>
          </Link>
        }
        subheader={new Date(props.post.created).toDateString()}
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContent}>
        <Typography component='p' className={classes.text}>
          {props.post.text}
        </Typography>
        {props.post.photo && (
          <div className={classes.photo}>
            <img
              className={classes.media}
              src={PostApiService.getPhotoUrl(props.post._id)}
            />
          </div>
        )}
      </CardContent>
      <CardActions>
        {state.like ? (
          <IconButton
            onClick={like}
            className={classes.button}
            aria-label='Like'
            color='secondary'
          >
            <FavoriteIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={like}
            className={classes.button}
            aria-label='Unlike'
            color='secondary'
          >
            <FavoriteBorderIcon />
          </IconButton>
        )}{' '}
        <span>{state.likes}</span>
        <IconButton
          className={classes.button}
          aria-label='Comment'
          color='secondary'
        >
          <CommentIcon />
        </IconButton>{' '}
        <span>{state.comments.length}</span>
      </CardActions>
      <Divider />
      <Comments
        postId={props.post._id}
        comments={state.comments}
        updateComments={updateComments}
      />
    </Card>
  );
};

export default Post;

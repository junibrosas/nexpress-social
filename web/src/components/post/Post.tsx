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
  withStyles,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import Link from 'next/link';

import { Comments } from 'src/components/post/Comments';
import { PostApiService } from 'src/services/postapi.service';
import { UserApiService } from 'src/services/userapi.service';

interface IProps {
  classes: any;
  post: any;
  onRemove: (post: any) => void;
}

interface IState {
  like: boolean;
  likes: number;
  comments: any;
}

const styles = (theme) => ({
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
});

class PostComponent extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      like: false,
      likes: 0,
      comments: [],
    };
  }

  componentDidMount = () => {
    this.setState({
      like: this.checkLike(this.props.post.likes),
      likes: this.props.post.likes.length,
      comments: this.props.post.comments,
    });
  };
  componentWillReceiveProps = (props) => {
    this.setState({
      like: this.checkLike(props.post.likes),
      likes: props.post.likes.length,
      comments: props.post.comments,
    });
  };

  checkLike = (likes) => {
    const jwt = AuthHelper.isAuthenticated();
    let match = likes.indexOf(jwt.user._id) !== -1;
    return match;
  };

  like = () => {
    let callApi = this.state.like ? PostApiService.unlike : PostApiService.like;
    const jwt = AuthHelper.isAuthenticated();
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      this.props.post._id
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        this.setState({ like: !this.state.like, likes: data.likes.length });
      }
    });
  };

  updateComments = (comments) => {
    this.setState({ comments: comments });
  };

  deletePost = () => {
    const jwt = AuthHelper.isAuthenticated();
    PostApiService.remove(
      {
        postId: this.props.post._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        this.props.onRemove(this.props.post);
      }
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              src={UserApiService.getPhotoUrl(this.props.post.postedBy._id)}
            />
          }
          action={
            this.props.post.postedBy._id ===
              AuthHelper.isAuthenticated().user._id && (
              <IconButton onClick={this.deletePost}>
                <DeleteIcon />
              </IconButton>
            )
          }
          title={
            <Link href={'/profile/' + this.props.post.postedBy._id}>
              <a>{this.props.post.postedBy.name}</a>
            </Link>
          }
          subheader={new Date(this.props.post.created).toDateString()}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography component='p' className={classes.text}>
            {this.props.post.text}
          </Typography>
          {this.props.post.photo && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={PostApiService.getPhotoUrl(this.props.post._id)}
              />
            </div>
          )}
        </CardContent>
        <CardActions>
          {this.state.like ? (
            <IconButton
              onClick={this.like}
              className={classes.button}
              aria-label='Like'
              color='secondary'
            >
              <FavoriteIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={this.like}
              className={classes.button}
              aria-label='Unlike'
              color='secondary'
            >
              <FavoriteBorderIcon />
            </IconButton>
          )}{' '}
          <span>{this.state.likes}</span>
          <IconButton
            className={classes.button}
            aria-label='Comment'
            color='secondary'
          >
            <CommentIcon />
          </IconButton>{' '}
          <span>{this.state.comments.length}</span>
        </CardActions>
        <Divider />
        <Comments
          postId={this.props.post._id}
          comments={this.state.comments}
          updateComments={this.updateComments}
        />
      </Card>
    );
  }
}

export const Post = withStyles(styles as any)(PostComponent);

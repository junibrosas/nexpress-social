import React from 'react';
import { Card, Typography, Divider, withStyles } from '@material-ui/core';
import { NewPost } from 'src/components/post/NewPost';
import { PostApiService } from 'src/services/postapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';
import { PostList } from './PostList';

interface IProps {
  classes: any;
}

interface IState {
  posts: any;
}

const styles = theme => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing.unit*3
  },
  title: {
    padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
})

class NewsFeedComponent extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }

  render() {
    const {classes} = this.props
    return (
      <Card className={classes.card}>
        <Typography variant="h6" className={classes.title}>
          Newsfeed
        </Typography>
        <Divider/>
        <NewPost addUpdate={this.addPost}/>
        <Divider/>
        <PostList removeUpdate={this.removePost} posts={this.state.posts}/>
      </Card>
    )
  }

  componentDidMount = () => {
    this.loadPosts();
  }

  loadPosts = () => {
    const jwt = AuthHelper.isAuthenticated();

    PostApiService.listNewsFeed(
      { userId: jwt.user._id },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    })
  }

  addPost = (post) => {
    const updatedPosts = this.state.posts;
    updatedPosts.unshift(post);
    this.setState({ posts: updatedPosts });
  }

  removePost = (post) => {
    const updatedPosts = this.state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  }
}

export const NewsFeed = withStyles(styles)(NewsFeedComponent);
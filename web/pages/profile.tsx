import React from 'react';
import { withStyles } from "@material-ui/core";
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
  Avatar
} from '@material-ui/core';

import { ProfileTabs } from 'src/components/user/ProfileTabs';
import { FollowProfileButton } from 'src/components/user/FollowProfileButton';
import { DeleteUser } from 'src/components/user/DeleteUser';
import { AuthHelper } from 'src/helpers/auth.helper';
import { UserApiService } from 'src/services/userapi.service';
import { PostApiService } from 'src/services/postapi.service';
import { Page } from 'src/components/common/Page';

interface IProps {
  userId: string;
  classes: any;
}

interface IState {
  user: any;
  following: boolean;
  posts: any;
  redirectToSignin: boolean;
}

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
})

class ProfileComponent extends React.Component<IProps, IState> {
  static getInitialProps(context) {
    return { userId: context.query.userId };
  }

  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      redirectToSignin: false,
      following: false,
      posts: []
    }
  }

  render() {
    const {classes} = this.props;
    const redirectToSignin = this.state.redirectToSignin;
    const photoUrl = this.state.user && this.state.user._id
      ? UserApiService.getPhotoUrl(this.state.user._id)
      : UserApiService.getDefaultPhotoUrl();
    
    if (redirectToSignin) {
      return Router.push('/signin');
    }

    return (
      <Page>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="h6" className={classes.title}>
            Profile
          </Typography>
          { this.state.user &&
            <React.Fragment>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={photoUrl} className={classes.bigAvatar}/>
                  </ListItemAvatar>
                  <ListItemText primary={this.state.user.name} secondary={this.state.user.email}/> {
                  AuthHelper.isAuthenticated().user && AuthHelper.isAuthenticated().user._id == this.state.user._id
                  ? (<ListItemSecondaryAction>
                        <Link href={"/profile/edit/" + this.state.user._id}>
                          <IconButton aria-label="Edit" color="primary">
                            <Edit />
                          </IconButton>
                        </Link>
                        <DeleteUser userId={this.state.user._id}/>
                      </ListItemSecondaryAction>)
                  : (<FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton}/>)
                  }
                </ListItem>
                <Divider/>
                <ListItem>
                  <ListItemText primary={this.state.user.about} secondary={"Joined: " + (
                    new Date(this.state.user.created)).toDateString()}/>
                </ListItem>
              </List>
              <ProfileTabs user={this.state.user} posts={this.state.posts} removePostUpdate={this.removePost}/>
            </React.Fragment>
          }
        </Paper>
      </Page>
    )
  }

  init = (userId) => {
    const jwt = AuthHelper.isAuthenticated();

    UserApiService.read({
      userId: userId
    }, {t: jwt.token}).then((data) => {
      console.warn(data);
      if (data.error) {
        this.setState({redirectToSignin: true})
      } else {
        let following = this.checkFollow(data)
        this.setState({user: data, following: following})
        this.loadPosts(data._id)
      }
    })
  }

  componentWillReceiveProps = (props) => {
    this.init(props.userId);
  }

  componentDidMount = () => {
    this.init(this.props.userId);
  }

  loadPosts = (user) => {
    const jwt = AuthHelper.isAuthenticated();

    PostApiService.listByUser({
      userId: user
    }, {
      t: jwt.token
    }).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.setState({posts: data})
      }
    })
  }

  checkFollow = (user) => {
    const jwt = AuthHelper.isAuthenticated();
    const match = user.followers.find(following => {
      return following._id === jwt.user._id;
    });

    return match;
  }

  clickFollowButton = (callApi) => {
    const jwt = AuthHelper.isAuthenticated();
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.state.user._id).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.setState({user: data, following: !this.state.following})
      }
    })
  }

  removePost = (post) => {
    const updatedPosts = this.state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  }
}

export default withStyles(styles)(ProfileComponent);
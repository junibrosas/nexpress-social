import React, {Component} from 'react';
import {
  AppBar,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core';
import { PostList } from 'src/components/post/PostList';
import { FollowGrid } from 'src/components/user/FollowGrid';

interface IProps {
  user: any;
  removePostUpdate: (post: any) => void;
  posts: any;
}

interface IState {
  tab: number;
  posts: any;
}

export class ProfileTabs extends Component<IProps, IState> {
  state = {
    tab: 0,
    posts: []
  }

  componentWillReceiveProps = () => {
    this.setState({tab:0})
  }
  handleTabChange = (event, value) => {
    console.warn(event);
    this.setState({ tab: value })
  }

  render() {
    return (
    <div>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth">
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </AppBar>
       {this.state.tab === 0 && <TabContainer><PostList removeUpdate={this.props.removePostUpdate} posts={this.props.posts}/></TabContainer>}
       {this.state.tab === 1 && <TabContainer><FollowGrid people={this.props.user.following}/></TabContainer>}
       {this.state.tab === 2 && <TabContainer><FollowGrid people={this.props.user.followers}/></TabContainer>}
    </div>)
  }
}

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  )
}

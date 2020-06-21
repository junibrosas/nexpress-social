import React from 'react';
import { AppBar, Typography, Tabs, Tab } from '@material-ui/core';
import PostList from 'src/components/post/PostList';
import FollowGrid from 'src/components/user/FollowGrid';

type ComponentProps = {
  user: any;
  removePostUpdate: (post: any) => void;
  posts: any;
};

type ComponentState = {
  tab: number;
  posts: any;
};

const ProfileTabs = (props: ComponentProps) => {
  const [state, setState] = React.useState<ComponentState>({
    tab: 0,
    posts: [],
  });

  React.useEffect(() => {
    setState({ ...state, tab: 0 });
  }, []);

  const handleTabChange = (_, value) => {
    setState({ ...state, tab: value });
  };

  return (
    <div>
      <AppBar position='static' color='default'>
        <Tabs
          value={state.tab}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Posts' />
          <Tab label='Following' />
          <Tab label='Followers' />
        </Tabs>
      </AppBar>
      {state.tab === 0 && (
        <TabContainer>
          <PostList removeUpdate={props.removePostUpdate} posts={props.posts} />
        </TabContainer>
      )}
      {state.tab === 1 && (
        <TabContainer>
          <FollowGrid people={props.user.following} />
        </TabContainer>
      )}
      {state.tab === 2 && (
        <TabContainer>
          <FollowGrid people={props.user.followers} />
        </TabContainer>
      )}
    </div>
  );
};

const TabContainer = (props) => {
  return (
    <Typography component='div' style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
};

export default ProfileTabs;

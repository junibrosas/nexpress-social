import React from 'react';
import { Button } from '@material-ui/core';
import { UserApiService } from 'src/services/userapi.service';

type ComponentProps = {
  following: boolean;
  onButtonClick: (api: any) => void;
};

const FollowProfileButton = (props: ComponentProps) => {
  const followClick = () => {
    props.onButtonClick(UserApiService.follow);
  };

  const unfollowClick = () => {
    props.onButtonClick(UserApiService.unfollow);
  };

  return (
    <div>
      {props.following ? (
        <Button variant='contained' color='secondary' onClick={unfollowClick}>
          Unfollow
        </Button>
      ) : (
        <Button variant='contained' color='primary' onClick={followClick}>
          Follow
        </Button>
      )}
    </div>
  );
};

export default FollowProfileButton;

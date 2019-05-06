import React, {Component} from 'react'
import { Button } from '@material-ui/core';
import { UserApiService } from 'src/services/userapi.service';

interface IProps {
  following: boolean;
  onButtonClick: (api: any) => void;
}

export class FollowProfileButton extends Component<IProps, null> {
  followClick = () => {
    this.props.onButtonClick(UserApiService.follow)
  }
  unfollowClick = () => {
    this.props.onButtonClick(UserApiService.unfollow)
  }
  render() {
    return (<div>
      { this.props.following
        ? (<Button variant="contained" color="secondary" onClick={this.unfollowClick}>Unfollow</Button>)
        : (<Button variant="contained" color="primary" onClick={this.followClick}>Follow</Button>)
      }
    </div>)
  }
}
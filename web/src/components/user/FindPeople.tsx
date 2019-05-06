import React from 'react';
import { 
  Snackbar,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Button,
  withStyles } from '@material-ui/core';
import ViewIcon from '@material-ui/icons/Visibility';
import Link from 'next/link';
import { UserApiService } from 'src/services/userapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';

interface IProps {
  classes: any;
}

interface IState {
  users: any;
  open: boolean;
  followMessage: string;
}

const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: 0
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  avatar: {
    marginRight: theme.spacing.unit * 1
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: 'middle'
  }
});


class FindPeopleComponent extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      open: false,
      followMessage: ''
    }
  }

  render() {
    const {classes} = this.props;

    return (<div>
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Who to follow
        </Typography>
        <List>
          {this.state.users.map((item, i) => {
              return <span key={i}>
                <ListItem>
                  <ListItemAvatar className={classes.avatar}>
                      <Avatar src={UserApiService.getPhotoUrl(item._id)}/>
                  </ListItemAvatar>
                  <ListItemText primary={item.name}/>
                  <ListItemSecondaryAction className={classes.follow}>
                    <Link as={`/profile/${item._id}`} href={"/profile?userId=" + item._id}>
                      <IconButton color="secondary" className={classes.viewButton}>
                        <ViewIcon/>
                      </IconButton>
                    </Link>
                    <Button aria-label="Follow" variant="contained" color="primary" onClick={this.clickFollow.bind(this, item, i)}>
                      Follow
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </span>
            })
          }
        </List>
      </Paper>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{this.state.followMessage}</span>}
      />
    </div>)
  }

  componentDidMount = () => {
    const jwt = AuthHelper.isAuthenticated();

    UserApiService.findPeople(
      { userId: jwt.user._id },
      { t: jwt.token },
    ).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    })
  }

  clickFollow = (user, index) => {
    const jwt = AuthHelper.isAuthenticated();

    UserApiService.follow(
      { userId: jwt.user._id },
      { t: jwt.token },
      user._id
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        let toFollow = this.state.users;
        toFollow.splice(index, 1);

        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}!`
        });
      }
    });
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }
}

export const FindPeople = withStyles(styles)(FindPeopleComponent);
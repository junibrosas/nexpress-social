import React from 'react';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Person from '@material-ui/icons/Person';
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { UserApiService } from 'src/services/userapi.service';
import Page from 'src/components/common/Page';

type ComponentState = {
  users: any;
};

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(),
    margin: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
  },
}));

const Users = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState>({
    users: [],
  });

  React.useEffect(() => {
    UserApiService.list().then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setState({ ...state, users: data });
      }
    });
  }, []);

  return (
    <Page>
      <Paper className={classes.root} elevation={4}>
        <Typography variant='h6' className={classes.title}>
          All Users
        </Typography>
        <List dense>
          {state.users.map((item, i) => {
            return (
              <Link href={'/profile/' + item._id} key={i}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <ArrowForward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Paper>
    </Page>
  );
};

export default Users;

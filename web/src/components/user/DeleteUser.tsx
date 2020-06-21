import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Router from 'next/router';
import { UserApiService } from 'src/services/userapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';

type ComponentProps = {
  userId: number;
};

type ComponentState = {
  redirect: boolean;
  open: boolean;
};

const DeleteUser = (props: ComponentProps) => {
  const [state, setState] = React.useState<ComponentState | null>({
    redirect: false,
    open: false,
  });

  React.useEffect(() => {
    Router.push('/');
  }, [state.redirect]);

  const clickButton = () => {
    setState({ ...state, open: true });
  };

  const deleteAccount = () => {
    const jwt = AuthHelper.isAuthenticated();
    UserApiService.remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        AuthHelper.signout(() => console.log('deleted'));
        setState({ ...state, redirect: true });
      }
    });
  };

  const handleRequestClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <span>
      <IconButton aria-label='Delete' onClick={clickButton} color='secondary'>
        <DeleteIcon />
      </IconButton>

      <Dialog open={state.open} onClose={handleRequestClose}>
        <DialogTitle>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={deleteAccount} color='secondary' autoFocus={true}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default DeleteUser;

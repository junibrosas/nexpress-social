import React, {Component} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Button} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Router from 'next/router';
import { UserApiService } from 'src/services/userapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';

interface IProps { 
  userId: number;
}

export class DeleteUser extends Component<IProps, any> {
  state = {
    redirect: false,
    open: false
  }
  clickButton = () => {
    this.setState({open: true})
  }
  deleteAccount = () => {
    const jwt = AuthHelper.isAuthenticated()
    UserApiService.remove({
      userId: this.props.userId
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        AuthHelper.signout(() => console.log('deleted'))
        this.setState({redirect: true})
      }
    })
  }
  handleRequestClose = () => {
    this.setState({open: false})
  }
  render() {
    const redirect = this.state.redirect
    if (redirect) {
      return Router.push('/');
    }
    return (
      <span>
        <IconButton aria-label="Delete" onClick={this.clickButton} color="secondary">
          <DeleteIcon/>
        </IconButton>

        <Dialog open={this.state.open} onClose={this.handleRequestClose}>
          <DialogTitle>{"Delete Account"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteAccount} color="secondary" autoFocus={true}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    )
  }
}

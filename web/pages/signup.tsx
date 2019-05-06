import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import { UserApiService } from 'src/services/userapi.service';
import { Page } from 'src/components/common/Page';

interface IProps {
  classes: any;
}

interface IState {
  name: string;
  password: string;
  email: string;
  open: boolean;
  error: string;
}

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  }
})

class Signup extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      password: '',
      email: '',
      open: false,
      error: ''
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Page>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h2" className={classes.title}>
              Sign Up
            </Typography>
            <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} margin="normal" /><br />
            <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal" /><br />
            <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} margin="normal" />
            <br /> {
              this.state.error && (<Typography component="p" color="error">
                <Icon color="error" className={classes.error}>error</Icon>
                {this.state.error}</Typography>)
            }
          </CardContent>
          <CardActions>
            <Button color="primary" variant="contained" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
          </CardActions>
        </Card>
        <Dialog open={this.state.open} disableBackdropClick={true}>
          <DialogTitle>New Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              New account successfully created.
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link href="/signin">
              <Button color="primary" autoFocus={true} variant="contained">
                  Sign In
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </Page>
    )
  }

  handleChange = name => event => {
    this.setState(({ [name]: event.target.value } as any));
  }

  clickSubmit = () => {
    const user = {
      name: this.state.name || undefined,
      email: this.state.email || undefined,
      password: this.state.password || undefined
    }

    UserApiService.create(user).then((data) => {
      if (data && data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ error: '', open: true })
      }
    })
  }
}

export default withStyles((styles as any))(Signup);
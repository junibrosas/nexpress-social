import React from 'react';
import { withStyles } from '@material-ui/core';
import { Card, CardHeader, CardContent, CardActions, IconButton, Button, Typography, Avatar, Icon, TextField } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { PostApiService } from 'src/services/postapi.service';
import { AuthHelper } from 'src/helpers/auth.helper';
import { UserApiService } from 'src/services/userapi.service';

interface IProps {
  classes: any;
  addUpdate: (post: any) => void;
}

interface IState {
  text: string;
  photo: any;
  error: string;
  user: any;
}

const styles = theme => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing.unit*3}px 0px 1px`
  },
  card: {
    maxWidth:600,
    margin: 'auto',
    marginBottom: theme.spacing.unit*3,
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none'
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8
  },
  photoButton: {
    height: 30,
    marginBottom: 5
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
    width: '90%'
  },
  submit: {
    margin: theme.spacing.unit * 2
  },
  filename:{
    verticalAlign: 'super'
  }
})

class NewPostComponent extends React.Component<IProps, IState> {
  postData: FormData;

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      photo: '',
      error: '',
      user: {}
    }
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
        <CardHeader
              avatar={
                <Avatar src={UserApiService.getPhotoUrl(this.state.user._id)}/>
              }
              title={this.state.user.name}
              className={classes.cardHeader}
            />
        <CardContent className={classes.cardContent}>
          <TextField
              placeholder="Share your thoughts ..."
              multiline
              rows="3"
              value={this.state.text}
              onChange={this.handleChange('text')}
              className={classes.textField}
              margin="normal"
          />
          <input accept="image/*" onChange={this.handleChange('photo')} className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <IconButton color="secondary" className={classes.photoButton} component="span">
              <PhotoCamera />
            </IconButton>
          </label> <span className={classes.filename}>{this.state.photo ? this.state.photo.name : ''}</span>
          { this.state.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
                {this.state.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" disabled={this.state.text === ''} onClick={this.clickPost} className={classes.submit}>POST</Button>
        </CardActions>
      </Card>
    </div>
    )
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: AuthHelper.isAuthenticated().user });
  }

  handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    this.postData.set(name, value);
    this.setState(({ [name]: value } as any));
  }

  clickPost = () => {
    const jwt = AuthHelper.isAuthenticated();

    PostApiService.create(
      { userId: jwt.user._id },
      { t: jwt.token},
      this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ text: '', photo: '' });
          this.props.addUpdate(data);
        }
      });
  }
}

export const NewPost = withStyles(styles)(NewPostComponent)
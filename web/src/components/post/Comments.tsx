import React from 'react';
import { CardHeader, TextField, Avatar, Icon } from '@material-ui/core';

import Link from 'next/link';
import { AuthHelper } from 'src/helpers/auth.helper';
import { PostApiService } from 'src/services/postapi.service';
import { withStyles } from '@material-ui/core';
import { UserApiService } from 'src/services/userapi.service';

interface IProps {
  classes: any;
  postId: any;
  comments: any;
  updateComments: any;
}

interface IState {
  text: string;
}

const styles = theme => ({
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    width: 25,
    height: 25
  },
  commentField: {
    width: '96%'
  },
  commentText: {
    backgroundColor: 'white',
    padding: theme.spacing.unit,
    margin: `2px ${theme.spacing.unit*2}px 2px 2px`
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em'
 },
 commentDelete: {
   fontSize: '1.6em',
   verticalAlign: 'middle',
   cursor: 'pointer'
 }
})

class CommentsComponent extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    
    this.state = {text: ''}
  }

  render() {
    const {classes} = this.props
    const commentBody = item => {
      return (
        <p className={classes.commentText}>
          <Link href={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link><br/>
          {item.text}
          <span className={classes.commentDate}>
            {(new Date(item.created)).toDateString()} |
            {AuthHelper.isAuthenticated().user._id === item.postedBy._id &&
              <Icon onClick={this.deleteComment(item)} className={classes.commentDelete}>delete</Icon> }
          </span>
        </p>
      )
    }

    return (
      <div>
        <CardHeader
          avatar={
            <Avatar className={classes.smallAvatar} src={UserApiService.getPhotoUrl(AuthHelper.isAuthenticated().user._id)} />
          }
          title={ <TextField
            onKeyDown={this.addComment}
            multiline
            value={this.state.text}
            onChange={this.handleChange('text')}
            placeholder="Write something ..."
            className={classes.commentField}
            margin="normal"
            />}
          className={classes.cardHeader}
        />
        { this.props.comments.map((item, i) => {
            return (
              <CardHeader
                avatar={
                  <Avatar className={classes.smallAvatar} src={UserApiService.getPhotoUrl(item.postedBy._id)} />
                }
                title={commentBody(item)}
                className={classes.cardHeader}
                key={i}/>
            )
          })
        }
      </div>
    )
  }

  handleChange = name => event => {
    this.setState(({[name]: event.target.value} as any));
  }

  addComment = (event) => {
    if(event.keyCode == 13 && event.target.value){
      event.preventDefault()
      const jwt = AuthHelper.isAuthenticated()
      PostApiService.comment({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, this.props.postId, {text: this.state.text}).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({text: ''})
          this.props.updateComments(data.comments)
        }
      })
    }
  }

  deleteComment = comment => () => {
    const jwt = AuthHelper.isAuthenticated()
    PostApiService.uncomment({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.props.postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.props.updateComments(data.comments)
      }
    })
  }
}

export const Comments = withStyles(styles)(CommentsComponent);

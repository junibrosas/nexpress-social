import React from 'react';
import { CardHeader, TextField, Avatar, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import { AuthHelper } from 'src/helpers/auth.helper';
import { PostApiService } from 'src/services/postapi.service';
import { UserApiService } from 'src/services/userapi.service';

type ComponentProps = {
  postId: any;
  comments: any;
  updateComments: any;
};

type ComponentState = {
  text: string;
};

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
  },
  smallAvatar: {
    width: 25,
    height: 25,
  },
  commentField: {
    width: '96%',
  },
  commentText: {
    backgroundColor: 'white',
    padding: theme.spacing(),
    margin: `2px ${theme.spacing(2)}px 2px 2px`,
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em',
  },
  commentDelete: {
    fontSize: '1.6em',
    verticalAlign: 'middle',
    cursor: 'pointer',
  },
}));

const Comments = (props: ComponentProps) => {
  const classes = useStyles();
  const [state, setState] = React.useState<ComponentState | null>({ text: '' });

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value } as any);
  };

  const addComment = (event) => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault();
      const jwt = AuthHelper.isAuthenticated();
      PostApiService.comment(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        props.postId,
        { text: state.text }
      ).then((data) => {
        if (data && data.error) {
          console.log(data.error);
        } else {
          setState({ text: '' });
          props.updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => () => {
    const jwt = AuthHelper.isAuthenticated();
    PostApiService.uncomment(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.postId,
      comment
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentText}>
        <Link href={'/profile/' + item.postedBy._id}>{item.postedBy.name}</Link>
        <br />
        {item.text}
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()} |
          {AuthHelper.isAuthenticated().user._id === item.postedBy._id && (
            <Icon
              onClick={deleteComment(item)}
              className={classes.commentDelete}
            >
              delete
            </Icon>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={UserApiService.getPhotoUrl(
              AuthHelper.isAuthenticated().user._id
            )}
          />
        }
        title={
          <TextField
            onKeyDown={addComment}
            multiline
            value={state.text}
            onChange={handleChange('text')}
            placeholder='Write something ...'
            className={classes.commentField}
            margin='normal'
          />
        }
        className={classes.cardHeader}
      />
      {props.comments.map((item, i) => {
        return (
          <CardHeader
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={UserApiService.getPhotoUrl(item.postedBy._id)}
              />
            }
            title={commentBody(item)}
            className={classes.cardHeader}
            key={i}
          />
        );
      })}
    </div>
  );
};

export default Comments;

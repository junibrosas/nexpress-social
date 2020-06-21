import React from 'react';
import Post from './Post';

interface ComponentProps {
  posts: any;
  removeUpdate: any;
}

const PostList = (props: ComponentProps) => {
  return (
    <div style={{ marginTop: '24px' }}>
      {props.posts.map((item, i) => {
        return <Post post={item} key={i} onRemove={props.removeUpdate} />;
      })}
    </div>
  );
};

export default PostList;

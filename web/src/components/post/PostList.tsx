import React, {Component} from 'react'
import Post from './Post';

interface IProps {
  posts: any;
  removeUpdate: any;
}

export class PostList extends Component<IProps, null> {
  render() {
    return (
      <div style={{marginTop: '24px'}}>
        {this.props.posts.map((item, i) => {
            return <Post post={item} key={i} onRemove={this.props.removeUpdate}/>
          })
        }
      </div>
    )
  }
}

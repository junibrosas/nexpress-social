import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const endpoint = publicRuntimeConfig.api.endpoint;

class ApiService {
  create = (params, credentials, post) => {
    return fetch(`${endpoint}/posts/new/`+ params.userId, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer' + credentials.t
      },
      body: post
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    });
  }

  listNewsFeed = (params, credentials) => {
    return fetch(`${endpoint}/posts/feed/${params.userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    }).then(response => {
      return response.json();
    }).catch((err) => console.log(err))
  }

  remove = (params, credentials) => {
    return fetch(`${endpoint}/posts/${params.userId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }

  like = (params, credentials, postId) => {
    return fetch(`${endpoint}/posts/like/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, postId: postId})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }

  unlike = (params, credentials, postId) => {
    return fetch(`${endpoint}/posts/unlike/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, postId: postId})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }

  comment = (params, credentials, postId, comment) => {
    return fetch(`${endpoint}/posts/comment/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }
  
  uncomment = (params, credentials, postId, comment) => {
    return fetch(`${endpoint}/posts/uncomment/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }
} 

export const PostApiService = new ApiService();
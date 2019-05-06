import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const endpoint = publicRuntimeConfig.api.endpoint;

class ApiService {
  create = (user) => {
    return fetch(`${endpoint}/users/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then((response) => {
        return response.json()
      }).catch((err) => console.log(err))
  }
  
  read = (params, credentials) => {
    return fetch(`${endpoint}/users/${params.userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    }).then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
  }

  update = (params, credentials, user) => {
    return fetch(`${endpoint}/users/${params.userId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: user
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }

  remove = (params, credentials) => {
    return fetch(`${endpoint}/users/${params.userId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    }).then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
  }

  list = () => {
    return fetch(`${endpoint}/users`, {
      method: 'GET',
    }).then(response => {
      return response.json()
    }).catch((err) => console.log(err))
  }

  follow = (params, credentials, followId) => {
    return fetch(`${endpoint}/users/follow/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, followId: followId})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }
  
  unfollow = (params, credentials, unfollowId) => {
    return fetch(`${endpoint}/users/unfollow/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, unfollowId: unfollowId})
    }).then((response) => {
      return response.json()
    }).catch((err) => {
      console.log(err)
    })
  }

  findPeople = (params, credentials) => {
    return fetch(`${endpoint}/users/findpeople/${params.userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    }).then((response) => {
      return response.json();
    }).catch((err) => console.log(err));
  }

  getPhotoUrl = (userId) => {
    return `${endpoint}/users/photo/${userId}?${new Date().getTime()}`;
  }

  getDefaultPhotoUrl = () => {
    return `${endpoint}/users/defaultphoto`;
  }
}


export const UserApiService = new ApiService();
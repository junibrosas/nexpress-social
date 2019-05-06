import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const endpoint = publicRuntimeConfig.api.endpoint;

class ApiService {
  create = (user) => {
    return fetch(`${endpoint}/api/users/`, {
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

  getPhotoUrl = (userId) => {
    return `${endpoint}/users/photo/${userId}`;
  }
}


export const UserApiService = new ApiService();
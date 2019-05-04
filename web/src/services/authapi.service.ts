import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const endpoint = publicRuntimeConfig.api.endpoint;

class ApiService {
  signin = (user) => {
    return fetch(`${endpoint}/auth/signin/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
      })
      .then((response) => {
        return response.json()
      }).catch((err) => console.log(err))
  }

  signout = () => {
    return fetch(`${endpoint}/auth/signout/`, {
      method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
  }
}


export const AuthApiService = new ApiService();
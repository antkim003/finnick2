import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  FETCH_USERS,
  FETCH_USER,
  ADD_USER,
  REMOVE_USER,
  FETCH_SESSION,
  FETCH_COLUMNS,
  FETCH_COLLECTIONS,
  UPDATE_USER,
  FETCH_TYPES,
  FETCH_PERMISSIONS
} from './type';
import _ from 'lodash';

export function loginUser( { username, password }) {
  // redux thunk here
  return function(dispatch) {
    axios.post('/login', { username, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        dispatch(fetchSession());
        browserHistory.push('/');
      })
      .catch(response => {
        dispatch(authError(response.data));
      });
  }
}

export function logoutUser() {
  return function(dispatch) {
    axios.get('/logout')
      .then(response => {
        dispatch({ type: UNAUTH_USER});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { type: UNAUTH_USER };
      })
      .catch( response => {
        dispatch(authError(response.data));
      });
  }
}

export function fetchCollections() {
  const request = axios.get('api/categories');
  console.log('fetchCollections request', request);
  return {
    type: FETCH_COLLECTIONS,
    payload: request
  };
};

export function fetchSession() {
  return function(dispatch) {
    axios.get('/api/members/session')
      .then( response => {
        console.log('heres the response from fetch session:', response.data);
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token',response.data.token);

        var oldUser = JSON.parse(localStorage.all).user;
        if (oldUser.updatedAt != response.data.user.updatedAt) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        dispatch({ type: FETCH_SESSION, payload: response });
      })
      .catch( response => {
        dispatch({ type: UNAUTH_USER });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
})
  }
};

export function addUser( data ) {
  return function(dispatch) {
    axios.post('/api/users/', data)
      .then(response => {
        console.log('post user', response.data);
        dispatch({ type: ADD_USER, payload: response });
        dispatch(fetchUsers());
        return { type: FETCH_USERS }
      })
      .catch(error => {
        console.error('there wasn an error: ', error);
      })
  }
};

export function updateUser( userId, data ) {
  return function(dispatch) {
    axios.put('/api/users/' + userId, data)
      .then(response => {
        console.log('it posted', response.data);
        dispatch({ type: UPDATE_USER, payload: response })
        dispatch(fetchUsers());
      })
      .catch(error => {
        console.log('there was an error', error);
      });
  };
};

export function fetchUser( {userId}) {
  const request = axios.get('/api/users/' + userId);
  return {
    type: FETCH_USER,
    payload: request
  };
};

export function removeUser( {userId} ) {
  return function(dispatch) {
    axios.delete('/api/users/' + userId)
      .then(response => {
        dispatch({ type: REMOVE_USER, payload: response });
        dispatch(fetchUsers());
      })
      .catch(error => {

      });
  }
}

export function fetchUsers() {
  const request = axios.get('/api/members');

  return {
    type: FETCH_USERS,
    payload: request
  };
};

export function fetchTypes() {
  const request = axios.get('/api/users/types');

  return {
    type: FETCH_TYPES,
    payload: request
  };
};

export function fetchColumns() {
  const request = axios.get('/api/columns/index');

  return {
    type: FETCH_COLUMNS,
    payload: request
  };
};

export function fetchPermissions() {
  const request = axios.get('/api/permissions');

  return {
    type: FETCH_PERMISSIONS,
    payload:request
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

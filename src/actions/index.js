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
  FETCH_SESSION,
  FETCH_COLUMNS,
  FETCH_COLLECTIONS,
  UPDATE_USER,
  FETCH_TYPES
} from './type';

export function loginUser( { email, password }) {
  // redux thunk here
  return function(dispatch) {
    axios.post('/login', { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        dispatch(fetchSession());
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/admin');
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
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token',response.data.token);
        dispatch({ type: FETCH_SESSION, payload: response });
      })
      .catch( response => {
        dispatch({ type: UNAUTH_USER });
        localStorage.removeItem('token');
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

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  FETCH_USERS,
  FETCH_SESSION,
  FETCH_COLUMNS,
  FETCH_COLLECTIONS
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
  const request = axios.get('/api/members/session');

  return {
    type: FETCH_SESSION,
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

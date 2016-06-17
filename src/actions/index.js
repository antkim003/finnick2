import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  FETCH_USERS,
  FETCH_SESSION,
  FETCH_COLUMNS
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
// export function fetchSession() {
//   return function(dispatch) {
//     axios.get('/session')
//       .then( response => {
//         console.log('response came back!', response.data);
//         dispatch({
//           type: FETCH_SESSION,
//           payload: response
//         });
//       })
//       .catch( response => {
//         dispatch({ type: UNAUTH_USER });
//         dispatch(authError(response.data));
//       });
//   };
//
// };

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

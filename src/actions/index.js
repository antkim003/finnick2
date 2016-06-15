import axios from 'axios';
import {
  FETCH_USERS,
  FETCH_COLUMNS
} from './type';

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

import {
  FETCH_USER,
  UPDATE_USER,
  ADD_USER,
  REMOVE_USER
} from '../actions/type';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_USER:
      return [...state, ...action.payload.data];
    case ADD_USER:
      return [...state, ...action.payload.data];
    case UPDATE_USER:
      return [...state, ...action.payload.data];
    case REMOVE_USER:
      return [...state, ...action.payload.data];
    default:
      return state
  }
}

import {
  FETCH_SESSION
} from '../actions/type';

const INITIAL_STATE = { user: null };

export default function(state = INITIAL_STATE, action) {
  console.log('action created', action);
  switch (action.type) {
    case FETCH_SESSION:
      return { ...state, user: action.payload.data.user };
    default:
      return state;
  }
}

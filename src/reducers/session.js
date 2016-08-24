import {
  FETCH_SESSION
} from '../actions/type';

const INITIAL_STATE = { user: null };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SESSION:
      var obj = { ...state, user: action.payload.data.user };
      return obj
    default:
      return state;
  }
}

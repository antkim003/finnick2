import {
  FETCH_USERS
} from '../actions/type';

export default function(state = [], action) {
  console.log('users action: ', action, 'state: ', state);
  switch (action.type) {
    case FETCH_USERS:
      state = []; // empty the state and repopulate
      return [ ...state, ...action.payload.data ];
    default:
      return state
  }
}

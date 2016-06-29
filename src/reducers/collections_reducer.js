import {
  FETCH_COLLECTIONS
} from '../actions/type';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_COLLECTIONS:
      return [ ...state, ...action.payload.data.categories ];
    default:
      return state
  }
}

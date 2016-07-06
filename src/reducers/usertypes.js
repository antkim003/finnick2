import {
  FETCH_TYPES
} from '../actions/type';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_TYPES:
      return [ ...state, ...action.payload.data.types ];
    default:
      return state
  }
}

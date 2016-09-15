import {
  FETCH_TYPES
} from '../actions/type';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_TYPES:
      return [ ...state, ...action.payload.data.types.sort(compare) ];
    default:
      return state
  }
}

function compare(a,b) {
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1;
  }
  if (a.toLowerCase() > b.toLowerCase()) {
    return 1;
  }
  return 0;
}

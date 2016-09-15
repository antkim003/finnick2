import {
  FETCH_COLLECTIONS
} from '../actions/type';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_COLLECTIONS:
      console.log('before: ', state, action);
      var output =
      console.log('asdf:', output );
      return [ ...state, ...action.payload.data.categories.sort(compare) ];
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

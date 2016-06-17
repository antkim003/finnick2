import {
  FETCH_COLUMNS
} from '../actions/type';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_COLUMNS:
      return [ ...state, ...action.payload.data ];
  }
  return state;
}

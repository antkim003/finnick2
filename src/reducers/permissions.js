import {
  FETCH_PERMISSIONS
} from '../actions/type';


export default function(state = [], action) {
  switch (action.type) {
    case FETCH_PERMISSIONS:
      return [ ...state, ...action.payload.data ];
    default:
      return state
  }
}

import { combineReducers } from 'redux';
import usersReducer from './users';
import columnsReducer from './columns';

const rootReducer = combineReducers({
  users: usersReducer,
  columns: columnsReducer
});

export default rootReducer;

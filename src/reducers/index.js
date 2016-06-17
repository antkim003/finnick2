import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import usersReducer from './users';
import columnsReducer from './columns';
import sessionReducer from './session';

const rootReducer = combineReducers({
  form,
  session: sessionReducer,
  users: usersReducer,
  columns: columnsReducer,
  auth: authReducer
});

export default rootReducer;

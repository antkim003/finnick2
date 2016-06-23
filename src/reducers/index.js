import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import usersReducer from './users';
import userReducer from './user';
import columnsReducer from './columns';
import sessionReducer from './session';
import collectionsReducer from './collections_reducer';

const rootReducer = combineReducers({
  form,
  session: sessionReducer,
  user: userReducer,
  users: usersReducer,
  columns: columnsReducer,
  auth: authReducer,
  collections: collectionsReducer
});

export default rootReducer;

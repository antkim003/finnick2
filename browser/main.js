import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './wrapper.js';
import App from './App.js';
import 'babel-polyfill';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import ReduxThunk from 'redux-thunk';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import RequireAuth from '../src/components/auth/require_auth';
import reducers from '../src/reducers';
import ReduxPromise from 'redux-promise';
import { AUTH_USER } from '../src/actions/type';
import { fetchSession }from '../src/actions';

// const createStoreWithMiddleware = applyMiddleware(ReduxPromise, ReduxThunk)(createStore);
// const store = createStoreWithMiddleware(reducers);

const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(ReduxPromise, ReduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

const token = localStorage.getItem('token');
if(token) {
  store.dispatch({ type: AUTH_USER });
  store.dispatch(fetchSession());
} else {
  store.dispatch(fetchSession());
}

const Admin = require('../src/components/admin/admin.js');
const Login = require('../src/components/auth/login.js');
const Logout = require('../src/components/auth/logout.js');
const Landing = require('../src/components/landing.js');
const Combobulator = require('../src/components/combobulator.js');
const TilePreview = require('../src/components/singletilepreview.js');
const Homepage = require('../src/components/homepagepreview.js');

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Wrapper}>
        <IndexRoute component={Landing} />
        <Route path="admin" component={RequireAuth(Admin)}/>
        <Route path="finnick" component={RequireAuth(App)} />
        <Route path="combobulator" component={RequireAuth(Combobulator)} />
        <Route path="combobulatorunauth" component={Combobulator} />
          <Route path="combobulator/tile" component={RequireAuth(TilePreview)} />
        <Route path="homepagepreview" component={RequireAuth(Homepage)} />
        <Route path="login" component={Login}/>
        <Route path="logout" component={Logout}/>
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root'))

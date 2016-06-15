import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../src/reducers';
import Async from '../src/middlewares/async';
const createStoreWithMiddleware = applyMiddleware(Async)(createStore);


const Admin = require('../src/components/admin/admin.js');
// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={browserHistory}>
      <Route path="/" component={App}/>
      <Route path="/admin" component={Admin}/>
    </Router>
  </Provider>
  , document.getElementById('root'))

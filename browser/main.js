import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
// import Admin from '../admin/admin.js';
var Admin = require('./views/admin/admin');
// ReactDOM.render(<App />, document.getElementById('root'));


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
    <Route path="/admin" component={Admin}/>
  </Router>
), document.getElementById('root'))


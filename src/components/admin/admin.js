'use strict';
var React = require('react');
import { Component } from 'react';

import UserList from './user_list';

module.exports = React.createClass({

  render() {
      return (
          <div>
              this is the admin view
              <UserList />
          </div>
          );
      }
})

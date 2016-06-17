import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserList from './user_list';
import * as actions from '../../actions';

import NavBar from '../../containers/navbar'

class Admin extends Component {
  renderUser(session) {
    if (session.user) {
      return (
        <strong>
          {session.user.email}
        </strong>
      )
    }

  }
  render() {
      return (
          <div>
              <NavBar></NavBar>
              <div className="container">
                <h1>WELCOME {this.renderUser(this.props.session)}! this is the admin view</h1>
                <UserList />
              </div>
          </div>
          );
      }
}

function mapStateToProps(state) {
  return {
    session: state.session
  }
}

module.exports = connect(mapStateToProps, null)(Admin);

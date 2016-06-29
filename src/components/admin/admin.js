import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserList from './user_list';
import AdminControls from './admin_controls';
import * as actions from '../../actions';

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
              <div className="container">
                <h1>WELCOME {this.renderUser(this.props.session)}! this is the admin view</h1>
                <AdminControls />
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

module.exports = connect(mapStateToProps, actions)(Admin);

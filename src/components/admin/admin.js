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
          {session.user.username}
        </strong>
      )
    }

  }
  render() {
      return (
          <div>
              <div className="container">
                <h1>Welcome {this.renderUser(this.props.session)}!</h1>
                <p>This is the admin view</p>
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

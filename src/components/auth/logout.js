import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Logout extends Component {
  componentWillMount() {
    this.props.logoutUser()
  }

  render() {
    return (
      <div>
        <div>Sorry to see you go...</div>
      </div>
    );
  }
}

// export default connect(null, actions)(Logout);
module.exports = connect(null, actions)(Logout);

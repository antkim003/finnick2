import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router';

class Logout extends Component {
  componentWillMount() {
    this.props.logoutUser()
  }
  componentDidMount() {
    browserHistory.push( '/');
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

import React, { Component } from 'react'
import { Link } from 'react-router';
import { connect } from 'react-redux';

class NavBar extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      return (
        [<li className="nav-item">
          <Link className="nav-link" to="/admin">Admin</Link>
        </li>,
        <li className="nav-item">
          <Link className="nav-link" to="/logout">Log Out</Link>
        </li>]
      )
    } else {
      return (
        <li className="nav-item">
          <Link className="nav-link" to="/login">Sign In</Link>
        </li>
      )
    }
  }
  render () {
    return (
      <div className="clearfix container row">
        <ul className="nav navbar-nav navbar-right">
          <li className="nav-item">
            <Link className="nav-link" to="/">Finnick</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/landing">Landing</Link>
          </li>
          {this.renderLinks()}
        </ul>
      </div>
    )
  }


}

function mapStateToProps(state) {
  return {
      authenticated: state.auth.authenticated
  };
}

module.exports = connect(mapStateToProps, null)(NavBar);

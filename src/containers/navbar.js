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
      <nav className="navbar navbar-fixed-top">
      <div className="clearfix container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">Finnick 2.0</a>
        </div>
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
    </nav>
    )
  }


}

function mapStateToProps(state) {
  return {
      authenticated: state.auth.authenticated
  };
}

module.exports = connect(mapStateToProps, null)(NavBar);

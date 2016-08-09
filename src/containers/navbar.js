import React, { Component } from 'react'
import { Link } from 'react-router';
import { connect } from 'react-redux';

class NavBar extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      return (
        [<li className="nav-item" key="n1">
          <Link className="nav-link" to="/admin" key="n1-1">Admin</Link>
        </li>,
        // <li className="nav-item" key="n3">
        //   <Link className="nav-link" to="/combobulator" key="n1-1">Combobulator</Link>
        // </li>,
        <li className="nav-item" key="n2">
          <Link className="nav-link" to="/logout" key="n2-1">Log Out</Link>
        </li>]
      )
    } else {
      return (
        <li className="nav-item" key="n3">
          <Link className="nav-link" to="/login" key="n3-1">Sign In</Link>
        </li>
      )
    }
  }
  render () {
    return (
      <nav className="navbar navbar-fixed-top" style={{'zIndex': '100', 'backgroundColor': 'white'}}>
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
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/finnick">Finnick</Link>
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

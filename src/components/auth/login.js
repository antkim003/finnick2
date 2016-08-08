import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from '../../actions';

class Login extends Component {
  handleFormSubmit({ username, password }) {
    this.props.loginUser({ username, password });
  }
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      )
    }
  }
  componentWillMount() {
    if (this.props.authenticated) {
      browserHistory.push('/');
    }
  }
  render() {
    const { handleSubmit, fields: { username, password}} = this.props;
    return (
      <div>

        <div className="panel panel-default container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <div className="form-group">
              <label>Username:</label>
              <input {...username} className="form-control" />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input {...password} type="password" className="form-control" />
            </div>
            {this.renderAlert()}
            <button action="submit" className="btn btn-default">Sign in</button>
          </form>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated,
    session: state.session
  };
}

module.exports = reduxForm({
  form: 'login',
  fields: ['username', 'password']
}, mapStateToProps, actions)(Login);

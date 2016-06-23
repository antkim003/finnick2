import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from '../../actions';

class Login extends Component {
  handleFormSubmit({ email, password }) {
    this.props.loginUser({ email, password });
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
      browserHistory.push('/admin');
    }
  }
  render() {
    const { handleSubmit, fields: { email, password}} = this.props;
    return (
      <div>

        <div className="panel panel-default container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <div className="form-group">
              <label>Email:</label>
              <input {...email} className="form-control" />
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
  fields: ['email', 'password']
}, mapStateToProps, actions)(Login);

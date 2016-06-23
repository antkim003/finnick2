import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class Authentication extends Component {

    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      console.log('it came into require auth', this.props.authenticated);
      if (!this.props.authenticated) {
        this.context.router.push('/landing');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.push('/landing');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}

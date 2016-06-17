import React, { Component } from 'react';
import NavBar from '../containers/navbar';
import { bindActionCreators } from 'redux';

class Landing extends Component {
  componentWillMount() {
    // this.props.fetchSession();
  }
  //
  // renderSession(session) {
  //   return (
  //     <strong class="bold">
  //       {session.user.email}
  //     </strong>
  //   );
  // }


  render () {
    // console.log(this.props.session, this.props.authenticated);
    return (
      <div className="home">
        <NavBar />

        <div className="container">
          <h3>THIS IS THE LANDING PAGE</h3>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>
    )

  }
}

// function mapStateToProps(state) {
//   return {
//     authenticated: state.auth.authenticated,
//     session: state.session
//   };
// }
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ fetchSession }, dispatch);
// }

// export default Landing;
module.exports = Landing;

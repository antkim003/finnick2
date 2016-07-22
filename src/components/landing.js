import React, { Component } from 'react';
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
          <div className="container">
            <h1>FINNICK 2.0 - Black Friday Data Aggregator</h1>
            <div>
              Finnick is a tool used for the Black Friday Project. All parties will be able to login and input data in real time. 
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

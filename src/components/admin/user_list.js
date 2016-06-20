import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class UserList extends Component {
  componentWillMount() {
    this.props.fetchUsers();
    this.props.fetchColumns();
  }

  renderUser(user) {
    return (
      <div>{user.email}</div>
    );
  }

  renderColumn(column) {
    return (
      <div>{column.header}</div>
    );
  }


  render() {
    return (
      <div className="UserList">
        {this.props.users.map(this.renderUser)}
        {/*{this.props.columns.map(this.renderColumn)}*/}
        {/*{this.props.columns}*/}
      </div>
    );
  }


}
function mapStateToProps(state) {
  return {
    users: state.users,
    columns: state.columns
  };
}

export default connect(mapStateToProps, actions)(UserList);

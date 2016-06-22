import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import orderBy from 'lodash/orderBy';
import Popup from './popup';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingColumn: null,
      columns: [
        {
          "property": "email",
          "header": "Email",
          "sort": "",
          "cell" : () => {}
        },
        {
          "property": "collections",
          "header": "Collections",
          "sort": "",
          "cell" : () => {}
        },
        {
          "property": "locked",
          "header": "Locked?",
          "sort": "",
          "cell" : () => {}
        },
        {
          "property": "createdAt",
          "header": "User since",
          "sort": "",
          "cell" : () => {}
        }
      ],
      users: this.props.users,
      popupData: {},
      clickTarget: null,
      clickX: null,
      clickY: null,
      popupState: 'closed'
    };
    this.clickCell = this.clickCell.bind(this);
    this.renderCell = this.renderCell.bind(this);
  }

  componentWillMount() {
    this.props.fetchUsers();
  }

  componentWillUpdate(nextProps, nextState) {
    // render props as a post action
    if (this.props.users != nextProps.users) {
      nextProps.users.forEach(function(user) {
        if (user.collections) {
          user.collections = user.collections.join(', ');
          user.locked = user.locked.toString();
          let date = new Date(user.createdAt);
          user.createdAt = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
          console.log('user.locked = ', user);
        }
      });
      this.setState({'users': nextProps.users})
    }
  }

  sortColumnClick(column) {
    let attribute = column.property;
    let sort;

    if (column.sort === 'asc') {
      column.sort = 'desc';
      sort = 'desc';
    } else {
      column.sort = 'asc'
      sort = 'asc'
    }
    this.setState({users: _.orderBy(this.state.users, [attribute] , [sort])});
  }

  renderColumnHeader(columns) {
    let arr = columns.map((column, i) => {
      return (
        <td onClick={this.sortColumnClick.bind(this,column)} data-property={column.property} key={i} className={"header " + column.sort }>
          <div>{column.header}</div>
        </td>
      )
    });
    return arr;
  }

  renderRow(data) {
    let arr = data.map((row,i) => {
      return (
          <tr className={i + "-row " + (i % 2 === 1 ? 'odd-row' : 'even-row') } key={i + '-key'}>
            {this.renderCell(row, i)}
          </tr>
      )
    });
    return arr;
  }

  clickCell(event) {
    console.log('this is the click cell event', event);
    this.setState({
      clickTarget: event.currentTarget,
      clickX: event.clientX,
      clickY: event.clientY,
      popupState: 'open'
    });
  }

  renderCell(row, i) {
    var self = this;
    return this.state.columns.map(function(column,z) {
      return (<td onClick={self.clickCell} key={i + '-' + z + '-cell'} className={'cell-' + i + '-' + z} data-property={row[column.property]}>
        {row[column.property]}
      </td>);
    });
  }

  render() {
    return (
      <div className="UserList">
        <table className='pure-table pure-table-striped'>
          <thead>
            <tr>
              {this.renderColumnHeader(this.state.columns)}
            </tr>
          </thead>

          <tbody>
            {this.renderRow(this.state.users)}
          </tbody>
        </table>
        <div>
          <Popup clickTarget={this.state.clickTarget}
                clickX={this.state.clickX}
                clickY={this.state.clickY}
                popupState={this.state.popupState}
                />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users
  };
}

export default connect(mapStateToProps, actions)(UserList);

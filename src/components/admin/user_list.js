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
          "header": "Email"
        },
        {
          "property": "collections",
          "header": "Collections"
        },
        {
          "property": "type",
          "header": "User Type"
        },
        {
          "property": "lead",
          "header": "Lead"
        },
        {
          "property": "locked",
          "header": "Locked?"
        }
      ],
      popupData: {},
      clickTarget: null,
      clickX: null,
      clickY: null,
      popupState: 'closed',
      userId: ""
    };
    this.clickCell = this.clickCell.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
    this.choiceChange = this.choiceChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchUsers();
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
    this.setState({users: _.orderBy(this.props.users, [attribute] , [sort])});
  }

  renderColumnHeader(columns) {
    let arr = columns.map((column, i) => {
      return (
        <th onClick={this.sortColumnClick.bind(this,column)} data-property={column.property} key={i} className={"header " + column.sort }>
          <div>{column.header}</div>
        </th>
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
    if (!event.currentTarget) {
      return;
    }

    if (event.currentTarget.getAttribute('data-property') === "collections") {

      this.setState({
        clickTarget: event.currentTarget,
        clickX: event.clientX,
        clickY: event.clientY,
        popupState: 'open',
        userId: event.currentTarget.getAttribute('data-user-id')
      });
      console.log('user set state: ', this.state.userId, event.currentTarget.getAttribute('data-user-id'));
    }
    if (event.currentTarget.getAttribute('data-property') === "locked" || event.currentTarget.getAttribute('data-property') && !event.currentTarget.classList.contains('__clicked')) {
      this.closePopup();
      $('.__clicked').removeClass('__clicked');
      event.currentTarget.className += ' __clicked';
    }
  }

  choiceChange(event) {
    let userId = event.currentTarget.parentElement.getAttribute('data-user-id');
    let property = event.currentTarget.parentElement.getAttribute('data-property');
    let payload = {};
    payload[property] = event.currentTarget.value;
    this.props.updateUser(userId, payload);
    $(event.currentTarget).removeClass('__clicked');
  }

  renderCheckbox(target, property) {
    return (
      <select className="form-control input-sm lockedCheckbox" onChange={this.choiceChange} value={target}>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    )
  }

  renderCell(row, i) {
    var self = this;
    if (row.length === 0) return;
    return this.state.columns.map(function(column,z) {
      let targetProperty = row[column.property];
      if (Array.isArray(targetProperty)) {
        targetProperty = targetProperty.join(', ');
      }
      if (typeof targetProperty === "boolean") {
        targetProperty = targetProperty.toString();
      }
      if (column.property === "createdAt") {
        let date = new Date(targetProperty);
        targetProperty = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
      }
      return (<td onClick={self.clickCell} key={i + '-' + z + '-cell'} className={'cell-' + i + '-' + z + ' ' + column.property} data-property={column.property}  data-user-id={row._id}>
        <div className="targetProperty">{targetProperty}</div>
        {column.property === "locked" || column.property === "lead"? self.renderCheckbox(targetProperty, column.property) : ''}
      </td>);
    });
  }

  closePopup() {
    this.setState({ popupState: "closed" });
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
            {this.renderRow(this.props.users)}
          </tbody>
        </table>
        <div>
          <Popup clickTarget={this.state.clickTarget}
                clickX={this.state.clickX}
                clickY={this.state.clickY}
                popupState={this.state.popupState}
                userId = {this.state.userId}
                closePopup = {this.closePopup}
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

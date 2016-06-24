import React, { PropTypes } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import '../../../browser/css/popup.css';

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    this.renderCollections = this.renderCollections.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      collections: []
    };
  }
  componentWillMount() {
    this.props.fetchCollections();
  }
  componentWillUpdate(nextProps, nextState) {
    let self = this;
    if (nextProps.userId != "" && nextProps.userId != this.props.userId) {
      self.state.collections = [];
      this.props.collections.forEach(function(collection) {
        if (self.refs[collection]) {
            $(self.refs[collection]).prop('checked', false)
        }
      });
      console.log('whats the next props? ', nextProps.userId);
      this.props.fetchUser(nextProps).then(function(response) {
        response.payload.data.collections.forEach(function(collection) {
          $(self.refs[collection]).prop('checked', true)
          self.state.collections.push(collection);
        })
      });

    }
  }
  renderCollections() {
    let self = this;
    return this.props.collections.map(function(collection, idx) {
      return(
        <div key={idx} className="form-group">
          <div className="checkbox">
           <label>
             <input type="checkbox" type='checkbox' name={collection} key={idx}
               value={collection} ref={collection} /> {collection}
           </label>
          </div>
        </div>
      )
    });
  }
  handleClick(e) {
    let current = e.currentTarget;
    if (e.currentTarget.getAttribute('checked')) {
      e.currentTarget.setAttribute('checked', true)
    } else {
      e.currentTarget.setAttribute('checked', false)
    }
  }
  submitForm() {
    let array = [];
    let payload = {};
    for (var key in this.refs) {
      if ($(this.refs[key]).is(':checked')) {
         array.push(this.refs[key].value);
      }
    }
    payload.collections = array;
    var userId = this.props.userId
    this.props.updateUser(userId, payload);
    this.props.closePopup();
  }
  renderInput() {
    if (!this.props.clickTarget) {
      return;
    }
      return (
        <form onSubmit={this.submitForm}>
          {this.renderCollections()}
          <div className="btn btn-primary" type="submit" onClick={this.submitForm}>Save</div>
        </form>
      )
  }
  render () {
    let style = {
      left: this.props.clickX-70,
      top: this.props.clickY-100,
      position: 'absolute',
      backgroundColor: 'white',
      border: "2px solid black"
    };

    return(
      <div className={"panel panel-default popup " + this.props.popupState} style={style}>
        <div className="panel-heading">
          <div className="panel-title"><strong>Collections</strong></div>
        </div>
        <div className="panel-body">
          {this.renderInput()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
      collections: state.collections,
      user: state.user
  }
}

module.exports = connect(mapStateToProps, actions)(Popup);

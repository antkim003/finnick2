import React, { PropTypes } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import '../../../browser/css/popup.css';

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    this.renderCheckboxes = this.renderCheckboxes.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.state = {
      collections: [],
      username: null
    };
  }
  componentWillMount() {
    // this.props.fetchCollections().then(this.props.fetchTypes());
    this.props.fetchCollections();
    this.props.fetchTypes();
  }
  componentWillUpdate(nextProps, nextState) {
    let self = this;
    if (nextProps.userId != "" && nextProps.userId != this.props.userId) {
      self.state.collections = [];
      self.props.collections.forEach(function(collection) {
        if (self.refs[collection]) {
            $(self.refs[collection]).prop('checked', false)
        }
      });
      self.props.fetchUser(nextProps).then(function(response) {
        response.payload.data.collections.forEach(function(collection) {
          $(self.refs[collection]).prop('checked', true)
          self.state.collections.push(collection);
        });
        $(self.refs[response.payload.data.type]).prop('checked',true)
      });

    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.username != nextProps.userName) {
      this.setState({
        username: this.props.userName
      })
    }
  }
  renderCheckboxes(property) {
    let self = this;

    switch (property) {
      case "type":
        return this.props[property].map(function(type, idx) {
          if (type != "select") {
            return(
              <div key={idx} className="form-group">
                <div className="radio">
                 <label>
                   <input type="radio" name="type" key={idx}
                     value={type} ref={type} /> {type}
                 </label>
                </div>
              </div>
            )
          }
        });
        break;
      case "collections":
        return this.props[property].map(function(collection, idx) {
          return(
            <div key={idx} className="form-group">
              <div className="checkbox">
               <label>
                 <input type="checkbox" name={collection} key={idx}
                   value={collection} ref={collection} /> {collection}
               </label>
              </div>
            </div>
          )
        });
        break;
      case "username":
        return(
          <div className="form-group">
            <input type="text" ref="username" onChange={this.changeUsername} value={this.state.username} />
          </div>
        )
        break;
      default:

    }

  }
  changeUsername() {
    this.setState({
      username: this.refs.username.value
    })
  }
  closeOverlay() {
    this.props.closePopup();
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
    if (this.refs.username) {
      payload['username'] = this.refs.username.value
    } else {
      payload[this.props.property] = array;
    }

    var userId = this.props.userId;
    this.props.updateUser(userId, payload);
    this.props.closePopup();
  }
  renderInput() {
    if (!this.props.clickTarget) {
      return;
    }
    const popupContentBodyStyle = {
      maxHeight: '400px',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '210px'
    };

    // TODO make an all encompassing overlay come out here

    return (
      <form onSubmit={this.submitForm}>
        <div className="popup-content_body" style={popupContentBodyStyle}>
            {this.renderCheckboxes(this.props.property)}
        </div>
        <div className="btn btn-primary" type="submit" onClick={this.submitForm}>Save</div>
      </form>
    )
  }
  render () {
    let popupStyle = {
      left: this.props.clickX-70,
      top: this.props.clickY-100,
      position: 'absolute',
      backgroundColor: 'white',
      border: "2px solid black",
      zIndex: 1000
    };

    return(
      <div>
        <div onClick={this.closeOverlay} className={`js-popup-overlay popup-overlay ${this.props.popupState}`} style={{position: 'fixed', 'left': 0, 'right': 0, 'top': 0, 'bottom': 0, 'zIndex': 10}} ></div>

        <div className={`panel panel-default popup ${this.props.popupState}`} style={popupStyle}>
          <div className="panel-heading">
            <div className="panel-title"><strong>{this.props.userName ? 'Username' : 'Collections'}</strong></div>
          </div>
          <div className="panel-body">
            {this.renderInput()}
          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
      collections: state.collections,
      user: state.user,
      type: state.types
  }
}

module.exports = connect(mapStateToProps, actions)(Popup);

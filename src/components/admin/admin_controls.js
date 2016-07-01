import React, { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Button, Modal, FormGroup, ControlLabel, FormControl, Popover, Tooltip, HelpBlock } from 'react-bootstrap';


class AdminControls extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.save = this.save.bind(this);
    this.updatenow = this.updatenow.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.resetState = this.resetState.bind(this);
    this.resetState();
  }
  componentWillMount() {
    this.resetState()
  }
  resetState() {
    this.setState(
      {
        showModal: false,
        email: {
          value: "",
          error: "",
          dirty: false
        },
        name: {
          value: "",
          error: "",
          dirty: false
        },
        usertype: {
          value: "",
          error: "",
          dirty: false
        },
        password: {
          value: "",
          error: "",
          dirty: false
        },
        lead: {
          value: "",
          error: "",
          dirty: false
        },
        collects: {
          value: "",
          error: "",
          dirty: false
        },
        locked: {
          value: "",
          error: "",
          dirty: false
        },
        clean: true
      }
    )
  }
  close() {
    this.resetState();
  }
  open() {
    this.setState({
      showModal: true,
      clean: true
    });
  }
  save() {
    var self = this;
    if (this.state.clean) {
      this.state.clean = false;
      this.updatenow('reset');
      return;
    }
    const errors = Object.keys(this.state).reduce(function(previous, current) {
      if ((self.state[current].error || 0 != self.state[current].error) && typeof self.state[current].error != "undefined") {
        previous.push(self.state[current].error);
      }
      return previous;
    }, []);

    if (errors.length > 0) {
      console.error('there ware errors on the page');
      return false;
    } else {
      let payload = Object.keys(this.state).reduce(function(previous, current) {
        if ((self.state[current] || 0 != self.state[current].value) && typeof self.state[current].value != "undefined") {
          previous[current] = self.state[current].value;
        }
        return previous;
      }, {})
      this.props.addUser(payload);
      this.close();
    }
  }
  getValidationState(input_name, validation_type) {
    if (!this.state.clean && this.state[input_name].dirty) {
      if (validation_type === "required") {
        if (this.state[input_name].value.length > 1) {
          this.state[input_name].error = "";
          return 'success';
        }
        if (this.state[input_name].value.length === 0) {
          this.state[input_name].error = "This field is required.";
          return "error";
        }
      }
      if (validation_type === "selected") {
        if (this.state[input_name].value === "select") {
          this.state[input_name].error = "Please select something in this dropdown.";
          return "error";
        }
      }
    }
  }
  updatenow(event) {
    let self = this;
    if (event != "reset") {
      let type = event.currentTarget.getAttribute('data-ref');
      let obj = {}
      obj[type] = {
        value: event.currentTarget.value,
        dirty: true
      };
      this.setState(obj);
    } else {
      this.setState(
      {
        email: {
          dirty: true,
          value: self.refs.email.value
        },
        name: {
          dirty: true,
          value: self.refs.name.value
        },
        usertype: {
          dirty: true,
          value: self.refs.usertype.value
        },
        lead: {
          dirty: true,
          value: self.refs.lead.value
        },
        password: {
          dirty: true,
          value: self.refs.password.value
        },
        collects: {
          dirty: true,
          value: self.refs.collects.value
        },
        locked: {
          dirty: true,
          value: self.refs.locked.value
        }
      });
    }
  }
  renderOptions(array) {
    try {
      return array.map(function(n) {
        return (<option value={n}>{n}</option>)
      });
    } catch (e) {
      return []
    }
  }
  render() {
    return (
      <div>
        <div style={{marginBottom: "10px", marginTop: "10px"}}>
          <Button
            bsStyle="primary"
            onClick={this.open}
          >
            Create a user
          </Button>
        </div>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Create a user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup validationState={this.getValidationState('name','required')} controlId="formControlsText">
                <ControlLabel>Name</ControlLabel>
                <input onChange={this.updatenow} ref="name" data-ref="name" type="text" placeholder="Enter text" className="form-control" id="formControlsText"></input>
                <HelpBlock>{this.state.name.error}</HelpBlock>
              </FormGroup>
              <FormGroup validationState={this.getValidationState('email','required')} controlId="formControlsEmail">
                <ControlLabel>Email address</ControlLabel>
                <input onChange={this.updatenow} ref="email" data-ref="email" type="email" placeholder="Enter Email" className="form-control" id="formControlsEmail"></input>
                <HelpBlock>{this.state.email.error}</HelpBlock>
              </FormGroup>
              <FormGroup validationState={this.getValidationState('password','required')} controlId="formControlsPassword">
                <ControlLabel>Password</ControlLabel>
                <input onChange={this.updatenow} ref="password" data-ref="password" type="password" placeholder="Enter Password" className="form-control" id="formControlsPassword"></input>
                <HelpBlock>{this.state.password.error}</HelpBlock>
              </FormGroup>
              <FormGroup validationState={this.getValidationState('usertype','selected')} controlId="formControlsUserType">
                <ControlLabel>User Type</ControlLabel>
                <select onChange={this.updatenow} ref="usertype" data-ref="usertype" placeholder="select" id="formControlsUserType" className="form-control">
                    <option value="select">select</option>
                    {this.renderOptions(this.props.type)}
                </select>
                <HelpBlock>{this.state.usertype.error}</HelpBlock>
              </FormGroup>
              <FormGroup validationState={this.getValidationState('collects','selected')} controlId="formControlsCollections">
                <ControlLabel>Collections</ControlLabel>
                <select onChange={this.updatenow} ref="collects" data-ref="collects" placeholder="select" id="formControlsCollections" className="form-control">
                    <option value="select">select</option>
                    {this.renderOptions(this.props.collections)}
                </select>
                <HelpBlock>{this.state.collects.error}</HelpBlock>
              </FormGroup>

              <FormGroup controlId="formControlsLead">
                <ControlLabel>Lead</ControlLabel>
                <select ref="lead" data-ref="lead" placeholder="select" id="formControlsLead" className="form-control" value="false">
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </FormGroup>

              <FormGroup controlId="formControlsLocked">
                <ControlLabel>Locked</ControlLabel>
                <select ref="locked" data-ref="locked" placeholder="select" id="formControlsLocked" className="form-control" value="false">
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.save}>save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    collections: state.collections,
    type: state.types
  };
}

export default connect(mapStateToProps, actions)(AdminControls);

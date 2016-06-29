import React, { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Button, Modal, FormGroup, ControlLabel, FormControl, Popover, Tooltip } from 'react-bootstrap';


class AdminControls extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.save = this.save.bind(this);
    this.updatenow = this.updatenow.bind(this);
    this.state = {
      showModal: false
    };
  }
  close() {
    this.setState({ showModal: false });
  }
  open() {
    this.setState({ showModal: true });
  }
  save() {
    this.props.addUser(this.state);
    this.close();
  }
  updatenow() {
    var self = this;
    this.setState({
      email: self.refs.email.value,
      name: self.refs.name.value,
      type: self.refs.usertype.value,
      lead: self.refs.lead.value,
      locked: self.refs.locked.value
    });
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
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onChange={this.updatenow}>
              <FormGroup controlId="formControlsText">
                <ControlLabel>Name</ControlLabel>
                <input ref="name" type="text" placeholder="Enter text" className="form-control" id="formControlsText"></input>
              </FormGroup>
              <FormGroup controlId="formControlsEmail">
                <ControlLabel>Email address</ControlLabel>
                <input ref="email" type="email" placeholder="Enter Email" className="form-control" id="formControlsEmail"></input>
              </FormGroup>
              <FormGroup controlId="formControlsPassword">
                <ControlLabel>Password</ControlLabel>
                <input ref="password" type="password" placeholder="Enter Password" className="form-control" id="formControlsPassword"></input>
              </FormGroup>
              <FormGroup controlId="formControlsUserType">
                <ControlLabel>User Type</ControlLabel>
                <select ref="usertype" placeholder="select" id="formControlsUserType" className="form-control">
                    <option value="select">select</option>
                    {this.renderOptions(this.props.type)}
                </select>
              </FormGroup>
              <FormGroup controlId="formControlsCollections">
                <ControlLabel>Collections</ControlLabel>
                <select ref="collections" placeholder="select" id="formControlsCollections" className="form-control">
                    <option value="select">select</option>
                    {this.renderOptions(this.props.collections)}
                </select>
              </FormGroup>

              <FormGroup controlId="formControlsLead">
                <ControlLabel>Lead</ControlLabel>
                <select ref="lead" placeholder="select" id="formControlsLead" className="form-control" value="false">
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </FormGroup>

              <FormGroup controlId="formControlsLocked">
                <ControlLabel>Locked</ControlLabel>
                <select ref="locked" placeholder="select" id="formControlsLocked" className="form-control" value="false">
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

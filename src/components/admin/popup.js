import React, { PropTypes } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import '../../../browser/css/popup.css';

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    this.renderCollections = this.renderCollections.bind(this);
  }
  componentWillMount() {
    this.props.fetchCollections();
  }
  renderCollections() {
    console.log('heres the collections ', this.props.collections);
    return this.props.collections.map(function(collection) {
      return(
        <div key={collection}>
          {collection}
        </div>
      )
    });
  }
  renderLocked() {
    return(
      <div>
        THIS IS THE LOCKED OPTIONS
      </div>
    )
  }
  findValuesOfChecked() {

  }
  renderInput(clickTarget) {
    if (!this.props.clickTarget) {
      return;
    }
    console.log('whats the attribute?', this.props.clickTarget.className[this.props.clickTarget.className.length-1]);
    if (this.props.clickTarget.className[this.props.clickTarget.className.length-1] === "1") {
      return this.renderCollections();
    }
    if (this.props.clickTarget.className[this.props.clickTarget.className.length-1] === "2") {
      return this.renderLocked();
    }
  }
  render () {
    let style = {
      left: this.props.clickX,
      top: this.props.clickY,
      position: 'absolute'
    };

    return(
      <div className={"popup " + this.props.popupState} style={style}>
        <div className="row">
          <div className="col-lg-6">
            {this.renderInput()}
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
      collections: state.collections
  }
}

module.exports = connect(mapStateToProps, actions)(Popup);

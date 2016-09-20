import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import tilestyle from '../../browser/css/homepagepreview.css';

var HomepageComponent = require('../../browser/homepage/homepage.js');

class HomepagePreview extends Component {
  componentWillMount() {

  }

  render () {
    return (
      <div className="home">
          <div className="container">
            <h1>Homepage Preview</h1>
            <div>
                <HomepageComponent />
            </div>
          </div>

      </div>
    )

  }
}

module.exports = HomepagePreview;

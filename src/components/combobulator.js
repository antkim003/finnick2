import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import tilestyle from '../../browser/css/tile.css';

var Tiles = require('../../browser/preview.js');

class Combobulator extends Component {
  render () {
    console.log(this.props.session, this.props.authenticated);

    return (
      <div className="home">
          <link type="text/css" rel="stylesheet" href="//fast.fonts.net/cssapi/e5d7b59e-410f-491f-a487-9b1b2af511f7.css"/>
          <div className="container">
            <h1>Preview all FOB tiles</h1>
              <Tiles/>
          </div>
      </div>

    )

  }
}
module.exports = Combobulator;

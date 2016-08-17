import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import tilestyle from '../../browser/css/tile.css';

var Tiles = require('../../browser/preview.js');

class Combobulator extends Component {
  render () {
    console.log(this.props.session, this.props.authenticated);

    return (
      <div className="home">
          <div className="container">
            <h1>Combobulator</h1>
              <Tiles/>
          </div>
      </div>

    )

  }
}
module.exports = Combobulator;

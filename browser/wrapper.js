import React from 'react';
import { Component } from 'react';
import NavBar from '../src/containers/navbar';

export default class Wrapper extends Component {

  render() {
    let style = {
      paddingTop: 51
    };
    return (
      <div>
        <NavBar />
        <main style={style}>
          {this.props.children}
        </main>
      </div>
    );
  }
}

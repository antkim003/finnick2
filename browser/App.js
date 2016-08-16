'use strict';
var React = require('react');

var Fork = require('react-ghfork');

var FullTable = require('./full_table.js');
var ScopeTable = require('./scope_table.js');

// var readme = require('../README.md');

import pure from 'purecss/build/pure.css';
import highlight from 'highlight.js/styles/github.css';
import reactpage from 'react-pagify/style.css';
import main from './css/main.css';
import skylight from './css/skylight.css';
// import admin from './css/admin.css';
import { connect } from 'react-redux';
import * as actions from '../src/actions';

var App = React.createClass({
    displayName: 'App',
    render() {
        return (
            <div className='pure-g'>
                <article className='pure-u-1'>
                    <section className='demonstration'>
                        <FullTable session={this.props.session} />
                    </section>
                </article>
            </div>
            );
        }
});

function mapStateToProps(state) {
  return {
    session: state.session
  }
}

module.exports = connect(mapStateToProps, actions)(App);

'use strict';
var React = require('react');

var Fork = require('react-ghfork');

var FullTable = require('./full_table.js');

// var readme = require('../README.md');

import pure from 'purecss/build/pure.css';
import highlight from 'highlight.js/styles/github.css';
import reactpage from 'react-pagify/style.css';
import main from './css/main.css';
import skylight from './css/skylight.css';


module.exports = React.createClass({
    displayName: 'App',
    componentDidMount: function() {
    },
    render() {
//    <header className='pure-u-1'>
//        <h1>Finnick 2.0</h1>
//    </header>
        return (
            <div className='pure-g'>

                <article className='pure-u-1'>
                    <section className='demonstration'>
                        <FullTable />
                    </section>

                </article>
            </div>
            );
        }
});

'use strict';

var React = require('react');
var Fork = require('react-ghfork');

var FullTable = require('./full_table.js');
var EditorsTable = require('./editors_table.js');
var NestedTable = require('./nested_table.js');

var readme = require('../README.md');


module.exports = React.createClass({
    displayName: 'App',
    componentDidMount: function() {
        function loadScript() {
//            var script= document.createElement('script');
//            script.type= 'text/javascript';
//            script.src= './socket.js';
//            script.async = true;
//            document.body.appendChild(script);
        }
        loadScript();
//        window.socket;


//        window.socket = io.connect('http://localhost:8080');

//        <section className='editors'>
//            <div className='description'>
//                <h2>Editors</h2>
//
//                <p>The table below contains some sample editors you can use. It is possible to develop your own editors as long as you follow the same interface (`value`, `onValue` props).</p>
//            </div>
//
//            <EditorsTable />
//        </section>
//        <section>
//        <div className='description'>
//            <h2>Nested table</h2>
//
//            <p>The table below contains some nested data.</p>
//        </div>
//
//        <NestedTable />
//        </section>
//            <section className='documentation'>
//                <h2>README</h2>
//
//                <div dangerouslySetInnerHTML={{__html: readme}}></div>
//            </section>
    },
    render() {
        return (

            <div className='pure-g'>
                <Fork className='right' project='bebraw/reactabular' />
                <header className='pure-u-1'>
                    <h1>Finnick 2.0</h1>

                    <div className='description'>Spectacular tables for React.js</div>
                </header>
                <article className='pure-u-1'>
                    <section className='demonstration'>


                        <FullTable />
                    </section>

                </article>
            </div>
        );
    },
});

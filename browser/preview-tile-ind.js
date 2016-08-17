'use strict';

var merge = require('lodash/merge');
var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var update = require('react/lib/update');
var TileIndCell = require('./preview-tile-ind-cell.js');

module.exports = React.createClass({
    displayName: 'TileInd',
    getDefaultProps() {
    return {
        data: [],
    };
},

render() {

    var data = this.props.data;
    var self = this;

    var props = update(this.props, {
        $merge: {
            data: undefined,
        }
    });
    var query = window.location.search.split('?')[1];


    return (
        <div {...props} className={Object.keys(data)}>
            <h2>{Object.keys(data)}</h2>
                     {data[Object.keys(data)].map((fob, i) => {
                         return <TileIndCell data={fob}/>
                        }
                     )}


                {this.props.children}
        </div>
        );
}
});

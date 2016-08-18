'use strict';

var merge = require('lodash/merge');
var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var update = require('react/lib/update');

module.exports = React.createClass({
    displayName: 'TileIndCell',
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
    var filteredname = _.filter(data.entries, function(d) { return d.hasOwnProperty('name') });
    var filteredcopy1 = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy1') });
    var filteredcopy2 = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy2') });
    var filteredcopy3 = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy3') });
    var filteredcopy4 = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy4') });

    return (
        <div {...props} className={'tile'}>

            {filteredname[0].name}
            {filteredname[0].tilecopy1}
            {filteredname[0].tilecopy2}
            {filteredname[0].tilecopy3}
            {filteredname[0].tilecopy4}

            {this.props.children}
        </div>
        );
}
});

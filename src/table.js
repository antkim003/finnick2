'use strict';

var merge = require('lodash/merge');
var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var update = require('react/lib/update');
var ColumnNames = require('./column_names');

module.exports = React.createClass({
    displayName: 'Table',

    propTypes: {
        columnNames: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.func
        ]),
        data: React.PropTypes.array,
        columns: React.PropTypes.array,
        row: React.PropTypes.func,
        children: React.PropTypes.object,
        rowKey: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            columnNames: {},
            data: [],
            columns: []
        };
    },

    render() {
        var columnNames = this.props.columnNames;
        var data = this.props.data;
        var columns = this.props.columns;
        var rowKey = this.props.rowKey;
        var rowProps = this.props.row || noop;

        var props = update(this.props, {
            $merge: {
                columnNames: undefined,
                data: undefined,
                columns: undefined
            }
        });

        return (
            <table {...props}>
                {isFunction(columnNames) ? columnNames(columns) : <thead><ColumnNames config={columnNames} columns={columns} /></thead>}
                <tbody>
                    {data.map((row, i) => <tr data-id={_.sortBy(window.data, 'index')[i]._id} key={(row[rowKey] || i) + '-row'} {...rowProps(row, i)}>{
                        columns.map((column, j) => {
                            var property = column.property;
                            var value = row[property];
                            var cell = column.cell || [id];
                            var content;

                            cell = isFunction(cell) ? [cell] : cell;

                            var tet = '';
                            content = reduce(cell, (v, fn) => {
                                if(React.isValidElement(v.value)) {
                                    return v;
                                }


                                var val = fn(v.value, data, i, property);
                                tet += v.value;
//                                tet += data.activeEdit;
                                tet += i;
                                tet += v;
//                                console.log(v)

                                if(!isPlainObject(val) || isUndefined(val.value)) {
                                    // formatter shortcut
                                    val = {value: val};
                                }

                                return {
                                    value: isUndefined(val.value) ? v.value : val.value,
                                    props: merge({}, v.props, val.props)
                                };
                            }, {value: value, props: {}});

                            content = content || {};
                            var values = {};

                            var rowid = parseInt(row.id-1);
                            var entryId = _.find(_.sortBy(window.data[row.id], 'index').entries, function(entry){
                                        if( entry.columnName == property) {
                                            return entry;
                                        }
                                    })
                            if (typeof entryId != 'undefined') {
                                entryId = entryId._id;
                            } else {
                                entryId = null;
                            }

                            return <td data-id={entryId} data-property={property} data-edit={column.cell.length == 0 ? 'noedit' : 'editor'} data-cell={rowid+'-'+property} data-active={content.props.activeEdit} className={'cell-'+j+' '+(row[rowKey] || i)+'-'+property+ ' '} key={j + '-cell'} {...content.props} >{content.value}</td>;
                        }
                    )}</tr>)}
                </tbody>
                {this.props.children}
            </table>
        );
    }
});

function id(a) {
    return a;
}
function noop() {}

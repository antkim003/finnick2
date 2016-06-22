'use strict';
var reduce = require('lodash/reduce');
var React = require('react');

module.exports = React.createClass({
    displayName: 'ColumnNames',

    propTypes: {
        config: React.PropTypes.object,
        columns: React.PropTypes.array
    },

    render() {
        const config = this.props.config;
        const columns = this.props.columns;

        return(
            <tr>
                {columns.map((column, i) => {
                    var columnHeader = reduce(config, (result, v, k) => {
                        result[k] = k.indexOf('on') === 0 ? v.bind(null, column) : v;

                        return result;
                    }, {});
                    var {className, ...props} = columnHeader;

                    // sort column - XXX: tidy up somehow, maybe
                    // there should be access to header specific classes?
                    className = className || '';
                    className += ' ' + column.headerClass;
                    var info = [];
                    if (column.info) {
                        info.push(<div className="info"><span className='info-icon'>i</span><i>{column.info}</i></div>)
                    }
                    return (
                        <th
                            key={i + '-header'}
                            className={className + (column.cell.length == 0 ? ' header-noedit' : ' header-editor')}
                            {...props}
                            data-edit={column.cell.length == 0 ? 'noedit' : 'editor'}
                        ><div>{column.header}
                                {info}
                    </div><div className="fixedHead">{column.header}
                            {info}
                    </div></th>
                    );
                })}
            </tr>
        );
    }
});

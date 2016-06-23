'use strict';

var _ = require('lodash');

var React = require('react');

module.exports = React.createClass({
    displayName: 'ColumnFilters',

    propTypes: {
        columns: React.PropTypes.array
    },

    // this is just an example of a possible custom header component...
    // inputs does nothing right now (but we can implement filtering or insertion here)
    /*                            {column.property ? <input className="header-input" placeholder={'Insert '+column.property} /> : ''}*/

/*
<tr>
                {columns.map((column, i) => {
                    return (
                        <td key={i + '-custom-header'}>
                        </td>
                        );
                    })}
</tr>*/

    render() {
        var numberstoletters =
        ['A','B','C', 'D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC'];

        const columns = this.props.columns;

        return(
            <tr className="column-letters">
            {columns.map((column, i) => {
                return (
                    <td key={i + '-custom-header'}>
                        {numberstoletters[column.columnorder]}
                    </td>
                    );
                })}
            </tr>
        );
    }

});

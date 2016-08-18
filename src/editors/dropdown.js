'use strict';

var React = require('react');

module.exports = (options, fields={}) => {
    const nameField = fields.name || 'name';
    const valueField = fields.value || 'value';

    return React.createClass({
        displayName: 'Dropdown',

        propTypes: {
//            value: React.PropTypes.string,
            onValue: React.PropTypes.func,
        },

        onEdit: function(e) {
            this.props.onValue(e.target.value);
        },

        render() {
            var self = this;
            setTimeout(function () {
                $("[rel='js-dropdown-field']").focus();
            }, 10);
            return (
                <select rel="js-dropdown-field" onBlur={this.onEdit} onChange={this.onEdit} value={this.props.value}>
                    <option key={'blank'} value=""></option>
                    {options.map((option, i) =>
                        <option
                            key={i}
                            value={option[valueField]}
                            >{option[nameField]}
                        </option>
                    )}
                </select>
            );
        }
    });
};

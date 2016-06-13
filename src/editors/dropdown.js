'use strict';

var React = require('react');

module.exports = (options, fields={}) => {
    const nameField = fields.name || 'name';
    const valueField = fields.value || 'value';

    return React.createClass({
        displayName: 'Dropdown',

        propTypes: {
            value: React.PropTypes.string,
            onValue: React.PropTypes.func,
        },

        render() {
            var self = this;
            const edit = (e) => {
            window.socket;
            this.props.onValue(e.target.value);
//            var soc = setInterval(function() {
//                if (typeof io != 'undefined') {
//                    window.socket = io.connect('http://localhost:3000');
//                    window.socket.on('my other event', function (data) {
//                        console.log(data, 'thadhafd');
//                    });
//                    window.socket.on('new message', function (data) {
//                        self.props.onValue(e.target.value);
//                    });
//                    clearInterval(soc);
//                } else {
//
//                }
//
//            },100);

        }

            return (
                <select onBlur={edit} onChange={edit} value={this.props.value}>
                    {options.map((option, i) =>
                        <option
                            key={i}
                            value={option[valueField]}
                        >{option[nameField]}</option>
                    )}
                </select>
            );
        }
    });
};

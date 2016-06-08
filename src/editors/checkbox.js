'use strict';

var React = require('react');


module.exports = (options, cat, fields={}) => {
    const nameField = fields.name || 'name';
    const valueField = fields.value || 'value';
    console.log(cat, options, 'in checkbox');
    return React.createClass({
        displayName: 'Checkbox',

        propTypes: {
//            value: React.PropTypes.string || React.PropTypes.array,
            onValue: React.PropTypes.func,
        },
        componentDidMount: function() {
            var self = this;
            window.socket;
            var soc = setInterval(function() {
                if (typeof io != 'undefined') {
                    window.socket = io.connect('http://localhost:3000');
                    window.socket.on('my other event', function (data) {
                        console.log(data, 'thadhafd');
                    });
                    window.socket.on('new message', function (data) {
                        self.props.onValue(data);
                    });
                    clearInterval(soc);
                } else {

                }
            },100);


        },
        render() {

            const edit = (e) =>
            {
                e.preventDefault();
                console.log(e.target.form, document.querySelectorAll('form'), window.row-1);
                var checkboxes = e.target.form.querySelectorAll('input');
                var checkboxesChecked = [];
                for (var i=0; i<checkboxes.length; i++) {
                    // And stick the checked ones onto an array...
                    if (checkboxes[i].checked) {
                        checkboxesChecked.push(checkboxes[i].value);
                    }
                }
                window.socket.emit('my other event', { val: checkboxesChecked, row: window.row-1 });
                this.props.onValue({ val: checkboxesChecked, row: window.row-1 });
            }

            return (
                <form>
                    {options.map((option, i) =>
                        <div><input type="checkbox"
                        key={i}
                        value={option[valueField]}
                        name="checkbox2"
                        /><label>{option[nameField]}</label></div>
                        )}
                    <button onClick={edit}>Save</button>
                </form>
            );
        }
    });
};

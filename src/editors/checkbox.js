'use strict';

var React = require('react');


module.exports = (options, fields={}) => {
    const nameField = fields.name || 'name';
    const valueField = fields.value || 'value';

    return React.createClass({
        displayName: 'Checkbox',

        propTypes: {
//            value: React.PropTypes.string || React.PropTypes.array,
            onValue: React.PropTypes.func,
        },
        componentDidMount: function() {
            var self = this;
            console.log(options);
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
//
        {
            e.preventDefault();
            console.log(e.target.form, document.querySelectorAll('form'), window.row);
            var checkboxes = e.target.form.querySelectorAll('input');
            var checkboxesChecked = [];
            for (var i=0; i<checkboxes.length; i++) {
                // And stick the checked ones onto an array...
                if (checkboxes[i].checked) {
                    checkboxesChecked.push(checkboxes[i].value);
                }
            }
//            if (typeof  window.socket != 'undefined') {
                window.socket.emit('my other event', { val: checkboxesChecked, row: window.row });
//            }

//            console.log('val ', checkboxesChecked)
            this.props.onValue({ val: checkboxesChecked, row: window.row });
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

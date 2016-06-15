'use strict';

var React = require('react');


module.exports = (options, cat, dat, fields={}) => {
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
//                window.socket.emit('my other event', { val: checkboxesChecked, row: window.row-1 });
                this.props.onValue({ val: checkboxesChecked, row: window.row-1 });
            }

            var filteredoptions = options;

            if (cat) {
                var cat1 = _.filter(dat.state.data, function (d) {
                    return d.rowIndex == window.row
                })[0][cat];

                if (typeof _.filter(filteredoptions, function (cat) { return cat.value == cat1})[0] !== 'undefined') {
                    filteredoptions = cat1 ? _.filter(options, function (cat) {
                        return cat.value == cat1
                    })[0].subcategories : options;
                } else {
                    filteredoptions = options;
                }
            }


            return (
                <form>
                    {filteredoptions.map((option, i) =>
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

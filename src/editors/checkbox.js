'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = (options, cat, dat, fields={}) => {
    const nameField = fields.name || 'name';
    const valueField = fields.value || 'value';
    var category;
    return React.createClass({
        displayName: 'Checkbox',
        propTypes: {
//            value: React.PropTypes.string || React.PropTypes.array,
            onValue: React.PropTypes.func,
        },
        componentWillMount: function() {
            if (cat) {
                var $currNodeRel = $(ReactDOM.findDOMNode(this)).parent().attr('rel');
                var rowNumber = $currNodeRel.split('-')[3];
                category = dat.state.data[rowNumber][cat];
            }
        },
        render() {

            const edit = (e) =>
            {
                e.preventDefault();
//                console.log(e.target.form, document.querySelectorAll('form'), window.row-1);
                var checkboxes = e.target.form.querySelectorAll('input');
                var checkboxesChecked = [];
                for (var i=0; i<checkboxes.length; i++) {
                    // And stick the checked ones onto an array...
                    if (checkboxes[i].checked) {
                        checkboxesChecked.push(checkboxes[i].value);
                    }
                }
//                window.socket.emit('my other event', { val: checkboxesChecked, row: window.row-1 });
                console.log(checkboxesChecked, '');
                this.props.onValue({ val: checkboxesChecked, row: window.row-1 });
            }

            var filteredoptions = options;
            if (category) {
                filteredoptions = _.find(options, {value: category})['subcategories'];
            }
            if (cat && !category) {
                return (
                    <form>
                        <div>
                            {`No ${cat} category selected.`}
                        </div>
                    </form>
                )
            }

            // if (cat) {
            //     var cat1 = _.filter(dat.state.data, function (d) {
            //         return d.rowIndex == window.row
            //     })[0][cat];
            //
            //     if (typeof _.filter(filteredoptions, function (cat) { return cat.value == cat1})[0] !== 'undefined') {
            //         filteredoptions = cat1 ? _.filter(options, function (cat) {
            //             return cat.value == cat1
            //         })[0].subcategories : options;
            //     } else {
            //         filteredoptions = options;
            //     }
            // }

            return (
                <form>
                    {filteredoptions.map((option, i) =>
                        <div key={`checkboxWrapper-${i}`} className="checkboxselect"><input type="checkbox"
                        key={"check-"+i}
                        value={option[valueField]}
                        name="checkbox2"
                        /><label key={`option-${i}`}>{option[nameField]}</label></div>
                        )}
                        <button onClick={edit}>Save</button>
                </form>
            );
        }
    });
};

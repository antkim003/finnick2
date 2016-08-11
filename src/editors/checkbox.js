'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = (allOptions, referenceColumn, dat, fields={}) => {
    const nameField = fields.name || 'name';
    const valueField = fields.value || 'value';
    var categories;
    return React.createClass({
        displayName: 'Checkbox',
        propTypes: {
            onValue: React.PropTypes.func,
        },
        componentWillMount: function() {
            if (referenceColumn) {
                var $currNodeRel = $(ReactDOM.findDOMNode(this)).parent().attr('rel');
                var rowNumber = $currNodeRel.split('-')[3];
                categories = dat.state.data[rowNumber][referenceColumn];
            }
        },
        render() {

            const edit = (e) =>
            {
                e.preventDefault();
                var checkboxes = e.target.form.querySelectorAll('input');
                var checkboxesChecked = [];
                for (var i=0; i<checkboxes.length; i++) {
                    // And stick the checked ones onto an array...
                    if (checkboxes[i].checked) {
                        checkboxesChecked.push(checkboxes[i].value);
                    }
                }
                this.props.onValue({ val: checkboxesChecked, row: window.row-1 });
            }

            var filteredSubcategories = allOptions;
            if (categories) {
                categories = Array.isArray(categories) ? categories : [categories];
                filteredSubcategories = categories.map(function(_category) {
                    let subcategories = _.find(allOptions, {value: _category})['subcategories'];
                    return subcategories;
                });
                filteredSubcategories = _.flatten(filteredSubcategories);
            }
            if (referenceColumn && !categories) {
                return (
                    <form>
                        <div>
                            {`No ${referenceColumn} category selected.`}
                        </div>
                    </form>
                )
            }

            return (
                <form>
                    {filteredSubcategories.map((option, i) =>
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

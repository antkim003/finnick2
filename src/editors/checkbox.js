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

        handleSubmit: function(e) {
            e.preventDefault();
            e.stopPropagation();
            let checkboxes = $(e.target).find("[rel='js-checkbox']");
            let checkboxesChecked = checkboxes.map(function(idx,checkbox) {
                if (checkbox.checked) {
                    return checkbox.value;
                }
            });
            checkboxesChecked = Array.prototype.slice.call(checkboxesChecked);
            this.props.onValue({ val: checkboxesChecked, row: window.row-1 });
        },
        render() {
            var filteredSubcategories = allOptions;

            if (/intl/i.test(categories)) { // test to see if it is an international
                return (
                    <form>
                        <div>
                            {`No subcategories for ${categories}`}
                        </div>
                    </form>
                )
            }
            if (categories) {
                categories = Array.isArray(categories) ? categories : [categories];
                filteredSubcategories = categories.map(function(_category) {
                    if (!/intl/i.test(_category)) { // extra check here just in case
                        let subcategories = _.find(allOptions, {value: _category.toLowerCase()})['subcategories'];
                        return subcategories;
                    }
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
            // focus on the form
            setTimeout(function () {
                $("[rel='js-checkbox-form']").focus();
            }, 10);
            return (
                <form onSubmit={this.handleSubmit} rel="js-checkbox-form">
                    {filteredSubcategories.map((option, i) =>
                        <div key={`checkboxWrapper-${i}`} className="checkboxselect">
                            <input type="checkbox"
                                ref={`jsCheckbox`}
                                rel={`js-checkbox`}
                                id={option[valueField]}
                                key={"check-"+i}
                                value={option[valueField]}
                                name="checkbox2" />
                            <label htmlFor={option[valueField]} key={`option-${i}`}>{option[nameField]}</label>
                        </div>
                    )}
                        <input className="btn btn-sm" type="submit" />
                </form>
            );
        }
    });
};

'use strict';

var React = require('react');
var ReactDOM = require('react-dom')

module.exports = (attrs) => {
    attrs = attrs || {};

    return React.createClass({
        displayName: 'Input',

        propTypes: {
            value: React.PropTypes.string,
            onValue: React.PropTypes.func,
        },

        getInitialState() {
        return {
            value: this.props.value,
        };
    },

    render() {
        return (
            <input
            value={this.state.value}
            onFocus={this.onFocus}
            onChange={this.onChange}
            onKeyUp={this.keyUp}
            onBlur={this.done}
                    {...attrs} />
            );
    },

    onFocus(e) {
        this.moveCaretToEnd(e.target);
    },

    moveCaretToEnd(field) {
        const length = field.value.length;
        field.selectionStart = length;
        field.selectionEnd = length;
    },

    onChange(e) {

            this.setState({
                value: e.target.value,
            });


    },

    keyUp(e) {
        if(e.keyCode === 13) {
            this.done(e);
        }
    },

    done(e) {
        var r = /^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?\.[0-9]{1,2}$/;
        var test = r.test(e.target.value);
        var test2 = r.test(e.target.value.split('-')[0]) && r.test(e.target.value.split('-')[1])
        var val = '';
        if (test) {
            this.props.onValue(ReactDOM.findDOMNode(this).value)
//            this.props.onValue(this.getDOMNode().value);
        } else if (test2){
            this.props.onValue(ReactDOM.findDOMNode(this).value)
//            this.props.onValue(this.getDOMNode().value);
        } else {
            alert('not a value value, please add decimals e.g. $1,000.00');
        }
        if (attrs == 'sortnumber') {
            console.log('trigger sorting');
        }
    },
});
};

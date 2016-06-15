'use strict';

var React = require('react');
var ReactDOM = require('react-dom')


module.exports = (attrs) => {
    attrs = attrs || {};
    function identical(array) {
        for(var i = 0; i < array.length - 1; i++) {
            if(array[i] !== array[i+1]) {
                return false;
            }
        }
        return true;
    }
    return React.createClass({
        displayName: 'Input',

        propTypes: {
//            value: React.PropTypes.string,
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
            var self = this;
            if (typeof attrs[0] !== 'undefined') {
                var r = new RegExp(attrs[0].value);

                if (typeof attrs[0].multidelimeter !== 'undefined') {
                    var vals = e.target.value.split(attrs[0].multidelimeter);
                    var valid = [];
                    _.each(vals, function(val, i){
                        if (val != '') {
                            valid.push(r.test(val));
                        } else {
                            valid.push(false);
                        }
                    });

                    if (identical(valid)) {
                        self.props.onValue(ReactDOM.findDOMNode(self).value)
//                        self.props.onValue(self.getDOMNode().value);
                    } else {
                        alert(attrs[0].error);
                    }

                } else {
                    var test = r.test(e.target.value);
                    if (test) {
                        self.props.onValue(ReactDOM.findDOMNode(self).value)
//                        self.props.onValue(self.getDOMNode().value);
                    } else {
                        if (typeof attrs[0].error != 'undefined') {
                            alert(attrs[0].error);
                        } else {
                            alert('not valid');
                        }
                    }
                }

            } else {
                self.props.onValue(ReactDOM.findDOMNode(self).value)
//                self.props.onValue(self.getDOMNode().value);
            }

        },
    });
};

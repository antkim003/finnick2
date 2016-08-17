'use strict';

var React = require('react');
var ReactDOM = require('react-dom')


module.exports = (attrs) => {
    attrs = attrs || {};

    return React.createClass({
        displayName: 'Input',

        propTypes: {
            onValue: React.PropTypes.func,
        },

        getInitialState() {
            return {
                value: this.props.value,
            };
        },

        render() {
            setTimeout(function () {
                $("[rel='js-input-field']").focus();
            }, 10);
            return (
                <input
                    maxLength="75"
                    ref="jsInputField"
                    rel="js-input-field"
                    className="form-control"
                    style= {{
                        margin: 'auto',
                        height: '25px'
                    }}
                    value={this.state.value}
                    onFocus={this.onFocus}
                    onChange={this.onChange}
                    onKeyDown={this.keyDown}
                    onKeyUp = {this.keyDown}
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

        keyDown(e) {
            var ENTERKEY = 13,
                TABKEY = 9;
            if(e.keyCode === ENTERKEY || e.keyCode === TABKEY) {
                $(e.target).blur();
                this.gotoNextCell(e);
            }
        },
        gotoNextCell(e) {
            var currRel = $(e.target.parentElement).attr('rel');
            var brokenDown = currRel.split('-');
            brokenDown[2] = Number(brokenDown[2]);
            brokenDown[2]++;
            var nextCell = brokenDown.join('-');

            setTimeout(function () {
                $(`[rel='${nextCell}']`).click();
            }, 10);
        },
        done(e) {

            var self = this;
            function identical(array) {
                for (var i = 0; i < array.length - 1; i++) {
                    if (array[i] !== array[i + 1] && !array[i]) {
                        return false;
                    }
                }
                return true;
            }

            if (typeof attrs[0] !== 'undefined') {
                var r = new RegExp(attrs[0].value);
                if (typeof attrs[0].multidelimeter !== 'undefined') {
                    var vals = e.target.value.split(attrs[0].multidelimeter);
                    var valid = [];
                    _.each(vals, function (val, i) {
                        if (val != '') {
                            valid.push(r.test(val));
                        } else {
                            valid.push(false);
                        }
                    });

                    if (identical(valid) && valid[0]) {
                        self.props.onValue(ReactDOM.findDOMNode(self).value)
//                        myWindow.close();
                    } else {
                        alert(attrs[0].error);
//                        if (myWindow) {
//                            myWindow.close();
//                        }
//                                var myWindow = window.open("", "MsgWindow", "width=200,height=100");
//                                myWindow.document.write("<p>"+attrs[0].error+"</p>");
                    }

                } else {
                    var test = r.test(e.target.value);
                    if (test) {
                        self.props.onValue(ReactDOM.findDOMNode(self).value)
                    } else {
                        if (typeof attrs[0].error != 'undefined') {
                            alert(attrs[0].error);
//                                if (myWindow) {
//                                    myWindow.close();
//                                }
//                                var myWindow = window.open("", "MsgWindow", "width=200,height=100");
//                                myWindow.document.write("<p>"+attrs[0].error+"</p>");
                        } else {
//                                if (myWindow) {
//                                    myWindow.close();
//                                }
//                                var myWindow = window.open("", "MsgWindow", "width=200,height=100");
//                                myWindow.document.write("<p>not valid</p>");
                            alert('Not Valid!');
                        }
                    }
                }

            } else {
                self.props.onValue(ReactDOM.findDOMNode(self).value)
            }

        },
    });
};

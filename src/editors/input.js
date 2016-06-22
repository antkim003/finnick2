'use strict';

var React = require('react');
var ReactDOM = require('react-dom')


module.exports = (attrs) => {
    attrs = attrs || {};

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

//            console.log('input', attrs, this);
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
                $(e.target).blur();
//                e.preventDefault();
//                this.done(e);
            }
        },

        done(e) {
        var self = this;

//        var once =  _.once(function() {
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
                    console.log('! multi val')
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
                    console.log('! one val')
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
                console.log('! no validation')
                self.props.onValue(ReactDOM.findDOMNode(self).value)
            }
//        })
//        once();

        },
    });
};

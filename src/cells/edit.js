 'use strict';

var React = require('react');


module.exports = function(editProperty, onValue, o) {
    onValue = onValue || noop;

    var context = this;
    var editor = o.editor;

    return (value, data, rowIndex, property, d) => {
        var idx = rowIndex.toString() + '-' + property;
        var editedCell = context.state[editProperty];
        if(editedCell === idx) {
            return {
                value: React.createElement(editor, {
                    value: value,
                    onValue: (v) => {
                        var state = {};
                        state[editProperty] = null;
                        state['activeEdit'] = null;
                        context.setState(state);
                        var datrow = $('.'+editedCell).attr('data-cell');
                        var _id = $('.'+editedCell).attr('data-id');
                        var _pid = $('.'+editedCell).attr('data-parent-id');
//                        console.log( $('.'+editedCell), 'editedCell');
                        onValue(v, data, rowIndex, property, datrow, _id, _pid);
                    }
                }),
                props: {
                    activeEdit: true
                }
            };
        }

        if(editor) {
            return {
                value: value,
                props: {
                    onClick: (e, d) => {
                        var state = {};
                        state[editProperty] = idx;
                        context.setState(state);
                        window.user = _.extend(window.user, state);
                        window.socket.emit('user editing', {
                            user: window.user,
                            cell: e.currentTarget.outerHTML,
                            fob: window.location.search.split('?')[1]
                        })
                    },
                }
            };
        }

        return value;
    };
};

function noop() {}

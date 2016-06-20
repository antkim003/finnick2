 'use strict';

var React = require('react');


module.exports = function(editProperty, onValue, o) {
    onValue = onValue || noop;

    var context = this;
    var editor = o.editor;

    return (value, data, rowIndex, property) => {
        var idx = rowIndex.toString() + '-' + property;
        var editedCell = context.state[editProperty];
        if(editedCell === idx) {
            return {
                value: React.createElement(editor, {
                    value: value,
                    onValue: (v) => {
                        var state = {};

                        state[editProperty] = null;

                        context.setState(state);

                        onValue(v, data, rowIndex, property);
                    }
                }),
            };
        }

        if(editor) {
            return {
                value: value,
                props: {
                    onClick: () => {
                        var state = {};
                        state[editProperty] = idx;
                        context.setState(state);
                        window.user = _.extend(window.user, state);
//                        console.log(window.user, 'user fob, and row', state, $('.'+state.editedCell).attr('data-cell'))
                        $('.activeCell').removeClass('activeCell')
                        $('.'+state.editedCell).addClass('activeCell');
                        window.socket.emit('user editing', {user: window.user, cell: $('.'+state.editedCell).attr('data-cell'), fob: window.location.search.split('?')[1]})
                    },
                }
            };
        }

        return value;
    };
};

function noop() {}

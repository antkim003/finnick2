'use strict';

module.exports = [
    {
        value: '^[0-9]*$',
        name: 'numerical',
        error: 'not a valid number'
    },
    {
        value: '^[0-9]*$',
        name: 'multinumerical',
        error: 'one of numbers in list is not valid',
        multidelimeter: ','
    }
];

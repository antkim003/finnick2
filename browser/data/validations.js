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
    },
    {
        value: '^\\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?\\.[0-9]{1,2}$',
        name: 'currency',
        error: 'not a valid currency, please add decimals e.g. $1,000.00, $1000.00-$2000.00',
        multidelimeter: '-'
    },

];

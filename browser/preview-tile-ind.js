'use strict';

var merge = require('lodash/merge');
var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var update = require('react/lib/update');
var TileIndCell = require('./preview-tile-ind-cell.js');

module.exports = React.createClass({
    displayName: 'TileInd',
    getDefaultProps() {
    return {
        data: [],
    };
},

render() {

    var data = this.props.data;
    var self = this;

    var props = update(this.props, {
        $merge: {
            data: undefined,
        }
    });
    var query = window.location.search.split('?')[1];
    var mapnames = {
        'intlWomen' : "International Women",
        'IntlWomen' : "International Women",
        'intljuniors': "International Juniors",
        'intlforthehome': 'International For the Home',
        'intlkitchen&dining': 'International Kitchen and Dining',
        'intlbed&bath': 'International Bed and Bath',
        'intlluggage&accessories': 'International Luggage and Accessories',
        'handbags&accessories': 'Handbags and Accessories',
        'juniors': 'Juniors',
        'beauty': 'Beauty',
        'for_the_home': 'For the Home',
        'kitchen&dining': 'Kitchen and Dining',
        'bed&bath': 'Bed and Bath',
        'luggage&accessories': 'Luggage and Accessories',
        'furniture&mattresses': "Furniture and Mattresses",
        'intlmen': 'International Men',
        'intlkids': 'International Kids',
        'intlshoes': "International Shoes",
        "intljewelry&Watches": 'International Jewelry and Watches',
        "intlhandbags&Accessories": 'International Handbags and Accessories',
        'women': "Women",
        "men": "Men",
        "kids": "Kids",
        "shoes": 'Shoes',
        'jewelry&watches': 'Jewelry and Watches',
        'jewlery&watches': 'Jewelry and Watches'
    }

    return (
        <div {...props} className={Object.keys(data).toString().replace('&','and')+ ' sectionwrap'}>
            <h4>{mapnames[Object.keys(data)] || Object.keys(data)}</h4>
                     {data[Object.keys(data)].map((fob, i) => {
                         var filteredname = _.filter(fob.entries, function(d) { return d.hasOwnProperty('name') });

                         if(filteredname[0].name != 'null' && filteredname[0].name && filteredname[0].name != '') {
                            return <TileIndCell data={fob}/>
                         }
                        }
                     )}


                {this.props.children}
        </div>
        );
}
});

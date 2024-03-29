'use strict';

var merge = require('lodash/merge');
var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var update = require('react/lib/update');
var TileInd = require('./preview-tile-ind.js');

module.exports = React.createClass({
    displayName: 'TileGrid',
    getDefaultProps() {
    return {
        data: [],
        img: false
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
//    console.log(data);
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
        'jewlery&watches': 'Jewelry and Watches',
    }
    function display(e) {
        console.log('CHANGED', e.target.value)
        $('.'+e.target.value).show().siblings('.sectionwrap').hide();
    }
    return (
        <div {...props}>
                <select onChange={display.bind(this)}>
                    <option>select fob</option>
                   {data.map((fob, i) => {
                       return <option value={Object.keys(fob).toString().replace('&','and')}>{mapnames[Object.keys(fob)] || Object.keys(fob)}</option>
                        }
                    )}
                </select>
                {data.map((fob, i) => {
                    var sorted = {};
                    sorted[Object.keys(fob)] = _.sortBy(fob[Object.keys(fob)], function(e){
                        var t;
                        _.each(e.entries,function(el,i){
                            if (el.hasOwnProperty('sortnumber')) {t=i;}
                        })
                        return parseInt(e.entries[t].sortnumber);
                    })
                        return <TileInd data={sorted} img={this.props.img} currentFiles={this.props.currentFiles}/>
                    }
                )}
                {this.props.children}
        </div>
        );
}
});

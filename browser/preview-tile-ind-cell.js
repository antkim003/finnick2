'use strict';

var merge = require('lodash/merge');
var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var update = require('react/lib/update');

module.exports = React.createClass({
    displayName: 'TileIndCell',
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
    var filteredname = _.filter(data.entries, function(d) { return d.hasOwnProperty('name') });
    var filteredimage = _.filter(data.entries, function(d) { return d.hasOwnProperty('imageid') });
    var filteredcopy = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy1') });
    var filteredcopy2 = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy2') });
    var filteredcopy3 = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy3') });
    var filteredcopy4 = _.filter(data.entries, function(d) { return d.hasOwnProperty('tilecopy4') });


    var img = '';
    if (filteredimage) {
        img = '<img src="http://slimages.macys.com/is/image/MCY/products/6/optimized/'+filteredimage[0].imageid+'_fpx.tif?bgc=255,255,255&amp;wid=228&amp;qlt=90,0&amp;fmt=jpeg" className="tile-img"/>'
    }else {
        img = '<img src="/'+filteredname[0].arimageid+'.jpeg" className="tile-img"/>'
    }
//    <img src="http://slimages.macys.com/is/image/MCY/products/6/optimized/3149862_fpx.tif?bgc=255,255,255&amp;wid=228&amp;qlt=90,0&amp;fmt=jpeg" className="tile-img"/>
    function createMarkup() { return {__html: img}; };
    return (
        <div {...props} className={'tile'}>
            <div className="tile-img-wrap">
                <a href="" className="tile-img-link">
                    <div dangerouslySetInnerHTML={createMarkup()} />
                </a>
            </div>
            <div className="tile-content">
                <span className="tile-title_1 tile-title">{filteredname[0].name}</span>
                <span className="tile-title_2 tile-title">{filteredcopy[0].tilecopy1}</span>
                <p className="tile-desc">
                    <span className="tile-desc-line_1 tile-desc-line">{filteredcopy2[0].tilecopy2}</span>
                    <span className="tile-desc-line_2 tile-desc-line">{filteredcopy3[0].tilecopy3}</span>
                    <span className="tile-desc-line tile-desc-line_3">{filteredcopy4[0].tilecopy4}</span>
                </p>
                <div className="tile-btns">
                    <a href="/#/some-link-here-to-add-to-your-list" className="tile-btn_add tile-btn tile-btn_addToList">ADD TO LIST</a>
                    <a href="#" className="tile-btn_added tile-btn">ADDED</a>
                    <a href="/#/some-link-here-to-add-to-shop-now" className="tile-btn_shop tile-btn">SHOP NOW</a>
                </div>
            </div>
            <div className="imageinfo">Image ID: {filteredname[0].imageid || filteredname[0].arimageid} <br/>Row: {filteredname[0].index}</div>

            {this.props.children}
        </div>
        );
}
});

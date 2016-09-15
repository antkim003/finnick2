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
    var query = window.location.search.split('?')[1];
    var entries = data.entries;
    var filteredcategory = _.filter(entries, function(d) { return d.hasOwnProperty('category') });
    var filteredimage = _.filter(entries, function(d) { return d.hasOwnProperty('imageid') });
    var filteredarimage = _.filter(entries, function(d) { return d.hasOwnProperty('arimageid') });
    var filtertileimage = _.filter(entries, function(d) { return d.hasOwnProperty('tileimage') });
    var tileimagear = filtertileimage[0].tileimage || this.props.img ? filtertileimage[0].tileimage : filteredarimage[0].arimageid;
    var tileimage = filtertileimage[0].tileimage || this.props.img ? filtertileimage[0].tileimage : filteredimage[0].imageid;

    var filteredcopy = _.filter(entries, function(d) { return d.hasOwnProperty('tilecopy1') });
    var filteredcopy2 = _.filter(entries, function(d) { return d.hasOwnProperty('tilecopy2') });
    var filteredcopy3 = _.filter(entries, function(d) { return d.hasOwnProperty('tilecopy3') });
    var filteredcopy4 = _.filter(entries, function(d) { return d.hasOwnProperty('tilecopy4') });
    var filteredsortn = _.filter(entries, function(d) { return d.hasOwnProperty('sortnumber') });
    var filteredid = _.filter(entries, function(d) { return d.hasOwnProperty('id') });
    var filteredpetites = _.filter(entries, function(d) { return d.hasOwnProperty('alsoinpetites') });
    var tilestyle = _.filter(entries, function(d) { return d.hasOwnProperty('tilestyle') });
    var filteredfob = _.filter(entries, function(d) { return d.hasOwnProperty('category') });

    var instorespecial = _.filter(entries, function(d) { return d.hasOwnProperty('instorespecial') });


    var alsoinpetite = '';
    if (filteredpetites[0] ? filteredpetites[0].alsoinpetites : '') {
        alsoinpetite = "also in petite"
    }

    var img = '';
    if (filteredimage[0].imageid) {
        img = '<img src="http://slimages.macys.com/is/image/MCY/products/6/optimized/'+tileimage+'_fpx.tif?bgc=255,255,255&amp;wid=228&amp;qlt=90,0&amp;fmt=jpeg" className="tile-img"/>'
    }else {
        img = '<img src="http://storage.googleapis.com/imp-projects/finnick/arimages/'+tileimagear+'.jpg" class="tile-img"/>'
    }
    var tileclass = 'tile-title_1 tile-title';
    if( tilestyle[0].tilestyle == 2 || tilestyle[0].tilestyle == 4 ) {
        tileclass = 'tile-title_1 tile-title narrow';
    }

    var tilecop1 = filteredcopy[0].tilecopy1 ? filteredcopy[0].tilecopy1.split('|').map(function(item) {return (<div>{item}</div>)}) : filteredcopy[0].tilecopy1;

    var pretext = '';
    if ( tilestyle[0].tilestyle == 4 ) {
        pretext = filteredcategory[0].category
    }

    function createMarkup(html) { return {__html: html}; };
    return (
        <div {...props} className={'tile'}>
            <div className="tile-img-wrap">
                <div dangerouslySetInnerHTML={createMarkup(img)} />
            </div>
            <div className="tile-content">

                <div className="pretext" dangerouslySetInnerHTML={createMarkup(pretext)} />
                <span className={tileclass}>{tilestyle[0].tilestyle == 1 ? 'DOORBUSTER' : tilecop1}</span>
                <span className="tile-title_2 tile-title">{filteredcopy2[0].tilecopy2 ? filteredcopy2[0].tilecopy2.split('|').map(function(item) {return (<div>{item}</div>)}) : filteredcopy2[0].tilecopy2}</span>
                <p className="tile-desc">
                    <span className="tile-desc-line_1 tile-desc-line">{filteredcopy3[0].tilecopy3 ? filteredcopy3[0].tilecopy3.split('|').map(function(item) {return (<span className="clearspan">{item}</span>)}) : filteredcopy3[0].tilecopy3}</span>
                    <span className="tile-desc-line_2 tile-desc-line">{filteredcopy4[0].tilecopy4 ? filteredcopy4[0].tilecopy4.split('|').map(function(item) {return (<span className="clearspan">{item}</span>)}) : filteredcopy4[0].tilecopy4}</span>
                    <span className="tile-desc-line tile-desc-line_3">{filteredpetites[0] ? alsoinpetite : ''}</span>
                </p>
                <div className="tile-btns">
                </div>
            </div>

            <div className="imageinfo">
                <div className="imageinfo-hover">i</div>
                <div className="imageinfo-hidden">
                    {filteredimage[0].imageid ? '' : 'AR '}Image ID: {filteredimage[0].imageid || filteredarimage[0].arimageid} <br/>
                    Row: {filteredid[0].id} <br/>
                    Sort: {filteredsortn[0].sortnumber} <br/>
                    Style: {tilestyle[0].tilestyle}<br/>
                    In Store: {instorespecial[0] ? instorespecial[0].instorespecial : ''}<br/>
                    orig FOB: {filteredfob[0] ? filteredfob[0].category : ''}

                </div>
            </div>
            {this.props.children}
        </div>
        );
}
});

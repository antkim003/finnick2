'use strict';

var merge = require('lodash/merge');
var reduce = require('lodash/reduce');
var isFunction = require('lodash/isFunction');
var isPlainObject = require('lodash/isPlainObject');
var isUndefined = require('lodash/isUndefined');

var React = require('react');
var update = require('react/lib/update');

module.exports = React.createClass({
    displayName: 'TileSingle',
    getDefaultProps() {
        return {
            data: [],
        };
    },
getInitialState: function() {
    return {
        data: []
    }
},

render() {

    var data = this.props.data;
    var self = this;

    var props = update(this.props, {
        $merge: {
            data: undefined,
        }
    });

    function gettile(e) {
        e.preventDefault();
        setTimeout(function(){
            console.log(self.state.formfob, self.state.formrow);
            $.ajax({
                url: '/api/cells/'+self.state.formfob+'/'+self.state.formrow,
                type: 'GET',
                success: function(data) {
                    console.log(data);
                    self.setState({
                        data: data
                    })
                }
            })
        }, 100)
    }
    function setfob(e) {
        self.setState({
            formfob: e.currentTarget.value
        })
    }
    function setrow(e) {
        self.setState({
            formrow: e.currentTarget.value
        })
    }

    var img = '';
    if (this.state.data.imageid != null && this.state.data.imageid != "") {
        img = '<img src="http://slimages.macys.com/is/image/MCY/products/6/optimized/'+this.state.data.imageid+'_fpx.tif?bgc=255,255,255&amp;wid=228&amp;qlt=90,0&amp;fmt=jpeg" className="tile-img"/>'
    } else if (this.state.data.arimageid != null) {
        img = '<img src="http://storage.googleapis.com/imp-projects/finnick/arimages/'+this.state.data.arimageid+'.jpg" class="tile-img"/>'

    }

    function createMarkup() { return {__html: img}; };

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
        <div {...props}>
                <form id="test" onSubmit={gettile}>
                    <select onChange={setfob}>
                        <option>select fob</option>
                        <option value="women">women</option>
                        <option value="IntlWomen">International Women</option>
                        <option value="intljuniors">International Juniors</option>
                        <option value="intlforthehome">International For the Home</option>
                        <option value="intlkitchen&dining">International Kitchen and Dining</option>
                        <option value="intlbed&bath">International Bed and Bath</option>
                        <option value="intlluggage&accessories">International Luggage and Accessories</option>
                        <option value="handbags&accessories">Handbags and Accessories</option>
                        <option value="juniors">Juniors</option>
                        <option value="beauty">Beauty</option>
                        <option value="for_the_home">For the Home</option>
                        <option value="kitchen&dining">Kitchen and Dining</option>
                        <option value="bed&bath">Bed and Bath</option>
                        <option value="luggage&accessories">Luggage and Accessories</option>
                        <option value="furniture&mattresses">Furniture and Mattress</option>
                        <option value="intlmen">International Men</option>
                        <option value="intlkids">International Kids</option>
                        <option value="intlshoes">International Shoes</option>
                        <option value="intljewelry&Watches">International Jewelry and Watches</option>
                        <option value="intlhandbags&Accessories">International Handbag and Accessories</option>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                        <option value="shoes">Shoes</option>
                        <option value="jewlery&watches">Jewelry and Watches</option>



                    </select>
                    <input className="tiletoshow" onChange={setrow} placeholder="row number"/>
                    <button type="submit">Submit</button>
                </form>



                <div className={'tile'}>
                    <div className="tile-img-wrap">
                        <div dangerouslySetInnerHTML={createMarkup()} />
                    </div>
                    <div className="tile-content">
                        <span className="tile-title_1 tile-title">{this.state.data.tilecopy1}</span>
                        <span className="tile-title_2 tile-title">{this.state.data.tilecopy2}</span>
                        <p className="tile-desc">
                            <span className="tile-desc-line_1 tile-desc-line">{this.state.data.tilecopy3}</span>
                            <span className="tile-desc-line_2 tile-desc-line">{this.state.data.tilecopy4}</span>
                            <span className="tile-desc-line tile-desc-line_3">{this.state.data.tilecopy4}</span>
                        </p>
                        <div className="tile-btns">
                        </div>
                    </div>
                    <div className="imageinfo">Image ID: {this.state.data.imageid || this.state.data.arimageid} <br/>Row: {this.state.data.id} <br/>Sort: {this.state.data.sortnumber}</div>

                </div>
                {this.props.children}
        </div>
        );
}
});

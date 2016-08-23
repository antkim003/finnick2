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

    return (
        <div {...props}>
                <form id="test" onSubmit={gettile}>
                    <select onChange={setfob}>
                        <option>select fob</option>
                        <option value="women">women</option>
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

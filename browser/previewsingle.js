var React = require('react');
var Tile = require('./previewsingle-tile.js');
import Loader from '../src/components/loader/loader.js';


var TileSingle = React.createClass({
    displayName: 'Tiles',
    getInitialState: function() {
        var self = this;
        var t;
        return {
            data: [],
            loaderState: false
        }
    },
    render(){
    var self = this;
        return (
            <div>
                <Tile data={self.state.data} />
            </div>
        )
    }
})

module.exports = TileSingle;

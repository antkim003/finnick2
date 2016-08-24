var React = require('react');
var Tile = require('./preview-tile.js');
import Loader from '../src/components/loader/loader.js';

var fobs = [];

var Tiles = React.createClass({
    displayName: 'Tiles',
    getInitialState: function() {
        var self = this;
//        var t;
        return {
            data: [],
            loaderState: true
        }
    },
    componentWillMount() {
        var self = this;
        var getdata = function(q) {
//            var fob = `/${query}`;
            $.ajax({
                type: "GET",
                url: '/api/rows/combobulator',
                success: function (datacomb) {
                    var t = datacomb;
                    self.setState({
                        data: t
                    });
                    self.setState({ loaderState: false });
                }
            })
        }
        getdata();
    },
    render(){
    var self = this;
        return (
            <div>

                {self.state.loaderState ? <Loader loaderMsg={'please be patient, creating all tiles for all FOB'} /> : null}

                <Tile data={self.state.data} />
            </div>
        )
    }
})

module.exports = Tiles;

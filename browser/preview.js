var React = require('react');
var Tile = require('./preview-tile.js');

var fobs = [];

var Tiles = React.createClass({
    displayName: 'Tiles',
    getInitialState: function() {
        var self = this;
        var t;
        var getdata = function(q) {
//            var fob = `/${query}`;
            $.ajax({
                type: "GET",
                url: '/api/rows/combobulator',
                success: function (datacomb) {
//                    console.log(datacomb, 'tests')
                    t = datacomb;
                    self.setState({
                        data: t
                    });
//                    console.log(self.state)
//                    fobs.push()
                }
            })
        }
        getdata();

        return {
            data: t
        }
    },
    render(){
    var self = this;
    console.log(self.state);
//    _.forEach(self.state['data'], function(d) {
//
//    });
//    <select>
//    {self.state.data.map((row, i) =>
//    <option>{Object.keys(row)}</option>
//    )}
//    </select>
        return (

            <div>tiles

                <Tile
                    data={self.state.data}
                    />
            </div>
        )
    }
})

module.exports = Tiles;

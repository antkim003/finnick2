var React = require('react');
var Tile = require('./preview-tile.js');
import Loader from '../src/components/loader/loader.js';

var fobs = [];

var Tiles = React.createClass({
    displayName: 'Tiles',
    getInitialState: function() {
        var self = this;

        return {
            data: [],
            loaderState: true,
            img: false
        }
    },
    componentWillMount() {
        var self = this;
        var d = new Date();

//        var getProductionVarPreview = function() {
//            $.ajax({
//                type: "GET",
//                url: '//storage.googleapis.com/imp-projects/finnick/previewvar.js?'+d.getTime(),
//                dataType: 'json',
//                success: function (datavar) {
//                    var t = datavar.onlytileimageload;
//                    self.setState({
//                        img: t
//                    });
//                },
//                error: function (req, status, err) {
//                    console.log('Something went wrong', status, err);
//                }
//            })
//        }
//        getProductionVarPreview();
        var getdata = function(q) {
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

                <Tile data={self.state.data} img={self.state.img}/>
            </div>
        )
    }
})

module.exports = Tiles;

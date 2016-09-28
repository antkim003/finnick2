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
            loaderState: false,
            currentFiles: []
        }
    },
    componentDidMount() {
        var self = this;
        $.ajax({
            url: 'http://storage.googleapis.com/imp-projects/finnick/json/bucketfiles.json',
            type: 'GET',
            dataType: 'JSONP',
            jsonpCallback: 'jsonbucket',
            success: function(bucketfiles) {
                self.setState({
                    currentFiles: bucketfiles
                });
            }
        })
    },
    render(){
    var self = this;
        return (
            <div>
                <Tile data={self.state.data} currentFiles={self.state.currentFiles}/>
            </div>
        )
    }
})

module.exports = TileSingle;

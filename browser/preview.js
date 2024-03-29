var React = require('react');
var Tile = require('./preview-tile.js');
import Loader from '../src/components/loader/loader.js';
var sockets = require('./sockets.js');
//var webshot = require('webshot');


var fobs = [];

var Tiles = React.createClass({
    displayName: 'Tiles',
    getInitialState: function() {
        var self = this;
        window.datlength = []
        window.dataset = [
            {"women": []},
            {"men": []},
            {"kids": []},
            {"shoes": []},
            {"jewlery&watches": []},
            {"handbags&accessories": []},
            {"juniors": []},
            {"beauty": []},
            {"for_the_home": []},
            {"kitchen&dining": []},
            {"bed&bath": []},
            {"luggage&accessories": []},
            {"furniture&mattresses": []},
            {"IntlWomen": []},
            {"intlmen": []},
            {"intlkids": []},
            {"intlshoes": []},
            {"intljewelry&Watches": []},
            {"intlhandbags&Accessories": []},
            {"intljuniors": []},
            {"intlforthehome": []},
            {"intlkitchen&dining": []},
            {"intlbed&bath": []},
            {"intlluggage&accessories": []}
        ];
        return {
            data: window.dataset,
            loaderState: true,
            img: false,
            dataset: [],
            currentFiles: []
        }
    },
    componentWillMount() {
        var self = this;
        var d = new Date();
        sockets();




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
    var mapnames = {
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
        'jewlery&watches': 'Jewelry and Watches',
    }



        var getdata = function(q) {
            $.ajax({
                type: "GET",
                url: '/api/rows/combobulator/'+q,
                success: function (datacomb) {
                    window.datlength.push(datacomb[0]);
//                    var t = window.dataset.filter(function( obj ) {
//                        return obj[Object.keys(datacomb[0])];
//                    });

//                    window.dataset.filter(function( obj ) {
//                        return obj[Object.keys(datacomb[0])];
//                    })[0][Object.keys(datacomb[0])].push(datacomb[0][Object.keys(datacomb[0])]);
//                    console.log(
                    window.dataset.filter(function( obj ) {
                        return obj[Object.keys(datacomb[0])];
                    })[0][Object.keys(datacomb[0])] =
                        window.dataset.filter(function( obj ) {
                        return obj[Object.keys(datacomb[0])];
                        })[0][Object.keys(datacomb[0])].concat(datacomb[0][Object.keys(datacomb[0])])
//                    );
//                    _.each(datacomb[0][Object.keys(datacomb[0])], function(row, i) {
//                            _.each(_.map(row.entries, 'doubleexposure'), function(val,i) {
//                                if (val) {
//                                    val = val.split(',')[0]
//                                    var result =  window.dataset.filter(function( obj ) {
//                                        return obj[val];
//                                    });
//                                    result = result[0][val].push(row);
//                                }
//                            })
//                            _.each(_.map(row.entries, 'doubleexposure2'), function(val,i) {
//                                if (val) {
//                                    val = val.split(',')[0]
//                                    var result =  window.dataset.filter(function( obj ) {
//                                        return obj[val];
//                                    });
//                                    result = result[0][val].push(row);
//                                }
//                            })
//                            _.each(_.map(row.entries, 'doubleexposure3'), function(val,i) {
//                                if (val) {
//                                    val = val.split(',')[0]
//                                    var result =  window.dataset.filter(function( obj ) {
//                                        return obj[val];
//                                    });
//                                    result = result[0][val].push(row);
//                                }
//                            })
//                    })




                    if (
                        window.datlength.length == Object.keys(mapnames).length
                    ) {
//                        console.log(window.dataset, 'last');
                        self.setState({
                            data: window.dataset
                        });
                        self.setState({ loaderState: false });
                    }
//                    self.setState({
//                        data: []
//                    });
                }
            })
        }
    _.each(mapnames, function(name, i) {
        getdata(i)
    })
//        var getdata1 = function(q) {
//            setTimeout(function(){
//                window.socket.emit('getcombo', []);
//            }, 1000)
//        }
//        getdata1();

    window.socket.on('donegetcombo', function (data) {
        self.setState({
            data: data
        });
        self.setState({ loaderState: false });
    });

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

                {self.state.loaderState ? <Loader loaderMsg={'please be patient, creating all tiles for all FOB'} /> : null}

                <Tile data={self.state.data} img={true} currentFiles={self.state.currentFiles}/>
            </div>
        )
    }
})

module.exports = Tiles;

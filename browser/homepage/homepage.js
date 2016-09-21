var React = require('react');
import Loader from '../../src/components/loader/loader.js';





var HomepageComponent = React.createClass({
    displayName: 'HomepageComponent',
    getInitialState: function() {
        var self = this;
        return {
            data: []
        }
    },

    componentDidMount() {
        var self = this;

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



    var content = 'test sdfsdfsfs sdf';
    var d = new Date;

        var template = '\
        <div id="header">\
            <h1><%= title %></h1>\
            <h2>Doorbusters</h2>\
            <hr class="clear"/>\
            <div class="info" id="online">\
                <h3>Shop Online All Day</h3>\
                <h4>Wed, Nov. 23</h4>\
                <h5>through Sat, Nov. 26</h5>\
            </div>\
            <div class="info" id="online">\
                <h3>Shop in stores</h3>\
                <h4>Starting 6pm thursday, Nov. 24</h4>\
                <h5>through Xpm Fri &amp; Xam-Xpm Sat Hours may vary by store.<br/><a href="http://www1.macys.com/shop/store/search" target="_blank">FIND A STORE</a></h5>\
            </div>\
        </div>\
        <div id="home-page">\
            <div id="tile-container">\
        <% _.each(rows, function(row, idx) { %> \
            <div class="tile home-tile" fob="<%=mapnames[row.entries[3]["doubleexposure"]]%>" tall="true">\
                <h6><%=mapnames[row.entries[3]["doubleexposure"]]%></h6>\
                <div class="image-wrap">\
                    <img class="product-image mobile-image" src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/uploads/<%=row.entries[3]["doubleexposure"]%>-mobile.jpg?<%=d%>"/>\
                    <img class="product-image desktop-image" src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/uploads/<%=row.entries[3]["doubleexposure"]%>.jpg?<%=d%>"/>\
                    <span class="share-pinterest"><img src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/images/mobile-icon-pinterest.png"/></span>\
                </div>\
                <div class="copy-wrap">\
                    <p class="line-1"><%=row.entries[30]["tilecopy1"]%></p>\
                    <p class="line-2"><%=row.entries[31]["tilecopy2"]%></p>\
                    <p class="line-3"><%=row.entries[32]["tilecopy3"]%></p>\
                    <p class="price"><%=row.entries[33]["tilecopy4"]%></p>\
                </div>\
            </div>\
        <% }) %>\
            </div>\
        </div>\
        ';




        $.ajax({
            type: "GET",
            url: '/api/rows/combobulator/' + 'homepage',
            success: function (data) {
                self.setState({
                    data: data[0]["homepage"]
                });
                window.testingdata = data[0]["homepage"];

                var filledoutrows = _.filter(self.state.data, function(row) {
//                    console.log(row.entries[3])
                    return row.entries[3]['doubleexposure'] != ''
                });

                setTimeout(function() {
                    $('iframeforhome').trigger('resize');
                })

                var templateCompile = _.template(template)({
                    c: content,
                    title: "Black&nbsp;Friday",
                    rows: filledoutrows,
                    mapnames: mapnames,
                    d: d.getTime()
                });

                var newcontent = $("<div></div>").html(templateCompile).html();






                var iframe = document.createElement('iframe');
                iframe.className = "iframeforhome";
                iframe.id = 'iframeforhome';
                document.getElementById('contain').appendChild(iframe);
                iframe.src = 'javascript:void((function(){var script = document.createElement(\'script\');' +
                    'script.innerHTML = "(function() {' +
                    'document.open();document.domain=\'' + document.domain +
                    '\';document.close();})();";' +
                    'document.write("<head>" + script.outerHTML + "</head><body></body>");})())';
                iframe.contentWindow.document.write(
                        '<link rel="stylesheet" type="text/css" href="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/styles.' +
                        'css"/>'+
                        '<link rel="stylesheet" type="text/css" href="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/styles2.css"/>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/jQuery.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/imagesloaded.pkgd.min.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/isotope.pkgd.min.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/fit-columns.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/scripts.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/scripts2.js"></sc'+'ript>'+
                        '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">'+
                        '<script>setTimeout(function() {$(window).trigger("resize");}, 3000)</script>'+
                        '<div id="countdown">'+
                        'Starts Wednesday &mdash; only <span class="countdown-cell">00</span> days left!'+
                        '</div>'+



                            newcontent



                );
            }
        });




    },

    render(){



    var self = this;
    return (
        <div className="homeContainer">
            <div id="contain"></div>
        </div>
        )
    }
})

module.exports = HomepageComponent;

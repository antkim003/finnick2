var React = require('react');
import Loader from '../../src/components/loader/loader.js';
//var Script = require('../../browser/homepage/jQuery.js');

//var Script3 = require('../../browser/homepage/isotope.pkgd.min.js');
//var Script4 = require('../../browser/homepage/imagesloaded.pkgd.min.js');
//var Script5 = require('../../browser/homepage/fit-columns.js');
//var Script1 = require('../../browser/homepage/scripts.js');
//var Script2 = require('../../browser/homepage/scripts2.js');

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

        var content = 'test sdfsdfsfs sdf';


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
            <div class="tile home-tile" fob="<%=row.fob%>" tall="true">\
                <%=row.fob%>\
                <h6>Women</h6>\
                <div class="image-wrap">\
                    <img class="product-image mobile-image" src="images/mobile-women.jpg"/>\
                    <img class="product-image desktop-image" src="images/desktop-women.jpg"/>\
                    <span class="share-pinterest"><img src="images/mobile-icon-pinterest.png"/></span>\
                </div>\
                <div class="copy-wrap">\
                    <p class="line-1">Doorbuster</p>\
                    <p class="line-2">60%&nbsp;off</p>\
                    <p class="line-3">Select&nbsp;Women\'s&nbsp;Coats</p>\
                    <p class="price">Reg.&nbsp;$160-$400</p>\
                </div>\
            </div>\
        <% }) %>\
            </div>\
        </div>\
        \
        \
        \
        <div>\
             <span><%= c %></span>\
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



                var templateCompile = _.template(template)({
                    c: content,
                    title: "Black&nbsp;Friday",
                    rows: data[0]["homepage"]
                });

                var newcontent = $("<div></div>").html(templateCompile).html();






                var iframe = document.createElement('iframe');
                iframe.className = "iframeforhome";
                document.getElementById('contain').appendChild(iframe);
                iframe.src = 'javascript:void((function(){var script = document.createElement(\'script\');' +
                    'script.innerHTML = "(function() {' +
                    'document.open();document.domain=\'' + document.domain +
                    '\';document.close();})();";' +
                    'document.write("<head>" + script.outerHTML + "</head><body></body>");})())';
                iframe.contentWindow.document.write(
                        '<link rel="stylesheet" type="text/css" href="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/styles.css"/>'+
                        '<link rel="stylesheet" type="text/css" href="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/styles2.css"/>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/jQuery.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/imagesloaded.pkgd.min.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/isotope.pkgd.min.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/fit-columns.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/scripts.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/scripts2.js"></sc'+'ript>'+


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

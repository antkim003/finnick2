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



    var content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt purus et lorem egestas, non dictum eros molestie. Morbi ligula sem, pulvinar vitae magna sit amet, porttitor convallis purus. Donec laoreet vel ligula vitae faucibus. Nam sollicitudin pharetra viverra. Nunc congue commodo mauris id suscipit. Morbi nulla dolor, rhoncus non rutrum vel, pellentesque quis nunc. Morbi sit amet tristique purus.\
\
    Cras accumsan felis ac sem interdum, id tempus est varius. Vestibulum sodales mi elit, vel feugiat nisl eleifend nec. Mauris sed justo non eros dictum viverra. Quisque efficitur molestie sem eu tristique. Ut vestibulum diam tellus, sed rutrum mauris pulvinar in. Phasellus in nisl sed quam aliquet molestie eu vel ligula. Phasellus vestibulum orci a ligula finibus, id semper dolor ultricies. Integer scelerisque posuere augue, quis imperdiet nulla egestas id. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus eget diam in ligula bibendum porta ut a enim.\
\
        Pellentesque dapibus diam et dignissim congue. Curabitur malesuada euismod finibus. Vestibulum malesuada dignissim risus, eget volutpat arcu ultrices at. Vivamus ultricies nibh ut dolor finibus tincidunt. Maecenas scelerisque, sem et imperdiet euismod, dolor diam suscipit purus, nec elementum nunc lacus eu dolor. Praesent id vehicula lectus, tristique sollicitudin urna. Curabitur at blandit arcu. In egestas auctor turpis, sit amet congue quam tincidunt ac.\
\
        Pellentesque luctus urna et tellus accumsan, ac laoreet diam ornare. Ut tristique tempor arcu, a euismod nulla cursus eu. Nulla ut elit diam. Aliquam faucibus mollis orci ac bibendum. Sed lorem tortor, pharetra consectetur condimentum in, consequat ut felis. Donec diam dui, venenatis vel aliquet sit amet, tincidunt nec dui. Morbi leo felis, elementum in tincidunt nec, ultrices ac lacus. Vestibulum venenatis nisl non sagittis mollis. Integer nec hendrerit ligula. Pellentesque eget diam non est feugiat volutpat et sit amet leo. Quisque tempor at urna.';
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
            <% _.each(fob, function(rows, idx) { %> \
                <div order="<%=rows.order%>" class="tile home-tile style<%=rows.tile[0].entries[58]["tilestyle"]%>" fob="<%=rows.tile[0].entries[5]["doubleexposure"]%>" tall="<%=rows.tile[0].entries[14]["goingfast"]%>">\
                    <h6><%=mapnames[rows.fob]%></h6>\
                <% rows.tile.forEach(function(row, idx) { %> \
                    <div class="tile-wrap tile-wrap<%= row.entries[48]["sortnumber"] %> <%= row.entries[48]["sortnumber"] == "1" ? "active" : ""%>">\
                        <div class="image-wrap">\
                            <img class="product-image mobile-image mobile-image" src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/uploads/<%=row.entries[5]["doubleexposure"]%>-mobile<%=intl ? "-international" : ""%><%= row.entries[48]["sortnumber"] %>.jpg?<%=d%>"/>\
                            <img class="product-image desktop-image desktop-image1" src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/uploads/<%=row.entries[5]["doubleexposure"]%><%=intl ? "-international" : ""%><%= row.entries[48]["sortnumber"] %>.jpg?<%=d%>"/>\
                            \
                            <span class="share-pinterest"><img src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/images/mobile-icon-pinterest.png"/></span>\
                        </div>\
                        <% if (row.entries[58]["tilestyle"] == "2") { %>\
                            <div class="circle">\
                                <p class="line-1"><%=row.entries[53]["tilecopy1"]%></p>\
                                <p class="line-2"><%=row.entries[54]["tilecopy2"]%></p>\
                            </div>\
                        <% } %>\
                        <div class="copy-wrap <%= row.entries[48]["sortnumber"] %>">\
                            <p class="line-1"><%=row.entries[53]["tilecopy1"]%></p>\
                            <p class="line-2"><%=row.entries[54]["tilecopy2"]%></p>\
                            <p class="line-3"><%=row.entries[55]["tilecopy3"]%></p>\
                            <p class="price"><%=row.entries[56]["tilecopy4"]%></p>\
                        </div>\
                    </div>\
                <% }) %>\
                </div>\
            <% }) %>\
            </div>\
        </div>\
        <div id="copy"><%= c %></div>\
        ';


//        $(document).on({
//            'click': function(ev) {
//                alert('test');
//                var thisact = $(ev.currentTarget).find('.active');
//                var nextClass = thisact.attr('class').split(' ')[thisact.attr('class').split(' ').length-1].split('tile-wrap')[1];
//                $('.'+nextClass).addClass('active');
//                thisact.addClass('deactivate').removeClass('active');
//            }
//        }, '.tile');

        $.ajax({
            type: "GET",
            url: '/api/rows/preview/homepage',
            success: function (data) {
                self.setState({
                    data: data[0]["homepage"]
                });
                window.testingdata = data[0]["homepage"];

                var filledoutrows = _.filter(self.state.data, function(row) {
                    return row.entries[5]['doubleexposure'] != ''
                });
                var group = _.groupBy(filledoutrows, function(row) {
                    return row.entries[5]['doubleexposure']
                });

                var sorted = [];
                var findfirst = _.find(group, function(tile) {

                });
                _.each(group, function(tile,i) {
                   var first = _.find(tile, function(t) {
                        return t.entries[30]['notesoncategory'] != '';
                   });
                    var tilesortnum = first.entries[30].notesoncategory;
//                    sorted[tilesortnum] = tile;
//                    sorted[i] =_.sortBy(tile, 'entries[48].sortnumber');
                    group[i] =_.sortBy(tile, 'entries[48].sortnumber');
//                    group['women'][4] = tilesortnum;
                })

                var sortobj = {};
                _.each(group, function(tile,i) {
                    var first = _.find(tile, function(t) {
                        return t.entries[30]['notesoncategory'] != '';
                    });
                    var tilesortnum = first.entries[30].notesoncategory;
                    var tilecat = first.entries[5].doubleexposure;
                    sortobj[tilecat] = tilesortnum;
                });
                var sortorder = [];
                _.each(sortobj, function(val, key) {
                    var obj = {};
                    obj['tile'] = group[key];
                    obj['order'] = parseInt(val);
                    obj['fob'] = key;
                    sorted.push(obj);
                    sortorder[val-1] = group[key]
                })
                var neworder = _.sortBy(sorted, 'order');
                console.log(sorted, neworder);

                setTimeout(function() {
                    $('#iframeforhome').addClass('resize');
                    $('#iframeforhome').trigger('resize');
//                    $('#iframeforhome').width('100%');
                },1000)

                setTimeout(function() {
                    $('#iframeforhome').trigger('resize');

//                    $('#iframeforhome').width('100%')
                },5000)

                setTimeout(function() {
                    $('#iframeforhome').trigger('resize');

//                    $('#iframeforhome').width('100%')
                },10000)

                setTimeout(function() {
                    $('#iframeforhome').trigger('resize');

//                    $('#iframeforhome').width('100%')
                },15000)

                var templateCompile = _.template(template)({
                    c: content,
                    title: "Black&nbsp;Friday",
                    fob: neworder,
                    mapnames: mapnames,
                    d: d.getTime(),
                    intl: window.location.search == '?intl'
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
                        '<link rel="stylesheet" type="text/css" href="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/previewstyles.' +
                        'css?t"/>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/jQuery.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/imagesloaded.pkgd.min.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/isotope.pkgd.min.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/fit-columns.js"></sc'+'ript>'+
                        '<script src="http://localhost:8080/macys-bf-flow/scripts.js"></sc'+'ript>'+
                        '<script src="http://storage.googleapis.com/imp-projects/finnick/homepagepreview/scripts2.js"></sc'+'ript>'+
                        '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">'+
                        '<script>setTimeout(function() {$(window).width("100%"); console.log("hi")}, 3000); setTimeout(function() {$(window).width("100%"); console.log("hi22")}, 15000)</script>'+
                        '<div id="countdown">'+
                        'Starts Wednesday &mdash; only <span class="countdown-cell">00</span> days left!'+
                        '</div>'+



                            newcontent



                );
            }
        });




    },

    render(){
    setTimeout(function() {
        $('#iframeforhome').trigger('resize');
        $('#iframeforhome').width('100%')

    },1000)

    setTimeout(function() {
        $('#iframeforhome').width('100%')
    },5000)

    setTimeout(function() {
        $('#iframeforhome').width('100%')
    },10000)

    setTimeout(function() {
        $('#iframeforhome').width('100%')
    },15000)


    var self = this;
    return (
        <div className="homeContainer">
            <div id="contain"></div>
        </div>
        )
    }
})

module.exports = HomepageComponent;

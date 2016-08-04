'use strict';
var cells = require('../../src/cells');
var editors = require('../../src/editors');
var Search = require('../../src/search');
var highlight = require('../../src/formatters/highlight');
var categoriesandsub = require('./categoriesandsub.js');
var categoriesandsub1 = categoriesandsub;
var categoriesandsub2 = categoriesandsub;
var categoriesandsub3 = categoriesandsub;
var categoriesandsub4 = categoriesandsub;
var categoriesandsub5 = categoriesandsub;
var categoriesandsub6 = categoriesandsub;
var validations = require('./validations.js');
var findIndex = require('lodash/findIndex');
var React = require('react');


module.exports = (app) => {
    var query = window.location.search.split('?')[1];

    app.highlighter = (column) => highlight((value) => {
        return Search.matches(column, value, app.state.search.query);
    });
    var data = [];


    app.editable = cells.edit.bind(app, 'editedCell', (value, celldata, rowIndex, property, datrow, _id, pid) => {
//    var self = this;
        clearInterval(window.datainterval);

        console.log('editable ', value, rowIndex, property, datrow, _id);
        var val = value.hasOwnProperty('row') ? value.val : value;
        var rowid = parseInt(datrow.split('-')[0])+1;
//            if ( val != undefined ) {
                if ( typeof val != 'undefined' && val == 'Custom' ) {
                    var customsave = (e) => {
                        val = e.target.previousSibling.value;
                        app.refs.modal.hide();
                        if (_id != undefined) {
                            var params = [{"_id":_id, "data": val}];
                            $.ajax({
                                'type': "PUT",
                                'url': '/api/cells/',
                                'data': JSON.stringify(params),
                                'contentType': "application/json",
                                'success': function() {
                                    console.log('done');
                                    window.socket.emit('my other event', { val: val, row: window.row-1 });
                                    window.datainterval;
                                    var idx = findIndex(app.state.data, {
                                        id: celldata[rowIndex].id,
                                    });
                                    app.state.data[idx][property] = val;
                                    app.setState({
                                        data: query ? _.filter(_.sortBy(statedata, 'rowIndex'), function(d) { return d.category == query}) : statedata
                                    });
                                    var scrollX = window.scrollX+1
                                    var scrollY = window.scrollY+1
                                    if ($('.demonstration').size() > 0) {
                                        window.scrollTo(scrollX,scrollY);
                                    }
                                }
                            })
                        } else {

                        }

                    }
                    app.setState(
                        {
                            modal: {
                                title: 'Custom '+property,
                                content: <div><input/><button onClick={customsave}>Save Custom</button></div>
                            }
                        });
                    app.refs.modal.show();
                }
//            }
             else {

//                var total = [];
//                console.log(pid, 'testing', pid == undefined)
                        if (_id != undefined) {
                            var params = [{"_id":_id, "data": val}];
                            $.ajax({
                                'type': "PUT",
                                'url': '/api/cells/',
                                'data': JSON.stringify(params),
                                'contentType': "application/json",
                                'success': function(data) {
                                    console.log('put data in here!!!!!!', data);
                                    window.socket.emit('my other event', data);
//                                    window.datainterval;
                                    var scrollX = window.scrollX+1;
                                    var scrollY = window.scrollY+1;
                                    if ($('.demonstration').size() > 0) {
                                        window.scrollTo(scrollX,scrollY);
                                    }
                                }
                            })
                        } else {
                                console.log('this cell doesnt exist, create a new one, norml')
                                var params = [{"data": val, 'fob': query, "row": datrow}];
                                $.ajax({
                                    'type': "POST",
                                    'url': '/api/cells/',
                                    'data': JSON.stringify(params),
                                    'contentType': "application/json",
                                    'success': function(data) {
                                        window.socket.emit('my other event', { val: val, row: window.row-1 });
//                                        window.datainterval;
                                        $('.'+datrow).attr('data-id', data[0]._id);
                                        var scrollX = window.scrollX+1;
                                        var scrollY = window.scrollY+1;
                                        if ($('.demonstration').size() > 0) {
                                            window.scrollTo(scrollX,scrollY);
                                        }
                                    }
                                })
                        }

                    var idx = findIndex(app.state.data, {
                        id: celldata[rowIndex].id,
                    });

                    app.state.data[idx][property] = val;
    //                console.log(app.state.data[idx])
                    app.setState({
                        data: query ? _.filter(_.sortBy(statedata, 'rowIndex'), function(d) { return d.category == query}) : statedata
                    });
                }


        var row = value.hasOwnProperty('row') ? value.row : rowIndex;

    });


window.coledit =     [
        {
            property: 'id',
            header: 'row id',
            cell: [(v) => ({
                value: v,
                props: { }
            })],
        columnorder: 0
},
{
    property: 'sortnumber',
    header: 'Sort Number',
    info: 'sorting by projected sales',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: 1
},
{
    property: 'name',
        header: 'Name',
    cell: [app.editable({
    editor: editors.input()}), app.highlighter('name')],
    columnorder: 2
},
{
    property: 'category',
        header: 'Category',
    cell: [ app.highlighter('category')],
    columnorder: 3
},
{
    property: 'subcategories',
        header: 'Subcategories',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub2, 'category', app)
}), app.highlighter('subcategories')],
    columnorder: 4
},
{
    property: 'notesoncategory',
    header: 'Notes on Category',
    info: 'any special callouts or exceptions',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: 5
},
{
    property: 'doubleexposure',
        header: 'Double Exposure',
    info: 'additional category/fob for product',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub)
}), app.highlighter('doubleexposure')],
    columnorder: 6
},
{
    property: 'doubleexposuresubcategory',
        header: 'Double Exposure Subcategory',
    info: 'subcategories specific to double exposed category',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub1, 'doubleexposure', app)
}), app.highlighter('doubleexposuresubcategory')],
    columnorder: 7
},
{
    property: 'doubleexposure2',
        header: 'Double Exposure 2',
    info: 'additional category/fob for product',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub3)
}), app.highlighter('doubleexposure2')],
    columnorder: 8
},
{
    property: 'doubleexposuresubcategory2',
        header: 'Double Exposure Subcategory 2',
    info: 'subcategories specific to double exposed category',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub, 'doubleexposure2', app)
}), app.highlighter('doubleexposuresubcategory2')],
    columnorder: 9
},
{
    property: 'doubleexposure3',
        header: 'Double Exposure 3',
    info: 'additional category/fob for product',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub)
}), app.highlighter('doubleexposure3')],
    columnorder: 10
},
{
    property: 'doubleexposuresubcategory3',
        header: 'Double Exposure Subcategory 3',
    info: 'subcategories specific to double exposed category',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub1, 'doubleexposure3', app)
}), app.highlighter('doubleexposuresubcategory3')],
    columnorder: 11
},
{
    property: 'pricingcategory',
        header: 'Pricing Category',
    cell: [app.editable({
    editor: editors.input()
}), app.highlighter('pricingcategory')],
    columnorder: 12
},
{
    property: 'instorespecial',
        header: 'In Store Special',
    cell: [app.editable({
    editor: editors.input(),
}), app.highlighter('instorespecial')],
    columnorder: 13
},
{
    property: 'storeregularprice',
    header: 'Store Reg Price (range)',
    info: 'range of prices, can be singular, must have .XX',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), app.highlighter('storeregularprice')],
    columnorder: 14
},
{
    property: 'storespecialprice',
    header: 'Store Special Price (range)',
    info: 'range of prices, can be singular, must have .XX',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), app.highlighter('storespecialprice')],
    columnorder: 15
},
{
    property: 'mcomspecial',
        header: 'MCOM Special',
    cell: [app.editable({
    editor: editors.input(),
}), app.highlighter('mcomspecial')],
    columnorder: 16
},
{
    property: 'pricinginfo',
    header: 'Additional Pricing Info',
    info: 'only at macys, not applicable, or custom pricing info (modal)',
    cell: [app.editable({
    editor: editors.dropdown([{name:'Only At Macys', value:'Only At Macys'},{name:'Not Applicable', value:'Not Applicable'},{name:'Custom', value:'Custom'}]),
}), app.highlighter('pricinginfo')],
    columnorder: 17
},
{
    property: 'mcomregprice',
    header: 'MCOM Reg Price',
    info: 'range of prices, can be singular, must have .XX',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    }), app.highlighter('mcomregprice')],
    columnorder: 18
},
{
    property: 'mcomspecialprice',
    header: 'MCOM Special Price (range)',
    info: 'range of prices, can be singular, must have .XX',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), app.highlighter('mcomspecialprice')],
    columnorder: 19
},
{
    property: 'pricingcomments',
    header: 'Pricing Comments',
    info: 'not congruent, congruent, all sizes, tv offer, GWP, 40%, 50%, 30%, or custom pricing (modal)',
    cell: [app.editable({
    editor: editors.dropdown([{name:'Not Congruent', value:'Not Congruent'},{name:'Congruent', value:'Congruent'},{name:'All Sizes', value:'All Sizes'},{name:'TV Offer', value:'TV Offer'},{name:'GWP', value:'GWP'},{name:'40% Off', value:'40% Off'},{name:'30% Off', value:'30% Off'},{name:'50% Off', value:'50% Off'},{name:'Custom', value:'Custom'}]),
}), app.highlighter('pricingcomments')],
    columnorder: 20
},
{
    property: 'markettointernational',
        header: 'Market to International',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    }), app.highlighter('markettointernational')],
    columnorder: 21
},
{
    property: 'projectedunits',
        header: 'Projected Units',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), app.highlighter('projectedunits')],
    columnorder: 22
},
{
    property: 'projectedsales',
    header: 'MCOM Projected Sales',
    cell: [app.editable({
    editor: editors.rangeinput('sortnumber'),
    }), app.highlighter('projectedsales')],
    columnorder: 23
},
{
    property: 'salesfor2015',
    header: 'Sales For 2015',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    }), app.highlighter('salesfor2015')],
    columnorder: 24
},
{
    property: 'imageid',
    header: 'Image Id',
    info: 'hover number to see image, image id is generated from ar id',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), app.highlighter('imageid')],
    columnorder: 25
},
{
    property: 'arimageid',
    header: 'AR Image Id',
    cell: [
    app.editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }),
    app.highlighter('arimageid')],
    columnorder: 26
},
{
    property: 'singleormultiple',
    header: 'Single or Multiple',
    cell: [app.editable({
    editor: editors.dropdown([{name: 'Single', value: 'Single'},{name: 'Multiple', value: 'Multiple'}]),
}), app.highlighter('singleormultiple')],
    columnorder: 27
},
{
    property: 'featureproductid',
    header: 'Feature Product Ids',
    info: 'product ids associated, comma delimited product id (11111, 22222, 33333)',
    cell: [
    app.editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'multinumerical'})),
    }),
    app.highlighter('featureproductid')],
    columnorder: 28
},
{
    property: 'savedsetid',
    header: 'Saved Set Ids',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
}), app.highlighter('savedsetid')],
    columnorder: 29
},
{
    property: 'tileimage',
    header: 'Tile Image',
    info: 'image used for product tile in sitelet',
    cell: [
    app.editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }),
    app.highlighter('tileimage'),
],
    columnorder: 30
},
{
    property: 'tilecopy1',
    header: 'Tile Copy Line 1',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('tilecopy1')],
    columnorder: 31
},
{
    property: 'tilecopy2',
        header: 'Tile Copy Line 2',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('tilecopy2')],
    columnorder: 32
},
{
    property: 'tilecopy3',
    header: 'Tile Copy Line 3',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('tilecopy3')],
    columnorder: 33
},
{
    property: 'tilecopy4',
    header: 'Tile Copy Line 4',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('tilecopy4')],
    columnorder: 34
},
{
    property: 'plenti',
    header: 'Plenti Watermark',
    info: 'whether or not to show watermark on tile in sitelet',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    }), app.highlighter('plenti')],
    columnorder: 35
},
{
    property: 'bffavorites',
    header: 'Black Friday Favorites',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    }), app.highlighter('bffavorites')   ],
    columnorder: 36
},
{
    property: 'goingfast',
    header: 'Going Fast',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    }), app.highlighter('goingfast')],
    columnorder: 37
},
{
    property: 'alsoinpetites',
    header: 'Also in Petites',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    }), app.highlighter('alsoinpetites')],
    columnorder: 38
},
{
    property: 'petitessavedset',
    header: 'Petites Saved Set',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), app.highlighter('petitessavedset')],
    columnorder: 39
},
{
    property: 'needsavedset',
    header: 'Need Saved Set?',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    }), app.highlighter('needsavedset')],
    columnorder: 40
},
{
    property: 'linktype',
    header: 'Link Type',
    info: 'link by category id, product id, or direct url',
    cell: [app.editable({
    editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
    }), app.highlighter('linktype')],
    columnorder: 41
},
{
    property: 'livedate',
    header: 'Live Date',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('livedate')],
    columnorder: 42
},
{
    property: 'categoryid',
    header: 'Category Id linking',
    info: 'if link type is category, category id here will be used, otherwise ignored',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), app.highlighter('categoryid')],
    columnorder: 43
},
{
    property: 'productid',
    header: 'Product Id linking',
    info: 'if link type is product, product id here will be used, otherwise ignored',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    })],
    columnorder: 44
},
{
    property: 'url',
    header: 'Url linking',
    info: 'if link type is url, url here will be used, otherwise ignored',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('url')],
    columnorder: 45
},
{
    property: 'petiteslinktype',
    header: 'Petites Link Type',
    info: 'if has petite, what link type; url, category id, or product id',
    cell: [app.editable({
    editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
    }), app.highlighter('petiteslinktype')],
    columnorder: 46
},
{
    property: 'petitescategoryid',
    header: 'Petites Category Linking',
    info: 'if petite link type is category, category id here will be used, otherwise ignored',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), app.highlighter('petitescategoryid')],
    columnorder: 47
},
{
    property: 'petitesproductid',
    header: 'Petites Product Linking',
    info: 'if petite link type is product, product id here will be used, otherwise ignored',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), app.highlighter('petitesproductid')],
    columnorder: 48
},
{
    property: 'petitesurl',
    header: 'Petites Url Linking',
    info: 'if petite link type is url, url here will be used, otherwise ignored',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('petitesurl')],
    columnorder: 49
},
{
    property: 'omniprojectedsales',
    header: 'Omni Projected Sales',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    }), app.highlighter('omniprojectedsales')],
    columnorder: 50
},
{
    property: 'extra',
    header: 'Extra',
    cell: [app.editable({
    editor: editors.input(),
    }), app.highlighter('Extra')],
    columnorder: 51
},
{
    property: 'killedrow',
    header: 'Killed Row',
    info: 'no deleted rows, keeping here for data fidelity',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    }), app.highlighter('killedrow')],
    columnorder: 52
},
{
    property: 'lockedrow',
        header: 'Locked Row',
    info: 'no deleted rows, keeping here for data fidelity',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
}), app.highlighter('lockedrow')],
    columnorder: 53
}
]




}

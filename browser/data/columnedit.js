'use strict';
var cells = require('../../src/cells');
var editors = require('../../src/editors');
var Search = require('../../src/search');
var highlight = require('../../src/formatters/highlight');
var categoriesandsub = require('./categoriesandsub.js');
var categoriesandsub1 = categoriesandsub;
var categoriesandsub2 = categoriesandsub;
var validations = require('./validations.js');
var findIndex = require('lodash/findIndex');
var React = require('react');


module.exports = (app) => {
    var query = window.location.search.split('?')[1];

    app.highlighter = (column) => highlight((value) => {
        return Search.matches(column, value, app.state.search.query);
    });
    var data = [];


    app.editable = cells.edit.bind(app, 'editedCell', (value, celldata, rowIndex, property, datrow) => {
//    var self = this;
        clearInterval(window.datainterval);

        console.log('editable ', value, rowIndex, property, datrow);
        var val = value.hasOwnProperty('row') ? value.val : value;
        var rowid = parseInt(datrow.split('-')[0])+1;

        if ( val.toLowerCase() == 'custom' ) {
            var customsave = (e) => {
                val = e.target.previousSibling.value;
                app.refs.modal.hide();
                _.each(window.data, function(data, i) {
                    if (typeof data.entries != 'undefined') {
                        var t = _.find(data.entries, function(d){ return d.columnName == property && d.rowIndex == rowid});
                        if (t != undefined) {
                            var params = [{"_id":t._id, "data": val}];
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
                                }
                            })
                        }
                    }
                })
            }
            app.setState(
                {
                    modal: {
                        title: 'Columns to Hide',
                        content: <div><input/><button onClick={customsave}>Save Custom</button></div>
                    }
                });
            app.refs.modal.show();
        } else {
            var idx = findIndex(app.state.data, {
                id: celldata[rowIndex].id,
            });

            app.state.data[idx][property] = val;
            app.setState({
                data: query ? _.filter(_.sortBy(statedata, 'rowIndex'), function(d) { return d.category == query}) : statedata
            });
            _.each(window.data, function(data, i) {
                if (typeof data.entries != 'undefined') {
                    var t = _.find(data.entries, function(d){ return d.columnName == property && d.rowIndex == rowid});
                    if (t != undefined) {
                        var params = [{"_id":t._id, "data": val}];
                        $.ajax({
                            'type': "PUT",
                            'url': '/api/cells/',
                            'data': JSON.stringify(params),
                            'contentType': "application/json",
                            'success': function() {
                                console.log('done');
                                window.socket.emit('my other event', { val: val, row: window.row-1 });
                                window.datainterval;

                            }
                        })
                    }
                }
            })
        }

//        _.each(window.data, function(data, i) {
//            if (typeof data.entries != 'undefined') {
//                var t = _.find(data.entries, function(d){ return d.columnName == property && d.rowIndex == rowid});
//                if (t != undefined) {
//                    var params = [{"_id":t._id, "data": val}];
//                    $.ajax({
//                        'type': "PUT",
//                        'url': '/api/cells/',
//                        'data': JSON.stringify(params),
//                        'contentType': "application/json",
//                        'success': function() {
//                            console.log('done');
//                            window.socket.emit('my other event', { val: val, row: window.row-1 });
//                            window.datainterval;
//
//                        }
//                    })
//                }
//            }
//        })


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
        columnorder: '0'
},
{
    property: 'sortnumber',
    header: 'Sort Number',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'name',
        header: 'Name',
    cell: [app.editable({
    editor: editors.input()}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'category',
        header: 'Category',
    cell: [ app.highlighter('category')],
    columnorder: '0'
},
{
    property: 'subcategories',
        header: 'Subcategories',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub2, 'category', app)
}), app.highlighter('subcategories')],
    columnorder: '0'
},
{
    property: 'notesoncategory',
        header: 'Notes on Category',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'doubleexposure',
        header: 'Double Exposure',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub)
}), app.highlighter('doubleexposure')],
    columnorder: '0'
},
{
    property: 'doubleexposuresubcategory',
        header: 'Double Exposure Subcategory',
    cell: [app.editable({
    editor: editors.checkbox(categoriesandsub1, 'doubleexposure', app)
}), app.highlighter('doubleexposuresubcategory')],
    columnorder: '0'
},
{
    property: 'pricingcategory',
        header: 'Pricing Category',
    cell: [app.editable({
    editor: editors.input()
}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'instorespecial',
        header: 'In Store Special',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'storeregularprice',
        header: 'Store Reg Price (range)',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), app.highlighter('storeregularprice')],
    columnorder: '0'
},
{
    property: 'storespecialprice',
        header: 'Store Special Price (range)',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'mcomspecial',
        header: 'MCOM Special',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'pricinginfo',
        header: 'Additional Pricing Info',
    cell: [app.editable({
    editor: editors.dropdown([{name:'Only At Macys', value:'Only At Macys'},{name:'Not Applicable', value:'Not Applicable'},{name:'Custom', value:'Custom'}]),
}), app.highlighter('pricinginfo')],
    columnorder: '0'
},
{
    property: 'mcomregprice',
        header: 'MCOM Reg Price (range)',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
})],
    columnorder: '0'
},
{
    property: 'mcomspecialprice',
        header: 'MCOM Special Price (range)',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'pricingcomments',
        header: 'Pricing Comments',
    cell: [app.editable({
    editor: editors.dropdown([{name:'Not Congruent', value:'Not Congruent'},{name:'Congruent', value:'Congruent'},{name:'All Sizes', value:'All Sizes'},{name:'TV Offer', value:'TV Offer'},{name:'GWP', value:'GWP'},{name:'40% Off', value:'40% Off'},{name:'30% Off', value:'30% Off'},{name:'50% Off', value:'50% Off'},{name:'Custom', value:'Custom'}]),
}), app.highlighter('pricingcomments')],
    columnorder: '0'
},
{
    property: 'markettointernational',
        header: 'Market to International',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'projectedunits',
        header: 'Projected Units',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'projectedsales',
        header: 'MCOM Projected Sales',
    cell: [app.editable({
    editor: editors.rangeinput('sortnumber'),
})],
    columnorder: '0'
},
{
    property: 'salesfor2015',
        header: 'Sales For 2015',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'imageid',
        header: 'Image Id',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
}), app.highlighter('imageid')],
    columnorder: '0'
},
{
    property: 'arimageid',
        header: 'AR Image Id',
    cell: [
    app.editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }),
    app.highlighter('arimageid')],
    columnorder: '0'
},
{
    property: 'singleormultiple',
        header: 'Single or Multiple',
    cell: [app.editable({
    editor: editors.dropdown([{name: 'Single', value: 'Single'},{name: 'Multiple', value: 'Multiple'}]),
}), app.highlighter('singleormultiple')],
    columnorder: '0'
},
{
    property: 'featureproductid',
        header: 'Feature Product Ids',
    cell: [
    app.editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'multinumerical'})),
    }),
    app.highlighter('featureproductid')],
    columnorder: '0'
},
{
    property: 'savedsetid',
        header: 'Saved Set Ids',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'tileimage',
        header: 'Tile Image',
    cell: [
    app.editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }),
    app.highlighter('tileimage'),
],
    columnorder: '0'
},
{
    property: 'tilecopy1',
        header: 'Tile Copy Line 1',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'tilecopy2',
        header: 'Tile Copy Line 2',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'tilecopy3',
        header: 'Tile Copy Line 3',
    cell: [app.editable({
    editor: editors.input(),
}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'tilecopy4',
        header: 'Tile Copy Line 4',
    cell: [app.editable({
    editor: editors.input(),
}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'plenti',
        header: 'Plenti Watermark',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'bffavorites',
        header: 'Black Friday Favorites',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'goingfast',
        header: 'Going Fast',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'alsoinpetites',
        header: 'Also in Petites',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'petitessavedset',
        header: 'Petites Saved Set',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'needsavedset',
        header: 'Need Saved Set?',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'linktype',
        header: 'Link Type',
    cell: [app.editable({
    editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
})],
    columnorder: '0'
},
{
    property: 'livedate',
        header: 'Live Date',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'categoryid',
        header: 'Category Id linking',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'productid',
        header: 'Product Id linking',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'url',
        header: 'Url linking',
    cell: [app.editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'petiteslinktype',
        header: 'Petites Link Type',
    cell: [app.editable({
    editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
})],
    columnorder: '0'
},
{
    property: 'petitescategoryid',
        header: 'Petites Category Linking',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
}), app.highlighter('petitescategoryid')],
    columnorder: '0'
},
{
    property: 'petitesproductid',
        header: 'Petites Product Linking',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
}), app.highlighter('petitesproductid')],
    columnorder: '0'
},
{
    property: 'petitesurl',
        header: 'Petites Url Linking',
    cell: [app.editable({
    editor: editors.input(),
}), app.highlighter('name')],
    columnorder: '0'
},
{
    property: 'omniprojectedsales',
        header: 'Omni Projected Sales',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
})],
    columnorder: '0'
},
{
    property: 'extraomniprojectedsales',
        header: 'Extra Omni Projected Sales',
    cell: [app.editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
})],
    columnorder: '0'
},
{
    property: 'killedrow',
        header: 'Killed Row',
    cell: [app.editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
}
]




}

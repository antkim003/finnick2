'use strict';

var React = require('react');
var Form = require('plexus-form');
var validate = require('plexus-validate');
var SkyLight = require('react-skylight').default;
var generators = require('annogenerate');
var math = require('annomath');
var Paginator = require('react-pagify').default;
var titleCase = require('title-case');
var findIndex = require('lodash/findIndex');
var orderBy = require('lodash/orderBy');
var cx = require('classnames');
var segmentize = require('segmentize');

var Table = require('../src/table');
var ColumnNames = require('../src/column_names');
var Search = require('../src/search');
var editors = require('../src/editors');
var sortColumn = require('../src/sort_column');
var cells = require('../src/cells');

var ColumnFilters = require('./column_filters.js');
var FieldWrapper = require('./field_wrapper.js');
var SectionWrapper = require('./section_wrapper.js');
var countries = require('./data/countries');
var generateData = require('./generate_data');
//var rowdata = require('./data/dummyrowdata.js');
var dummyusers = require('./data/dummyusers.js');
var categoriesandsub = require('./data/categoriesandsub.js');
var categoriesandsub1 = require('./data/categoriesandsub.js');
var categoriesandsub2 = require('./data/categoriesandsub.js');
var columns = require('./data/columnsschema.js');
var userpermissions = require('./data/userpermissions.js');
var validations = require('./data/validations.js');

var highlight = require('../src/formatters/highlight');

module.exports = React.createClass({
    displayName: 'FullTable',
    getInitialState: function(){
    var countryValues = countries.map((c) => c.value);
    var categoryValues = categoriesandsub.map((c) => c.value);

    var properties = augmentWithTitles({
            name: {
                type: 'string'
            },
            sortnumber: {
                type: 'number'
            },
            instore: {
                enum: countryValues,
        //                enumNames: countries.map((c) => c.name),
            },
            doubleexposure: {
                enum: categoryValues
            },
            doubleexposuresubcategory: {
                enum: categoryValues
            }

    });
//var data = generateData({
//    amount: 100,
//    fieldGenerators: getFieldGenerators(countryValues),
//    properties: properties,
//});

//        var users = dummyusers;
        var users = [
            {"name":"Jonathan Garza","email":"jgarza3@columbia.edu","type":"buyer","locked":false},
            {"name":"Jayne Smyth","email":"test@columbia.edu","type":"admin","locked":false}
        ]
        window.user = users[Math.floor(Math.random()*users.length)];
//        window.user = {"name":"Jonathan Garza","email":"jgarza3@columbia.edu","type":"buyer","locked":false};
        var data = [];

        var self = this;
        var query = window.location.search.split('?')[1];
//        console.log(allobj);
//

//        _.each(rowdata, function(row, j) {
//            var allobj = _.zipObject(_.map(columns, 'property'), _.range(columns.length).map(function () { return '' }));
//            rowdata[j] = _.extend(allobj,row);
//        })
//        var data =  rowdata;
//        self.setState({
//            data:data
//        });

        window.socket = io.connect();
//        var clients = io.sockets.ada();
//        console.log(clients, 'clients');
        var queryyes = query ? '/'+query : '';
        var getdata = function() {
            $.ajax({
                type: "GET",
                url: '/api/rows' + queryyes,
                success: function (data1) {
                    var allrows = _.map(data1, 'entries');
                    window.data = data1;
                    var arr = [];
                    _.each(allrows, function (row, i) {
                        //fill in empty subcategories
                        var allobj = _.zipObject(_.map(columns, 'property'), _.range(columns.length).map(function () {
                            return ''
                        }));
                        _.each(row, function (cell, j) {
                            var all = {};
                            if (cell.columnName != 'sortnumber' && cell.columnName != 'id') {
                                all[cell.columnName] = cell.data;
                            } else {
                                all[cell.columnName] = parseInt(cell.data);
                            }
                            all.rowIndex = parseInt(cell.rowIndex);
//                        all._id = cell._id;
                            _.extend(allobj, all)
                        });
                        arr.push(allobj);
                    });
//                data = query ? _.filter(_.sortBy(arr, 'rowIndex'), function(d) { return d.category == query}) : _.sortBy(arr, 'rowIndex');
                    data = _.sortBy(arr, 'rowIndex');
                    self.setState({
                        data: _.sortBy(arr, 'rowIndex')
//                    data:query ? _.filter(_.sortBy(arr, 'rowIndex'), function(d) { return d.category == query}) : _.sortBy(arr, 'rowIndex')
                    });

                },
                complete: function () {

                }
            })
        }
        var self = this;
        getdata();
        self.interval = setInterval(function() {
            getdata();
        }, 30000);
        self.interval;



        var lastScrollTop = 0;
        var lastScrollLeft = 0;


        var scrollFunc = function() {
            var st = $(window).scrollTop();
            var sl = $(window).scrollLeft();
            $('[data-property=id]').css(
                {
                    'margin-top': -$(window).scrollTop(),
                    'margin-left': '-1px'
                }
            );
            $('.fixedHead').css(
                {
                    'margin-left': -$(window).scrollLeft()-13,
                }
            );
            if ($('thead')[0].getBoundingClientRect().top < 0) {
                $('.fixedHead').css({'display':'block'})
            } else {
                $('.fixedHead').css({'display':'none' })
            }
            _.each($('.fixedHead'), function (fh, i) {
                var wid = i == 0 ? 5 : 6;
                $(fh).css({'width': $(fh).parent().width()+wid, 'height': $(fh).parent().height(), 'visibility':'visible'});
            });

            if (st > lastScrollTop){
                $('article.pure-u-1 .controls:first-child').css({'position':'relative','top': '0'})
                // downscroll code
            } else if ( st < lastScrollTop ){
                $('article.pure-u-1 .controls:first-child').css({'position':'relative','top': '0'})

            } else if (st == lastScrollTop) {
                if ($('h1')[0].getBoundingClientRect().right < 0 && $('thead')[0].getBoundingClientRect().top > 0) {
                    $('article.pure-u-1 .controls:first-child').css({'position': 'fixed', 'top': '0'})
                } else {
                    $('article.pure-u-1 .controls:first-child').css({'position':'relative','top': '0'})
                }
                //side scroll
                if (sl > lastScrollLeft) {
                } else {
                }
            }
            lastScrollTop = st;
            lastScrollLeft = sl;

        }


//fixed headers and rows
$(window).on('scroll', scrollFunc);

window.socket.emit('add user', window.user);
function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
        message += "there's 1 participant";
    } else {
        message += "there are " + data.numUsers + " participants";
    }
    console.log(message);
    window.allusers = data;
}
var connected = false;

window.socket.on('login', function (data) {
    connected = true;
    addParticipantsMessage(data);
});

var editable = cells.edit.bind(this, 'editedCell', (value, celldata, rowIndex, property) => {
//    var self = this;

    console.log('editable ', value, rowIndex, property);
    var val = value.hasOwnProperty('row') ? value.val : value;
        getdata();
    _.each(window.data, function(data, i) {
        if (typeof data.entries != 'undefined') {
            var t = _.find(data.entries, function(d){ return d.columnName == property && d.rowIndex == rowIndex+1});
            if (t != undefined) {
//              var cellid = t._id
//                var parentrowid = _.find(data, function(d) { return d.entries})
                var params = [{"_id":t._id, "data": val}];
                $.ajax({
                    'type': "PUT",
                    'url': '/api/cells/',
                    'data': JSON.stringify(params),
                    'contentType': "application/json",
                    'success': function() {
                        console.log('done');

                        window.socket.emit('my other event', { val: val, row: window.row-1 });

                    }
                })
            }
        }
    })

    var idx = findIndex(this.state.data, {
        id: celldata[rowIndex].id,
    });
    var row = value.hasOwnProperty('row') ? value.row : rowIndex;
//    var val = value.hasOwnProperty('row') ? value.val : value;
    this.state.data[row][property] = val;
    this.setState({
        data: query ? _.filter(_.sortBy(data, 'rowIndex'), function(d) { return d.category == query}) : data
    });
});

var formatters = {
        country: (country) => find(countries, 'value', country).name,
    };

var highlighter = (column) => highlight((value) => {
    return Search.matches(column, value, this.state.search.query);
});

//var self = this;
return {


    editedCell: null,
    data: data,
    formatters: formatters,
    search: {
        column: '',
        query: ''
    },
    header: {
        onClick: (column) => {
            // reset edits
            this.setState({
                editedCell: null
            });

            sortColumn(
                this.state.columns,
                column,
                this.setState.bind(this)
            );
        },
        className: cx(['header'])
    },
    sortingColumn: null, // reference to sorting column


columns: [
    {
        property: 'id',
        header: 'row id',
        cell: [(v) => ({
            value: v,
            props: {

            }
        })],
    columnorder: '0'
},
    {
        property: 'sortnumber',
        header: 'Sort Number',
        cell: [editable({
            editor: editors.input(),
        })],
        columnorder: '0'
    },
{
    property: 'name',
        header: 'Name',
    cell: [editable({
    editor: editors.input()}), highlighter('name')],
    columnorder: '0'
},
//{
//    property: 'country',
//        header: 'Country',
//    search: formatters.country,
//    cell: [editable({
//    editor: editors.checkbox(countries),
//}), formatters.country, highlighter('country')],
//    columnorder: '1'
//},
{
    property: 'category',
        header: 'Category',
    cell: [ highlighter('category')],
        columnorder: '0'
},
{
    property: 'subcategories',
        header: 'Subcategories',
    cell: [editable({
    editor: editors.checkbox(categoriesandsub2, 'category', self)
}), highlighter('subcategories')],
    columnorder: '0'
},
{
    property: 'notesoncategory',
    header: 'Notes on Category',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'doubleexposure',
    header: 'Double Exposure',
    cell: [editable({
        editor: editors.checkbox(categoriesandsub)
    }), highlighter('doubleexposure')],
    columnorder: '0'
},
{
    property: 'doubleexposuresubcategory',
    header: 'Double Exposure Subcategory',
    cell: [editable({
        editor: editors.checkbox(categoriesandsub1, 'doubleexposure', self)
    }), highlighter('doubleexposuresubcategory')],
    columnorder: '0'
},
{
    property: 'pricingcategory',
    header: 'Pricing Category',
    cell: [editable({
    editor: editors.input()
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'instorespecial',
    header: 'In Store Special',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'storeregularprice',
    header: 'Store Reg Price (range)',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    }), highlighter('storeregularprice')],
    columnorder: '0'
},
{
    property: 'storespecialprice',
        header: 'Store Special Price (range)',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    }), highlighter('name')],
    columnorder: '0'
},
{
    property: 'mcomspecial',
    header: 'MCOM Special',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'pricinginfo',
    header: 'Additional Pricing Info',
    cell: [editable({
        editor: editors.dropdown([{name:'Only At Macys', value:'Only At Macys'},{name:'Not Applicable', value:'Not Applicable'},{name:'Custom', value:'Custom'}]),
    }), highlighter('pricinginfo')],
    columnorder: '0'
},
{
    property: 'mcomregprice',
    header: 'MCOM Reg Price (range)',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
})],
    columnorder: '0'
},
{
    property: 'mcomspecialprice',
        header: 'MCOM Special Price (range)',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'pricingcomments',
    header: 'Pricing Comments',
    cell: [editable({
        editor: editors.dropdown([{name:'Not Congruent', value:'Not Congruent'},{name:'Congruent', value:'Congruent'},{name:'All Sizes', value:'All Sizes'},{name:'TV Offer', value:'TV Offer'},{name:'GWP', value:'GWP'},{name:'40% Off', value:'40% Off'},{name:'30% Off', value:'30% Off'},{name:'50% Off', value:'50% Off'},{name:'Custom', value:'Custom'}]),
    }), highlighter('pricingcomments')],
    columnorder: '0'
},
{
    property: 'markettointernational',
        header: 'Market to International',
    cell: [editable({
        editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    })],
    columnorder: '0'
},
{
    property: 'projectedunits',
        header: 'Projected Units',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    })],
    columnorder: '0'
},
{
    property: 'projectedsales',
        header: 'MCOM Projected Sales',
    cell: [editable({
        editor: editors.rangeinput('sortnumber'),
    })],
    columnorder: '0'
},
{
    property: 'salesfor2015',
    header: 'Sales For 2015',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    }), highlighter('name')],
    columnorder: '0'
},
{
    property: 'imageid',
        header: 'Image Id',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), highlighter('imageid')],
    columnorder: '0'
},
{
    property: 'arimageid',
    header: 'AR Image Id',
    cell: [
        editable({
            editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
        }),
        highlighter('arimageid')],
    columnorder: '0'
},
{
    property: 'singleormultiple',
    header: 'Single or Multiple',
    cell: [editable({
        editor: editors.dropdown([{name: 'Single', value: 'Single'},{name: 'Multiple', value: 'Multiple'}]),
        }), highlighter('singleormultiple')],
    columnorder: '0'
},
{
    property: 'featureproductid',
        header: 'Feature Product Ids',
    cell: [
        editable({
            editor: editors.input(_.filter(validations, function(v) { return v.name == 'multinumerical'})),
        }),
        highlighter('featureproductid')],
    columnorder: '0'
},
{
    property: 'savedsetid',
        header: 'Saved Set Ids',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    })],
    columnorder: '0'
},
{
    property: 'tileimage',
    header: 'Tile Image',
    cell: [
        editable({
            editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
        }),
        highlighter('tileimage'),
        ],
    columnorder: '0'
},
{
    property: 'tilecopy1',
        header: 'Tile Copy Line 1',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'tilecopy2',
        header: 'Tile Copy Line 2',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'tilecopy3',
        header: 'Tile Copy Line 3',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'tilecopy4',
        header: 'Tile Copy Line 4',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'plenti',
    header: 'Plenti Watermark',
    cell: [editable({
        editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    })],
    columnorder: '0'
},
{
    property: 'bffavorites',
        header: 'Black Friday Favorites',
    cell: [editable({
        editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    })],
    columnorder: '0'
},
{
    property: 'goingfast',
        header: 'Going Fast',
    cell: [editable({
        editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    })],
    columnorder: '0'
},
{
    property: 'alsoinpetites',
        header: 'Also in Petites',
    cell: [editable({
        editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    })],
    columnorder: '0'
},
{
    property: 'petitessavedset',
        header: 'Petites Saved Set',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    })],
    columnorder: '0'
},
{
    property: 'needsavedset',
    header: 'Need Saved Set?',
    cell: [editable({
        editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    })],
    columnorder: '0'
},
{
    property: 'linktype',
    header: 'Link Type',
    cell: [editable({
        editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
    })],
    columnorder: '0'
},
{
    property: 'livedate',
    header: 'Live Date',
    cell: [editable({
        editor: editors.input(),
    })],
    columnorder: '0'
},
{
    property: 'categoryid',
        header: 'Category Id linking',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    })],
    columnorder: '0'
},
{
    property: 'productid',
    header: 'Product Id linking',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    })],
    columnorder: '0'
},
{
    property: 'url',
        header: 'Url linking',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'petiteslinktype',
    header: 'Petites Link Type',
    cell: [editable({
        editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
    })],
    columnorder: '0'
},
{
    property: 'petitescategoryid',
    header: 'Petites Category Linking',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), highlighter('petitescategoryid')],
    columnorder: '0'
},
{
    property: 'petitesproductid',
    header: 'Petites Product Linking',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }), highlighter('petitesproductid')],
    columnorder: '0'
},
{
    property: 'petitesurl',
    header: 'Petites Url Linking',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'omniprojectedsales',
    header: 'Omni Projected Sales',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    })],
    columnorder: '0'
},
{
    property: 'extraomniprojectedsales',
    header: 'Extra Omni Projected Sales',
    cell: [editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
    })],
    columnorder: '0'
},
{
    property: 'killedrow',
    header: 'Killed Row',
    cell: [editable({
        editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
    })],
    columnorder: '0'
},
{
    cell: function(value, celldata, rowIndex) {
        var idx = findIndex(this.state.data, {
            id: celldata[rowIndex].id,
        });

        var edit = () => {
            var schema = {
                type: 'object',
                properties: properties,
            };

            var onSubmit = (editData, editValue) => {
                this.refs.modal.hide();

                if(editValue === 'Cancel') {
                    return;
                }

                this.state.data[idx] = editData;

                this.setState({
                    data: this.state.data
                });
            };

            var getButtons = (submit) => {
                return (
                    <span>
                        <input type='submit'
                        className='pure-button pure-button-primary ok-button'
                        key='ok' value='OK'
                        onClick={submit} />
                        <input type='submit'
                        className='pure-button cancel-button'
                        key='cancel' value='Cancel'
                        onClick={submit} />
                    </span>
                    );
            };

            this.setState({
                modal: {
                    title: 'Edit',
                    content: <Form
                    className='pure-form pure-form-aligned'
                    fieldWrapper={FieldWrapper}
                    sectionWrapper={SectionWrapper}
                    buttons={getButtons}
                    schema={schema}
                    validate={validate}
                    values={this.state.data[idx]}
                    onSubmit={onSubmit}/>
                }
            });

            this.refs.modal.show();
        };

        var remove = () => {
            // this could go through flux etc.
            this.state.data.splice(idx, 1);

            this.setState({
                data: this.state.data
            });
        };

        return {
            value: (
                <span>
                    <span className='edit' onClick={edit.bind(this)} style={{cursor: 'pointer'}}>
                    &#8665;
                    </span>
                </span>
                )
        };
    }.bind(this),
},
],
modal: {
    title: 'title',
        content: 'content',
},
pagination: {
    page: 1,
        perPage: 50
}
};
},

onSearch(search) {
    this.setState({
        editedCell: null, // reset edits
        search: search
    });
},

columnFilters() {
    var headerConfig = this.state.header;
    var columns = _.sortBy(this.state.columns, 'columnorder');
    // if you don't want an header, just return;
    return (
        <thead>
            <ColumnNames config={headerConfig} columns={columns} />
            <ColumnFilters columns={columns} />
        </thead>
        );
},

componentDidMount() {
    var self = this;
    var query = window.location.search.split('?')[1];
    var queryyes = query ? '/'+query : ''
    var getdata = function() {
        var data = [];
        $.ajax({
            type: "GET",
            url: '/api/rows' + queryyes,
            success: function (data1) {
                var allrows = _.map(data1, 'entries');
                window.data = data1;
                var arr = [];
                _.each(allrows, function (row, i) {
                    //fill in empty subcategories
                    var allobj = _.zipObject(_.map(columns, 'property'), _.range(columns.length).map(function () {
                        return ''
                    }));
                    _.each(row, function (cell, j) {
                        var all = {};
                        if (cell.columnName != 'sortnumber' && cell.columnName != 'id') {
                            all[cell.columnName] = cell.data;
                        } else {
                            all[cell.columnName] = parseInt(cell.data);
                        }
                        all.rowIndex = parseInt(cell.rowIndex);
//                        all._id = cell._id;
                        _.extend(allobj, all)
                    });
                    arr.push(allobj);
                });
                data = _.sortBy(arr, 'rowIndex');
                self.setState({
                    data: _.sortBy(arr, 'rowIndex')
                });

            },
            complete: function () {

            }
        })
    };
    var egetdata = function(data1) {
        window.data = JSON.parse(data1);

        var allrows = _.map(JSON.parse(data1), 'entries');
        var arr = [];
        _.each(allrows, function (row, i) {
            //fill in empty subcategories
            var allobj = _.zipObject(_.map(columns, 'property'), _.range(columns.length).map(function () {
                return ''
            }));
            _.each(row, function (cell, j) {
                var all = {};
                if (cell.columnName != 'sortnumber' && cell.columnName != 'id') {
                    all[cell.columnName] = cell.data;
                } else {
                    all[cell.columnName] = parseInt(cell.data);
                }
                all.rowIndex = parseInt(cell.rowIndex);
                _.extend(allobj, all)
            });
            arr.push(allobj);
        });
        self.setState({
            data:_.sortBy(arr, 'rowIndex')
        });
        self.interval;
    };

    window.socket.on('new data', function(data) {
//        clearInterval(self.interval);
        egetdata(data);

    });

    window.socket.on('other user editing', function(data) {
        var user = data.user.name;
        var cell = data.cell.editedCell;
        $('.activeOtherCell').removeClass('activeOtherCell');
        $('').replaceAll('.userspan')
        $('.'+cell).addClass('activeOtherCell').append('<span class="userspan">'+user.split(' ')[0]+' '+user.split(' ')[1][0]+'</span>');
    })


},



render() {
    var columns = _.sortBy(this.state.columns, 'columnorder');
    columns = _.each(columns, function(col) {
        var thisuserspermissions = _.filter(userpermissions, function(users) {
            return users.type == user.type
        })[0] ? _.filter(userpermissions, function(users) {
            return users.type == user.type
        })[0].permission : [];
        if ((!_.includes(thisuserspermissions, col.property) && user.type != 'admin') || user.locked) {
            col.cell = [];
        }
    })
    var pagination = this.state.pagination;

    var data = this.state.data;

    if (this.state.search.query) {
        data = Search.search(
            data,
            columns,
            this.state.search.column,
            this.state.search.query
        );
    }

    data = sortColumn.sort(data, this.state.sortingColumn, orderBy);

    var paginated = paginate(data, pagination);
    var pages = Math.ceil(data.length / Math.max(
            isNaN(pagination.perPage) ? 1 : pagination.perPage, 1)
    );

    return (
        <div>
            <div className='controls'>
                <div className='per-page-container'>
                Per page <input type='text' defaultValue={pagination.perPage} onChange={this.onPerPage}></input>
                </div>
                <div className='search-container'>
                Search <Search columns={columns} data={this.state.data} onChange={this.onSearch} />
                </div>
            </div>
            <Table
            className='pure-table pure-table-striped'
            columnNames={this.columnFilters}
            columns={columns}
            data={paginated.data}
            row={(d, rowIndex) => {
                return {
                className: rowIndex % 2 ? 'odd-row row-'+d.id : 'even-row row-'+d.id,
                onClick: () => {
                    window.row = d.id;
                },
                onMouseEnter: (e) => {
                    if ((e.target.getAttribute('data-property') == 'tileimage') || (e.target.getAttribute('data-property') == 'imageid')) {
                        var parts = e.target.innerText.split('').reverse().join('') || '';
                        parts = parts.match(/[\s\S]{1,2}/g) || []
                        var withslash = '';

                        if (parts.length > 0) {
                            if (parts.length == 4) {
                                if (parts[parts.length-1].length < 2) {
                                    parts[parts.length-1] = parts[parts.length-1]+'0';
                                    withslash = parts.join('/').split('').reverse().join('');
                                } else {
                                    withslash = parts.join('/').split('').reverse().join('');
                                }
                            } else {
                                parts[3] = '00';
                                withslash = parts.join('/').split('').reverse().join('');
                            }
                        }
                        var url = 'https://stars.macys.com/preview/'+withslash+'/final/'+e.target.innerText+'-214x261.jpg';
                        $(e.target).append('<img class="imagehover" src="'+url+'" onerror="this.onerror=null;this.src=\'https://stars.macys.com/UI/Common/Graphics/Main/product-image-not-available.jpeg\';"/>')
                    }
                },
                onMouseLeave: (e) => {
                    $(e.target).parent().find('img').replaceWith('');
                },
                dataRow: d.id,
                };
                }}
            >

            </Table>
            <div className='controls'>
                <div className='pagination'>
                    <Paginator.Context className="pagify-pagination"
                    segments={segmentize({
                        page: pagination.page,
                        pages: pages,
                        beginPages: 3,
                        endPages: 3,
                        sidePages: 2
                    })} onSelect={this.onSelect}>
                        <Paginator.Button page={pagination.page - 1}>Previous</Paginator.Button>

                        <Paginator.Segment field="beginPages" />

                        <Paginator.Ellipsis className="ellipsis"
                        previousField="beginPages" nextField="previousPages" />

                        <Paginator.Segment field="previousPages" />
                        <Paginator.Segment field="centerPage" className="selected" />
                        <Paginator.Segment field="nextPages" />

                        <Paginator.Ellipsis className="ellipsis"
                        previousField="nextPages" nextField="endPages" />

                        <Paginator.Segment field="endPages" />

                        <Paginator.Button page={pagination.page + 1}>Next</Paginator.Button>
                    </Paginator.Context>
                </div>
            </div>
            <SkyLight ref='modal' title={this.state.modal.title}>{this.state.modal.content}</SkyLight>
        </div>
        );
},

onSelect(page) {
    var pagination = this.state.pagination || {};
    var pages = Math.ceil(this.state.data.length / pagination.perPage);

    pagination.page = Math.min(Math.max(page, 1), pages);

    this.setState({
        pagination: pagination
    });
},

onPerPage(e) {
    var pagination = this.state.pagination || {};

    pagination.perPage = parseInt(e.target.value, 10);

    this.setState({
        pagination: pagination
    });
},
});

function paginate(data, o) {
    data = data || [];

    // adapt to zero indexed logic
    var page = o.page - 1 || 0;
    var perPage = o.perPage;

    var amountOfPages = Math.ceil(data.length / perPage);
    var startPage = page < amountOfPages? page: 0;

    return {
        amount: amountOfPages,
        data: data.slice(startPage * perPage, startPage * perPage + perPage),
        page: startPage
    };
}

function augmentWithTitles(o) {
    for (var property in o) {
        o[property].title = titleCase(property);
    }
    return o;
}


function attachIds(arr) {
    return arr.map((o, i) => {
        o.id = i;
    return o;
});
}

function find(arr, key, value) {
    return arr;
}

function findselect(arr, key, value) {
    return arr.reduce((a, b) => a[key] === value ? a : b[key] === value && b);
}

function highlightRow(self, row){
//    console.log(self,'clicked', row)
//    console.log(self.getDOMNode());
}
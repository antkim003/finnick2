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
var rowdata = require('./data/dummyrowdata.js');
var dummyusers = require('./data/dummyusers.js');
var categoriesandsub = require('./data/categoriesandsub.js');

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

        var users = dummyusers;

        window.user = users[Math.floor(Math.random()*users.length)];

        var data = rowdata;

var editable = cells.edit.bind(this, 'editedCell', (value, celldata, rowIndex, property) => {
    console.log('editable', celldata, rowIndex, celldata[rowIndex].id, property);
    var idx = findIndex(this.state.data, {
        id: celldata[rowIndex].id,
    });
    var row = value.hasOwnProperty('row') ? value.row : rowIndex;
    var val = value.hasOwnProperty('row') ? value.val : value;
    //            console.log('id', celldata, value);
    this.state.data[row][property] = val;
    this.setState({
        data: data,
    });
});

var formatters = {
        country: (country) => find(countries, 'value', country).name,
    };

var highlighter = (column) => highlight((value) => {
    return Search.matches(column, value, this.state.search.query);
});

var t = _.filter(categoriesandsub, function(c){ return c.value == 'men'})[0].subcategories;

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
        header: 'sort number',
        cell: [editable({
            editor: editors.input(),
        })],
        columnorder: '0'
    },
{
    property: 'name',
        header: 'Name',
    cell: [editable({
    editor: editors.input(),
})],
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
    cell: [editable({
        editor: editors.input(),
    }), highlighter('name')],
        columnorder: '0'
},
{
    property: 'subcategories',
        header: 'Subcategories',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
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
        editor: editors.checkbox(t, 'cat')
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
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'storespecialprice',
        header: 'Store Special Price (range)',
    cell: [editable({
    editor: editors.input(),
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
        header: 'Additional Pricing Info eg. BOGO qualifier, mail in rebate, disclaimer',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'mcomregprice',
        header: 'MCOM Reg Price (range)',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'mcomspecialprice',
        header: 'MCOM Special Price (range)',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'pricingcomments',
        header: 'Pricing Comments',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'markettointernational',
        header: 'Market to International',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'projectedunits',
        header: 'Projected Units',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'projectedsales',
        header: 'MCOM Projected Sales',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'salesfor2015',
        header: 'Sales For 2015',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'imageid',
        header: 'Image Id',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'arimageid',
        header: 'AR Image Id',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'singleormultiple',
        header: 'Single or Multiple',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'featureproductid',
        header: 'Feature Product Ids',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'savedsetid',
        header: 'Saved Set Ids',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'tileimage',
        header: 'Tile Image',
    cell: [editable({
    editor: editors.input(),
})],
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
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'bffavorites',
        header: 'Black Friday Favorites',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'goingfast',
        header: 'Going Fast',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'alsoinpetites',
        header: 'Also in Petites',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'petitessavedset',
        header: 'Petites Saved Set',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'needsavedset',
        header: 'Need Saved Set?',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'linktype',
        header: 'Link Type',
    cell: [editable({
    editor: editors.input(),
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
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'productid',
        header: 'Product Id linking',
    cell: [editable({
    editor: editors.input(),
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
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'petitescategoryid',
        header: 'Petites Category Linking',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'petitesproductid',
        header: 'Petites Product Linking',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
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
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'extraomniprojectedsales',
        header: ' Extra Omni Projected Sales',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'killedrow',
        header: 'Killed Row',
    cell: [editable({
    editor: editors.input(),
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
        perPage: 10
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

render() {
    var columns = _.sortBy(this.state.columns, 'columnorder');
//        var columns = this.state.columns;

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
                    console.log('clicked row', d); 
                    window.row = d.id; highlightRow(this,d.id);
                },
                dataRow: d.id
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

function getFieldGenerators(countryValues) {
    return {
        name: function() {
            var forenames = ['Jack', 'Bo', 'John', 'Jill', 'Angus', 'Janet', 'Cecilia',
                'Daniel', 'Marge', 'Homer', 'Trevor', 'Fiona', 'Margaret', 'Ofelia'];
            var surnames = ['MacGyver', 'Johnson', 'Jackson', 'Robertson', 'Hull', 'Hill'];

            return math.pick(forenames) + ' ' + math.pick(surnames);
        },
        position: function() {
            var positions = ['Boss', 'Contractor', 'Client', ''];

            return math.pick(positions);
        },
        salary: generators.number.bind(null, 0, 2),
        country: function() {
            return math.pick(countryValues);
        }
    };
}

function attachIds(arr) {
    return arr.map((o, i) => {
        o.id = i;

    return o;
});
}

function find(arr, key, value) {
//    console.log('console.log find ',key, value, arr )
//    for( var i=0; i < value.length; i++) {
//        console.log(value[i]);
//    }

    return arr;
//    var value = Array.isArray(value) ? value : [value];
//
//    value.forEach(function(country){
//        if(arr[country]) {
//            return arr[country];
//        }
//        console.log('inforeach,',arr, country, key, value)
//    })


//    return arr.reduce((a, b) => a[key] === value ? a : b[key] === value && b);
}

function findselect(arr, key, value) {
    return arr.reduce((a, b) => a[key] === value ? a : b[key] === value && b);
}

function highlightRow(self, row){
//    console.log(self,'clicked', row)
//    console.log(self.getDOMNode());
}
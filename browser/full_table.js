'use strict';

var React = require('react');
//var Form = require('plexus-form');
//var validate = require('plexus-validate');
var SkyLight = require('react-skylight').default;
//var generators = require('annogenerate');
//var math = require('annomath');
var Paginator = require('react-pagify').default;
//var titleCase = require('title-case');
var orderBy = require('lodash/orderBy');
var cx = require('classnames');
var segmentize = require('segmentize');

var Table = require('../src/table');
var ColumnNames = require('../src/column_names');
var Search = require('../src/search');
var editors = require('../src/editors');
var sortColumn = require('../src/sort_column');
//var cells = require('../src/cells');

var ColumnFilters = require('./column_filters.js');
var FieldWrapper = require('./field_wrapper.js');
var SectionWrapper = require('./section_wrapper.js');
//var dummyusers = require('./data/dummyusers.js');
//var categoriesandsub = require('./data/categoriesandsub.js');
//var categoriesandsub1 = categoriesandsub;
//var categoriesandsub2 = categoriesandsub;
//var columns = require('./data/columnsschema.js');
var columnstoedit = require('./data/columnedit.js')
var userpermissions = require('./data/userpermissions.js');
//var validations = require('./data/validations.js');
//var highlight = require('../src/formatters/highlight');
var scrolling = require('./scrolling.js');
var sockets = require('./sockets.js');

module.exports = React.createClass({
    displayName: 'FullTable',
    getInitialState: function(){
        var self = this;

        scrolling();
//      var users = dummyusers;
        var users = [
            {"name":"Jonathan Garza","email":"jgarza3@columbia.edu","type":"admin","locked":true},
            {"name":"Jayne Smyth","email":"test@columbia.edu","type":"admin","locked":false}
        ]
        window.user = users[Math.floor(Math.random()*users.length)];
        window.statedata = [];
        sockets();
        if (window.location.search == '') {
            window.location.search = '?women'
        }
        var query = window.location.search.split('?')[1];
        var queryyes = query ? '/'+query : '/women';

        var getdata = function() {
            $.ajax({
                type: "GET",
                url: '/api/rows' + queryyes,
                success: function (data1) {
//                    console.log(window.coledit, 'in get data')
                    var allrows = _.map(data1, 'entries');
                    var columns = window.coledit;
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
                            _.extend(allobj, all)
                        });
                        arr.push(allobj);
                    });
                    window.statedata = _.sortBy(arr, 'rowIndex');
                    self.setState({
                        data: _.sortBy(arr, 'rowIndex')
                    });

                },
                complete: function () {

                }
            })
        }
        $.when(columnstoedit(self)).done(function( ) {
            getdata()
        });


        window.datainterval = setInterval(function() {
            getdata();
        }, 30000);
//        self.interval;


window.hiding = [];




return {
    editedCell: null,
    data: statedata,
    formatters: null,
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
    columns:  _.filter(window.coledit, function(col) { return !_.includes(localStorage.getItem('hidecol'), col.property) }),
    modal: {
        title: 'title',
        content: 'content',
    },
    pagination: {
        page: 1,
        perPage: 24
    },
    hiddencolumns: []
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
    var columns = _.sortBy(this.state.columns, 'columnorder');

    var query = window.location.search.split('?')[1];
    var queryyes = query ? '/'+query : '/women'
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

//    var egetdata = function(data1) {
//        var filteredrows = _.filter(JSON.parse(data1), function(e){ return e.entries[_.findIndex(e.entries, function(eb){ return eb.columnName == 'category' } )].data == query })
//        console.log(filteredrows)
//        var allrows = _.map(filteredrows, 'entries');
//        var arr = [];
//        _.each(allrows, function (row, i) {
//            //fill in empty subcategories
//            var allobj = _.zipObject(_.map(columns, 'property'), _.range(columns.length).map(function () {
//                return ''
//            }));
//            _.each(row, function (cell, j) {
//                var all = {};
//                if (cell.columnName != 'sortnumber' && cell.columnName != 'id') {
//                    all[cell.columnName] = cell.data;
//                } else {
//                    all[cell.columnName] = parseInt(cell.data);
//                }
//                all.rowIndex = parseInt(cell.rowIndex);
//                _.extend(allobj, all)
//            });
//            arr.push(allobj);
//        });
//        self.setState({
//            data:_.sortBy(arr, 'rowIndex')
//        });
//        window.datainterval;
//    };

    window.socket.on('new data', function(data) {
//        clearInterval(self.interval);
//        egetdata(data);
            getdata()
    });


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

    var fobs = [];
    var collections = window.user.buyercollections ? window.user.buyercollections : ['women', 'men', 'for_the_home'] ;
    _.each(collections, function(col, i) {
        fobs.push(<option value={col}>{col}</option>)
    });

    return (
        <div>
            <div className="user-info">
                Hi, {window.user.name}. You are a/n {window.user.type}. {window.user.locked ? 'Your account is locked.' : ''}
                <div className="fob">Choose your FOB <select className="fob-drop" value={window.location.search.split('?')[1]} onChange={this.changeFOB}>{fobs}</select>
                    <button onClick={this.hideCols}>Hide Columns</button>

                </div>
            </div>
            <div className='controls'>
                <div className='per-page-container'>
                Per page <input type='text' defaultValue={pagination.perPage} onChange={this.onPerPage}></input>
                </div>
                <div className="rowstoshow">Rows <input type="text" onChange={this.rowsToShow} placeholder="10-15"/></div>

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
            <div className={this.state.pagination.hide == true ? "controls controlpaghide" : 'controls controlpagshow'}>
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

changeFOB(e) {
   window.location.search = e.target.value;
},
rowsToShow(e) {

    var self = this;
    var pagination = self.state.pagination || {};
    if (e.target.value != '') {
        pagination.hide = true;
        pagination.perPage = e.target.value.split('-')[1] - e.target.value.split('-')[0] + 1;
        pagination.page = (parseFloat(e.target.value.split('-')[0] - 1) / parseFloat(pagination.perPage)) + 1;
    } else {
        pagination.hide = false;
        var page = $('.per-page-container').find('input').val();
        pagination.page = 1;
        pagination.perPage = page;
    }
    self.setState({
        pagination: pagination
    });

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
hideCols() {
    var columns = _.filter(window.coledit, function(col) { return col.property != 'id'});
    var cols = [];

    var hiddencolumns = localStorage.getItem('hidecol');

    _.each(columns, function(c,i){
        var hiddencolumns = localStorage.getItem('hidecol') ;
        var propchecked = _.includes(hiddencolumns, c.property);
        if (propchecked) {
            cols.push(<div className="showhidecol"><label for={'name-'+c.property}>{c.property}</label><input type="checkbox" value={c.property} checked id={'name-'+c.property} /> </div>)
        } else if (c.property == 'id') {
        }else {
            cols.push(<div className="showhidecol"><label for={'name-'+c.property}>{c.property}</label><input type="checkbox" id={'name-'+c.property} value={c.property} /></div>)
        }
    })

    var onSubmit = (e) => {
        var self = this;
        _.each($('#hideCols').find('.showhidecol'), function (input, i) {
            if ($(input).find('input:checked').length > 0 ) {
                window.hiding.push($(input).find('input').val());
            } else {
                window.hiding = _.union(_.without(window.hiding, $(input).find('input').val()))
            }
        })
        this.refs.modal.hide();
        localStorage.setItem('hidecol', window.hiding)
        this.setState({
            columns: _.filter(window.coledit, function(col) { return !_.includes(localStorage.getItem('hidecol'), col.property) || col.property == 'id'})
        })
    };
    var formChange = (e) => {
        if (e.target.value == 'all') {
            if (e.target.checked) {
                _.each($('#hideCols').find('.showhidecol').find('input'), function (input, i) {
                    $(input).prop('checked', true);
                })
            } else {
                _.each($('#hideCols').find('.showhidecol').find('input'), function (input, i) {
                    $(input).prop('checked', false);
                })
            }
        } else {
            console.log('in form change');
            var hide = e.target.value;
            var hiddencolumns = localStorage.getItem('hidecol');

            if (e.target.checked) {
//                $(e.target).removeProp('checked');
                window.hiding = _.uniq(window.hiding.push(hide));
                localStorage.setItem('hidecol',window.hiding)
                cols = [];
               _.each(columns, function(c,i) {
                    var propchecked = _.includes(window.hiding, c.property);
                   if (propchecked) {
                       cols.push(<div className="showhidecol"><label for={'name-'+c.property}>{c.property}</label><input type="checkbox" value={c.property} checked id={'name-'+c.property} /> </div>)
                   } else if (c.property == 'id') {
                   }else {
                       cols.push(<div className="showhidecol"><label for={'name-'+c.property}>{c.property}</label><input type="checkbox" id={'name-'+c.property} value={c.property} /></div>)
                   }
                });
                colstate();
            } else {
                window.hiding = _.uniq(_.without(window.hiding, hide));
                localStorage.setItem('hidecol',window.hiding)
                cols = [];
                _.each(columns, function(c,i) {
                    var propchecked = _.includes(window.hiding, c.property);
                    if (propchecked) {
                        cols.push(<div className="showhidecol"><label for={'name-'+c.property}>{c.property}</label><input type="checkbox" value={c.property} checked id={'name-'+c.property} /> </div>)
                    } else if (c.property == 'id') {
                    }else {
                        cols.push(<div className="showhidecol"><label for={'name-'+c.property}>{c.property}</label><input type="checkbox" id={'name-'+c.property} value={c.property} /></div>)
                    }
                });
                colstate();
            }
        }

    }
    var colstate = () => {
        this.setState({
            modal: {
                title: 'Columns to Hide',
                content: <div id="hideCols" onChange={formChange}>
                    <div><input type="checkbox" value="all"/>hide all <button onClick={onSubmit}>Ok</button></div>
                    {cols}
                </div>
            }
        });
    }
    colstate();


    this.refs.modal.show();
}




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

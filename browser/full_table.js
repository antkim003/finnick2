'use strict';

var React = require('react');
var Form = require('plexus-form');
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
var ColumnFilters = require('./column_filters.js');
var FieldWrapper = require('./field_wrapper.js');
var SectionWrapper = require('./section_wrapper.js');
var columnstoedit = require('./data/columnedit.js')
var userpermissions = require('./data/userpermissions.js');

var scrolling = require('./scrolling.js');
var sockets = require('./sockets.js');
import { browserHistory } from 'react-router';

module.exports = React.createClass({
    displayName: 'FullTable',
    getInitialState: function(){
        var self = this;
        scrolling();
        var users = [
            {"name":"Jonathan Garza","email":"jgarza3@columbia.edu","type":"admin","locked":false},
            {"name":"Jayne Smyth","email":"test@columbia.edu","type":"admin","locked":false}
        ]
        window.user = JSON.parse(localStorage.getItem('user'));
        window.statedata = [];
        sockets();
        if (window.location.search == '') {
            browserHistory.push( window.location.pathname + '?women');
        }
        var query = window.location.search.split('?')[1];
        var queryyes = query ? '/'+query : '/women';


        var getdata = function(q) {
            var fob = q ? '/'+q : queryyes;
            $.ajax({
                type: "GET",
                url: '/api/rows' + fob,
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
            var scrollX = window.scrollX+1
            var scrollY = window.scrollY+1
            if ($('.demonstration').size() > 0) {
                window.scrollTo(scrollX,scrollY);
            }
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
    var queryyes = query ? '/'+query : '/women';

    var getdata = function(query) {
        var fob = query ? query : queryyes;
        var data = [];
        $.ajax({
            type: "GET",
            url: '/api/rows' + fob,
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


    window.socket.on('new data', function(data) {
        getdata()
    });
    window.datainterval = setInterval(function() {
        getdata()
    }, 30000);



},



render() {
    var columns = _.sortBy(this.state.columns, 'columnorder');
    columns = _.each(columns, function(col) {
        var thisuserspermissions = _.filter(userpermissions, function(users) {
            return users.type == user.type
        })[0] ? _.filter(userpermissions, function(users) {
            return users.type == user.type
        })[0].permission : [];
        if ((!_.includes(thisuserspermissions, col.property) && user.type != 'admin')
            || user.locked && user.type != 'admin'
            || user.collections.length == 0 && user.type != 'admin'
            || !_.includes(user.collections, window.location.search.split('?')[1]) && user.type != 'admin' ) {
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
//    var defaultcollections = window.user.type =='admin' ? ['women', 'men', 'for_the_home'] : ''
    var collections = window.user.collections.length > 0 ? window.user.collections : ['women', 'men', 'for_the_home'] ;
    _.each(collections, function(col, i) {
        fobs.push(<option key={col+'-'+i} value={col}>{col}</option>)
    });


//### permissions for "tools"
//
    var buttons = [];
    if (window.user.type == 'admin') { //admin only
        buttons.push(<button key="button1" onClick={this.rowsOneValue}>Rows all one Value</button>);
    }
    if (window.user.type == 'photography' || window.user.type == 'admin') { //photography
        buttons.push(<button key="button2" onClick={this.leadSheetHelper}>Lead Sheet Helper</button>)
    }
    var thisuserspermissions = _.filter(userpermissions, function(users) {
        return users.type == user.type
    })[0] ? _.filter(userpermissions, function(users) {
        return users.type == user.type
    })[0].permission : [];

//                {thisuserspermissions ? 'Permission to edit columns '+thisuserspermissions.join(', ') : ''}

    return (
        <div>
            <div className="user-info">
                Hi, {window.user.name}. You are a/n {window.user.type} user. {window.user.locked ? 'Your account is locked.' : ''}
                {window.user.type != 'admin' && window.user.collections.length == 0 ? 'Unfortunately, you have no collections/FOBs to edit, but you can view them.' : ''}
                {window.user.type != 'admin' && window.user.type != 'marketing' && !_.includes(window.user.collections, window.location.search.split('?')[1]) ? <div className="fixedError">This is an FOB you don't have access to edit, showing read-only view.</div> : ''}
                {thisuserspermissions ? 'Permission to edit columns: '+thisuserspermissions.join(', ') : ''}

                <div className="fob">Choose FOB <select className="fob-drop" key="fob" value={window.location.search.split('?')[1]} onChange={this.changeFOB}>{fobs}</select>
                    <button onClick={this.hideCols}>Hide Columns</button>
                    <button onClick={this.helpModal}>HELP!</button>
                    {buttons}
                </div>
            </div>
            <div className='controls'>
                <div className='per-page-container'>
                Per page <input type='text' defaultValue={pagination.perPage} onChange={this.onPerPage}></input>
                </div>
                <div className="rowstoshow">Rows <input type="text" placeholder="10-15"/><button onClick={this.rowsToShow} >Ok</button></div>

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
                        var parts = $(e.target).text().split('').reverse().join('') || '';
                        parts = parts.match(/[\s\S]{1,2}/g) || [];
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
                        var url = 'https://stars.macys.com/preview/'+withslash+'/final/'+$(e.target).text()+'-214x261.jpg';
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
helpModal() {
    var self = this;
    this.refs.modal.show();
    this.setState(
        {
            modal: {
                title: 'Help',
                content: <div>
                    <ul>
                        <li>Grey VS Green headers <br/>
                            Grey = NO-editing columns; Green (for GO!) = editable columns
                        </li>
                        <li>Hover over (i) for more Information on column
                        </li>
                        <li>Questions/Comments<br/>
                            email elizabeth.chen@macys.com or anthony.kim@macys.com
                        </li>
                    </ul>
                </div>
            }
        }
    )
},
leadSheetHelper() {
    var self = this;
    this.refs.modal.show();
    var fob = window.location.search.split('?')[1];
    var ds = [];
    var dataforlead =  () => {
        _.each(self.state.data, function(d, i){
            var evenorodd = i%2 == 0 ?'leadsheet-odd':'leadsheet-even';
            ds.push( <li className={evenorodd}><b className={"leadsheet-id"}>{fob + ' row ' +d.id}</b>:
                <div className="leadsheet-c"> <b>AR:</b> {d.arimageid} <br/> <b>IN-STORE:</b>{d.instorespecial} <br/>  <b>MCOM:</b>{d.mcomspecial}</div>
            </li>)
        })
    }
    dataforlead();
    this.setState(
        {
            modal: {
                title: 'Photography Lead Sheet',
                content: <div>
                    AR ID, INSTORE Description, MCOM Description
                    <ul id="leadsheet">{ds}</ul>
                </div>
            }
        }
    )
},
rowsOneValue() {
    var self = this;
    var columns = _.filter(window.coledit, function(col) { return col.property != 'id'});

    var fob = window.location.search.split('?')[1];
    var saverows = function(e) {
        var value = $('#same-rows-value').val();
        var column = $('#same-rows-column').val();
        var rows1 = $('#same-rows1').val();
        var rows2 = $('#same-rows2').val();
        var arr = [];
        for (var i = parseInt(rows1); i <= rows2; i++) {
            arr.push(i);
        }
        var setrow = _.filter(window.data, function(d){
            return  d.index >= rows1 && d.index <= rows2;
        });
        var cellsincol = [];
        var cells = _.each(setrow, function(row,i){
            _.each(row.entries, function(c,i){
                if (c.columnName == column){
                    cellsincol.push(c)
                }
            })
        });
        var datacells = [];
        _.each(cellsincol, function(cell, i) {
            datacells.push({"_id": cell._id, "data": value});
        })
        var query = window.location.search.split('?')[1];
        $.ajax({
            type: 'PUT',
            url: 'api/cells/',
            data: JSON.stringify(datacells),
            contentType: "application/json",
            success: function() {
                console.log('done');
                window.socket.emit('my other event', { val: value, row: window.row-1 });
                window.datainterval;
//                window.location.reload(true);
                _.each(cellsincol, function(cell, i) {
                    self.state.data[cell.rowIndex-1][column] = value;
                    if (i == cellsincol.length-1) {
                        setTimeout(function(){
                            self.setState({
                                data: query ? _.filter(_.sortBy(statedata, 'rowIndex'), function(d) { return d.category == query}) : statedata
                            });
                            self.refs.modal.hide();
                        }, 1000)
                    }
                })

//
            }

        })
//

    }

    this.setState(
        {
            modal: {
                title: 'set a number of rows to the same value',
                content: <div>
                    <div>Rows <input placeholder="2" id="same-rows1"/> - <input placeholder="2" id="same-rows2"/></div>
                    <div>Column
                        <select id="same-rows-column">
                            {columns.map((option) =>
//                                option.property
                                <option key={option.property + '-option'} value={option.property}>{option.header}</option>
                            )}
                        </select>
                        </div>
                    <div>Value <input placeholder="value to set to all rows designated" id="same-rows-value"/>
                    </div>
                    <button onClick={saverows}>Save Value to Rows</button>
                </div>
            }
        });
    this.refs.modal.show();

},
changeFOB(e) {
//    browserHistory.push('/finnick?'+ e.target.value);
   window.location.search = e.target.value;
},
rowsToShow(e) {
    var self = this;
    var pagination = self.state.pagination || {};
    if (e.target.previousSibling.value != '') {
        pagination.hide = true;
        pagination.perPage = e.target.previousSibling.value.split('-')[1] - e.target.previousSibling.value.split('-')[0] + 1;
        pagination.page = (parseFloat(e.target.previousSibling.value.split('-')[0] - 1) / parseFloat(pagination.perPage)) + 1.01;
//        console.log(pagination)
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
            cols.push(<div className="showhidecol"><label>{c.property}</label><input type="checkbox" value={c.property} checked id={'name-'+c.property} /> </div>)
        } else if (c.property == 'id') {
        }else {
            cols.push(<div className="showhidecol"><label>{c.property}</label><input type="checkbox" id={'name-'+c.property} value={c.property} /></div>)
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

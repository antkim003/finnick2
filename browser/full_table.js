'use strict';

var React = require('react');
var Form = require('plexus-form');
var SkyLight = require('react-skylight').default;
var Paginator = require('react-pagify').default;
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
import Loader from '../src/components/loader/loader.js';
import defaultCollections from './data/collections.js';

module.exports = React.createClass({
    displayName: 'FullTable',
    isInCollection: function(collection) {
        return window.user.collections.indexOf(collection) >= 0 ? true : false;
    },
    getInitialState: function(){
        var timeNow = Date.now();
        var self = this;
        scrolling();
        window.user = JSON.parse(localStorage.all).user;
        if (window.user.collections.length < 1) {
            window.user.collections = defaultCollections;
        }
        window.statedata = [];
        sockets();

        if (window.location.search == '') {
            browserHistory.push( window.location.pathname + '?' + (window.user.collections[0] || 'women'));
        }
        var query = window.location.search.split('?')[1];
        if (!this.isInCollection(query)) {
            // not in collection
            browserHistory.push( window.location.pathname + '?' + (window.user.collections[0] || 'women'));
            query = window.user.collections[0] ? window.user.collections[0] : 'women';
        }
        var getdata = function(q) {
            var fob = `/${query}`;
            $.ajax({
                type: "GET",
                url: '/api/rows' + fob,
                success: function (data1) {
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

                    self.setState({ loaderState: false });

                }
            })
        }
        $.when(columnstoedit(self)).done(function( ) {
            getdata()
        });

        window.hiding = [];

        return {
            currentFiles: [],
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
            hiddencolumns: [],
            loaderState: true
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
        // modified for loop to just replace the current array instead of creating a new one with map.
        window.socket.on('new data', function(data) {
            if (window.statedata[0].category === data[0].fob) {
                window.statedata.forEach(function(row, rowIdx){
                    data.forEach(function(cell, cellIdx){
                        if (row.rowIndex === cell.rowIndex) {
                            row[cell.columnName] = cell.data;
                        }
                    });
                });
                self.setState({
                    data: window.statedata
                });
            }
        });

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
            buttons.push(<button key="button-move" onClick={this.moveRow}>Move Row to FOB</button>);
        }
        if (window.user.type == 'photography' || window.user.type == 'admin') { //photography
            buttons.push(<button key="button2" onClick={this.leadSheetHelper}>Lead Sheet Helper</button>)
        }
        var query = window.location.search.split('?')[1];
        buttons.push(<button key="button-export"><a href={"/api/rows/combobulator/"+query+"/export"}>Export to Excel</a></button>);
        buttons.push(<button key="button-exportall"><a href={"/api/rows/combobulator/exportall"}>Export All Excel</a></button>);

        var thisuserspermissions = _.filter(userpermissions, function(users) {
            return users.type == user.type
        })[0] ? _.filter(userpermissions, function(users) {
            return users.type == user.type
        })[0].permission : [];

    //                {thisuserspermissions ? 'Permission to edit columns '+thisuserspermissions.join(', ') : ''}

        return (
            <div>
                {this.state.loaderState ? <Loader /> : null}
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
                rel="js-finnick-table"
                columnNames={this.columnFilters}
                columns={columns}
                data={paginated.data}
                currentFiles={this.state.currentFiles}

                row={(d, rowIndex) => {
                    return {
                    className: rowIndex % 2 ? 'odd-row row-'+d.id : 'even-row row-'+d.id,
                    onClick: (event) => {
                        window.row = d.id;
                    },
                    onMouseEnter: (e) => {
                        //check image
//                        console.log()
//                        if ((e.target.getAttribute('data-property') == 'tileimage' && $(e.target).parent().find('[data-property="imageid"]').text() != '') || (e.target.getAttribute('data-property') == 'imageid')) {
//                            var parts = $(e.target).text().split('').reverse().join('') || '';
//                            parts = parts.match(/[\s\S]{1,2}/g) || [];
//                            var withslash = '';
//                            if (parts.length > 0) {
//                                if (parts.length == 4) {
//                                    if (parts[parts.length-1].length < 2) {
//                                        parts[parts.length-1] = parts[parts.length-1]+'0';
//                                        withslash = parts.join('/').split('').reverse().join('');
//                                    } else {
//                                        withslash = parts.join('/').split('').reverse().join('');
//                                    }
//                                } else {
//                                    parts[3] = '00';
//                                    withslash = parts.join('/').split('').reverse().join('');
//                                }
//                            }
//                            var url = 'https://stars.macys.com/preview/'+withslash+'/final/'+$(e.target).text()+'-214x261.jpg';
//                            $(e.target).append('<img class="imagehover" src="'+url+'" onerror="this.onerror=null;this.src=\'https://stars.macys.com/UI/Common/Graphics/Main/product-image-not-available.jpeg\';"/>')
//                        }

                        //check link
//                        if ((e.target.getAttribute('data-property') == 'url')) {

//                        }
                    },
                    onMouseLeave: (e) => {
//                        $(e.target).parent().find('img').replaceWith('');
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

    checkURL() {
        var self = this;
        this.refs.modal.show();
        var fob = window.location.search.split('?')[1];
        var urls = [];
        var errors = [];
        _.each(self.state.data, function(d, i){
            if (d.linktype == 'url (u)') {
                urls[i] = d.url;
            }
            if (d.linktype == 'category (c)') {
                urls[i] = "c-"+d.categoryid;
            }
            if (d.linktype == 'product (p)') {
                urls[i] = "p-"+d.productid;
            }
    //        <div className="errorUrls" dangerouslySetInnerHTML={{__html: errors}}>

            if ( i == self.state.data.length -1 ){
                $.ajax({
                    url: '/api/rows/checkurl',
                    type: 'POST',
                    data: JSON.stringify(urls),
                    contentType: 'application/json',
                    success: function(data) {
                        var str = '';
                        data = JSON.parse(data);
                        _.each(data, function(d, i){
                            str += 'ROW ';
                            str += Object.keys(d);
                            str += ': ';
                            if (Object.values(d) != 'ok') {
                                str += '<span class="error-row">BAD</span> <a href="';
                                str += Object.values(d);
                                str += '">'
                                str += Object.values(d);
                                str += "</a>"
                            } else {
                                str += Object.values(d);
                            }
                            str += '<br/>';

                        });
                        errors.push(str);
                        self.setState({
                            modal: {
                                title: 'Check URLs in '+fob,
                                content: <div style={{height: "90%"}}>
                                            <div className="errorUrls" style={{height: "100%"}} dangerouslySetInnerHTML={{__html: errors}}>
                                            </div>
                                        </div>
                            }
                        })
                    }
                })
            }
        });

        this.setState(
            {
                modal: {
                    title: 'Check URLs',
                    content: <div>
                        <ul>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"/>
                        </ul>
                    </div>
                }
            }
        )
    },
    moveRow() {
        var query = window.location.search.split('?')[1];

        this.refs.modal.show();
        var fobs = [];
        var collections = window.user.collections.length > 0 ? window.user.collections : ['men', 'for_the_home', 'women'] ;
        _.each(collections, function(col, i) {
            fobs.push(<option key={col+'-'+i} value={col}>{col}</option>);
        });

        var move = function(e) {
            var row = _.filter(data, function(row) {
                return row.index == $('#move-row').val();
            });
            var cell = $('.'+$('#move-row').val()+'-'+'killedrow').attr('data-id');
            var idCell = _.find(row[0].entries, function(entry){ return entry.columnName == 'id'});
            var catCell = _.find(row[0].entries, function(entry){ return entry.columnName == 'category'});
//            debugger;
            var killCell = cell ? cell : {"_id":'newcell'};

            var params = [{"row": row[0]._id, "fromFOB": row[0].fob, "toFOB": $('#move-to-fob').val(), "idCell": idCell._id, "catCell": catCell._id, "killCell": killCell._id}];
            $.ajax({
                url: '/api/rows/moverow',
                type: 'POST',
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function() {
                    window.socket.emit('new data', {});
                    self.refs.modal.hide();
                }
            })
        }
        this.setState(
            {
                modal: {
                    title: 'Move Row',
                    content: <div>
                        <div>Which row <input type="number" className="test" id="move-row"/> from <span id="move-from-fob">{query}</span></div>
                        <div>To which FOB <select className="ts" key="fob2" id="move-to-fob">{fobs}</select></div>
                        <div><button onClick={move}>Move!</button></div>
                    </div>
                }
            }
        )
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
                            <li>Light blue rows are locked, and can no longer be edited;
                            </li>
                            <li>Rows with strikethrough have been killed, and remain as reference.
                            </li>
                            <li>Questions/Comments<br/>
                                email Mallory.lovato@macys.com
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
                    content: <div style={{height: "85%"}}>
                        AR ID, INSTORE Description, MCOM Description
                        <ul style={{height: "100%"}} id="leadsheet">{ds}</ul>
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
                    window.socket.emit('my other event', { val: value, row: window.row-1 });
    //                window.datainterval;
    //                window.location.reload(true);
                    _.each(cellsincol, function(cell, i) {
                        self.state.data[cell.rowIndex-1][column] = value;
                        if (i == cellsincol.length-1) {
    //                        setTimeout(function(){
                                self.setState({
                                    data: query ? _.filter(_.sortBy(statedata, 'rowIndex'), function(d) { return d.category == query}) : statedata
                                });
                                self.refs.modal.hide();
    //                        }, 1000)
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
        var scrollX = window.scrollX+1
        var scrollY = window.scrollY+1
        if ($('.demonstration').size() > 0) {
            window.scrollTo(scrollX,scrollY);
        }
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
        var self = this;
        window.cols = []
        var initialcols = function() {
            var columns = _.filter( window.coledit, function(col) { return col.property != 'id' } );
            var hiddencolumns = localStorage.getItem('hidecol').split(',');
            _.each(columns, function(c,i){
                var propchecked =  _.includes(hiddencolumns, c.property);
                if (propchecked) {
                    cols.push(<div className="showhidecol" key={c.property+'-1'}><label key={c.property+'-2'}>{c.property}</label><input type="checkbox" key={c.property+'-3'} checked value={c.property} id={'name-'+c.property} /> </div>)
                } else if (c.property == 'id') {
                    //dont add checkbox for row id
                } else {
                    cols.push(<div className="showhidecol" key={c.property+'-1'}><label key={c.property+'-2'}>{c.property}</label><input key={c.property+'-3'} type="checkbox" id={'name-'+c.property} value={c.property} /></div>)
                }
            });
        }


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
                var hide = e.target.value;
                var hiddencolumns = localStorage.getItem('hidecol');
                window.hiding = _.without(hiddencolumns, e.target.value);
                localStorage.setItem('hidecol',window.hiding);
                var target = e.target;
                var checked = target.checked;
                setTimeout( function() {
                    if (!checked) {
                        $(target).prop('checked',false);
                        window.hiding = _.without(hiddencolumns,target.value);
                        localStorage.setItem('hidecol',window.hiding);
                    }
                }, 100 );
            }
        }

        var colstate = () => {
            this.setState({
                modal: {
                    title: 'Columns to Hide',
                    content: <div id="hideCols" onChange={formChange}>
                        <div>
                                <div><input type="checkbox" value="all"/>hide all</div>
                                <button onClick={onSubmit}>Ok</button>
                        </div>
                             {  cols }
                    </div>
                }
            });
        }
        initialcols();
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

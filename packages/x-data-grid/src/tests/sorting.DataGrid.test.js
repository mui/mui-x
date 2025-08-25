"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var sinon_1 = require("sinon");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGrid /> - Sorting', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: isJSDOM,
        rows: [
            {
                id: 0,
                brand: 'Nike',
                isPublished: false,
            },
            {
                id: 1,
                brand: 'Adidas',
                isPublished: true,
            },
            {
                id: 2,
                brand: 'Puma',
                isPublished: true,
            },
        ],
        columns: [{ field: 'brand' }, { field: 'isPublished', type: 'boolean' }],
    };
    it('should keep the initial order', function () {
        var cols = [{ field: 'id' }];
        var rows = [{ id: 10 }, { id: 0 }, { id: 5 }];
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid autoHeight={isJSDOM} columns={cols} rows={rows}/>
      </div>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
    });
    it('should allow sorting using `initialState` and `filterModel` for unsortable columns', function () {
        function TestCase(props) {
            var cols = [{ field: 'id', sortable: false }];
            var rows = [{ id: 10 }, { id: 0 }, { id: 5 }];
            var initialState = {
                sorting: {
                    sortModel: [
                        {
                            field: 'id',
                            sort: 'asc',
                        },
                    ],
                },
            };
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={cols} rows={rows} initialState={initialState} {...props}/>
        </div>);
        }
        var setProps = render(<TestCase />).setProps;
        // check if initial sort is applied
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '5', '10']);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        // should not sort on header click when `colDef.sortable` is `false`
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '5', '10']);
        // should allow sort using `filterModel`
        setProps({ sortModel: [{ field: 'id', sort: 'desc' }] });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '5', '0']);
    });
    it('should allow sorting using `apiRef` for unsortable columns', function () {
        var apiRef;
        function TestCase() {
            apiRef = (0, x_data_grid_1.useGridApiRef)();
            var cols = [{ field: 'id', sortable: false }];
            var rows = [{ id: 10 }, { id: 0 }, { id: 5 }];
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid apiRef={apiRef} columns={cols} rows={rows}/>
        </div>);
        }
        render(<TestCase />);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        // should not sort on header click when `colDef.sortable` is `false`
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
        // should allow sort using `apiRef`
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn('id', 'desc'); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '5', '0']);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn('id', 'asc'); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '5', '10']);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn('id', null); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
    });
    it('should allow clearing the current sorting using `sortColumn` idempotently', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase() {
            apiRef = (0, x_data_grid_1.useGridApiRef)();
            var cols = [{ field: 'id' }];
            var rows = [{ id: 10 }, { id: 0 }, { id: 5 }];
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid apiRef={apiRef} columns={cols} rows={rows}/>
        </div>);
        }
        var apiRef, user, header;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase />).user;
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
                    header = (0, helperFn_1.getColumnHeaderCell)(0);
                    // Trigger a sort using the header
                    return [4 /*yield*/, user.click(header)];
                case 1:
                    // Trigger a sort using the header
                    _a.sent();
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '5', '10']);
                    // Clear the value using `apiRef`
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn('id', null); })];
                case 2:
                    // Clear the value using `apiRef`
                    _a.sent();
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
                    // Check the behavior is idempotent
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn('id', null); })];
                case 3:
                    // Check the behavior is idempotent
                    _a.sent();
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
                    return [2 /*return*/];
            }
        });
    }); });
    // See https://github.com/mui/mui-x/issues/12271
    it('should not keep the sort item with `item.sort = null`', function () {
        var apiRef;
        var onSortModelChange = (0, sinon_1.spy)();
        function TestCase() {
            apiRef = (0, x_data_grid_1.useGridApiRef)();
            var cols = [{ field: 'id' }];
            var rows = [{ id: 10 }, { id: 0 }, { id: 5 }];
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid apiRef={apiRef} columns={cols} rows={rows} onSortModelChange={onSortModelChange}/>
        </div>);
        }
        render(<TestCase />);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        // Trigger a `asc` sort
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '5', '10']);
        expect(onSortModelChange.callCount).to.equal(1);
        expect(onSortModelChange.lastCall.firstArg).to.deep.equal([{ field: 'id', sort: 'asc' }]);
        // Clear the sort using `apiRef`
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn('id', null); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
        expect(onSortModelChange.callCount).to.equal(2);
        // Confirm that the sort item is cleared and not passed to `onSortModelChange`
        expect(onSortModelChange.lastCall.firstArg).to.deep.equal([]);
    });
    it('should always set correct `aria-sort` attribute', function () {
        var cols = [{ field: 'id' }];
        var rows = [{ id: 10 }, { id: 0 }, { id: 5 }];
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid columns={cols} rows={rows}/>
      </div>);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        expect(header).to.have.attribute('aria-sort', 'none');
        internal_test_utils_1.fireEvent.click(header);
        expect(header).to.have.attribute('aria-sort', 'ascending');
        internal_test_utils_1.fireEvent.click(header);
        expect(header).to.have.attribute('aria-sort', 'descending');
    });
    it('should update the order server side', function () {
        var cols = [{ field: 'id' }];
        var rows = [{ id: 10 }, { id: 0 }, { id: 5 }];
        function Demo(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={isJSDOM} columns={cols} sortingMode="server" {...props}/>
        </div>);
        }
        var setProps = render(<Demo rows={rows}/>).setProps;
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '0', '5']);
        setProps({ rows: [{ id: 5 }, { id: 0 }, { id: 10 }] });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['5', '0', '10']);
    });
    it('should sort string column when clicking the header cell', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps}/>
      </div>);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
    });
    it('should sort boolean column when clicking the header cell', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps}/>
      </div>);
        var header = internal_test_utils_1.screen
            .getByRole('columnheader', { name: 'isPublished' })
            .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma', 'Nike']);
    });
    it('should only allow ascending sorting using sortingOrder', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} sortingOrder={['asc']}/>
      </div>);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    });
    it('should only allow ascending and initial sorting using sortingOrder', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} sortingOrder={['asc', null]}/>
      </div>);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });
    it('should only allow ascending and descending sorting using sortingOrder', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} sortingOrder={['desc', 'asc']}/>
      </div>);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
    });
    it('should allow per-column sortingOrder override', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} sortingOrder={['asc', 'desc']} columns={[{ field: 'brand', sortingOrder: ['desc', 'asc'] }]}/>
      </div>);
        var header = (0, helperFn_1.getColumnHeaderCell)(0);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
    });
    it('should keep rows sorted when rows prop change', function () {
        function TestCase(props) {
            var rows = props.rows;
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} rows={rows} sortModel={[
                    {
                        field: 'brand',
                        sort: 'asc',
                    },
                ]}/>
        </div>);
        }
        var setProps = render(<TestCase rows={baselineProps.rows}/>).setProps;
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        setProps({
            rows: [
                {
                    id: 3,
                    brand: 'Asics',
                },
                {
                    id: 4,
                    brand: 'RedBull',
                },
                {
                    id: 5,
                    brand: 'Hugo',
                },
            ],
        });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics', 'Hugo', 'RedBull']);
    });
    it('should support server-side sorting', function () {
        function TestCase(props) {
            var rows = props.rows;
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} sortingMode="server" rows={rows} sortModel={[
                    {
                        field: 'brand',
                        sort: 'desc',
                    },
                ]}/>
        </div>);
        }
        var rows = [
            {
                id: 3,
                brand: 'Asics',
            },
            {
                id: 4,
                brand: 'RedBull',
            },
            {
                id: 5,
                brand: 'Hugo',
            },
        ];
        var setProps = render(<TestCase rows={[rows[0], rows[1]]}/>).setProps;
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics', 'RedBull']);
        setProps({ rows: rows });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics', 'RedBull', 'Hugo']);
    });
    it('should support new dataset', function () {
        function TestCase(props) {
            var rows = props.rows, columns = props.columns;
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={isJSDOM} rows={rows} columns={columns}/>
        </div>);
        }
        var setProps = render(<TestCase {...baselineProps}/>).setProps;
        var header = internal_test_utils_1.screen
            .getByRole('columnheader', { name: 'brand' })
            .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        var newData = {
            rows: [
                {
                    id: 0,
                    country: 'France',
                },
                {
                    id: 1,
                    country: 'UK',
                },
                {
                    id: 12,
                    country: 'US',
                },
            ],
            columns: [{ field: 'country' }],
        };
        setProps(newData);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['France', 'UK', 'US']);
    });
    it('should support new dataset in control mode', function () {
        function TestCase(props) {
            var rows = props.rows, columns = props.columns;
            var _a = React.useState(), sortModel = _a[0], setSortModel = _a[1];
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={isJSDOM} rows={rows} columns={columns} sortModel={sortModel} onSortModelChange={function (newSortModel) { return setSortModel(newSortModel); }}/>
        </div>);
        }
        var setProps = render(<TestCase {...baselineProps}/>).setProps;
        var header = internal_test_utils_1.screen
            .getByRole('columnheader', { name: 'brand' })
            .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        internal_test_utils_1.fireEvent.click(header);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        var newData = {
            rows: [
                {
                    id: 0,
                    country: 'France',
                },
                {
                    id: 1,
                    country: 'UK',
                },
                {
                    id: 12,
                    country: 'US',
                },
            ],
            columns: [{ field: 'country' }],
        };
        setProps(newData);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['France', 'UK', 'US']);
    });
    it('should clear the sorting col when passing an empty sortModel', function () {
        function TestCase(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} {...props}/>
        </div>);
        }
        var setProps = render(<TestCase sortModel={[{ field: 'brand', sort: 'asc' }]}/>).setProps;
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        setProps({ sortModel: [] });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });
    describe('prop: initialState.sorting', function () {
        function Test(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} {...props}/>
        </div>);
        }
        it('should allow to initialize the sortModel', function () {
            render(<Test initialState={{
                    sorting: {
                        sortModel: [
                            {
                                field: 'brand',
                                sort: 'asc',
                            },
                        ],
                    },
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        });
        it('should use the control state upon the initialize state when both are defined', function () {
            render(<Test sortModel={[
                    {
                        field: 'brand',
                        sort: 'desc',
                    },
                ]} initialState={{
                    sorting: {
                        sortModel: [
                            {
                                field: 'brand',
                                sort: 'asc',
                            },
                        ],
                    },
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
        });
        it('should not update the sort order when updating the initial state', function () {
            var setProps = render(<Test initialState={{
                    sorting: {
                        sortModel: [
                            {
                                field: 'brand',
                                sort: 'asc',
                            },
                        ],
                    },
                }}/>).setProps;
            setProps({
                initialState: {
                    sorting: {
                        sortModel: [
                            {
                                field: 'brand',
                                sort: 'desc',
                            },
                        ],
                    },
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        });
        it('should allow to update the sorting when initialized with initialState', function () {
            render(<Test initialState={{
                    sorting: {
                        sortModel: [
                            {
                                field: 'brand',
                                sort: 'asc',
                            },
                        ],
                    },
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getAllByRole('columnheader')[0]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
        });
        it('should not allow to initialize the sorting with several items', function () {
            expect(function () {
                render(<Test columns={[{ field: 'id', type: 'number' }, { field: 'brand' }]} rows={[
                        {
                            id: 0,
                            brand: 'Nike',
                        },
                        {
                            id: 1,
                            brand: 'Nike',
                        },
                        {
                            id: 2,
                            brand: 'Adidas',
                        },
                        {
                            id: 3,
                            brand: 'Puma',
                        },
                    ]} initialState={{
                        sorting: {
                            sortModel: [
                                {
                                    field: 'brand',
                                    sort: 'asc',
                                },
                                {
                                    field: 'id',
                                    sort: 'desc',
                                },
                            ],
                        },
                    }}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2', '0', '1', '3']);
            }).toErrorDev('MUI X: The `sortModel` can only contain a single item when the `disableMultipleColumnsSorting` prop is set to `true`.');
        });
    });
    it('should apply the sortModel prop correctly on GridApiRef update row data', function () {
        var apiRef;
        function TestCase() {
            apiRef = (0, x_data_grid_1.useGridApiRef)();
            var sortModel = [{ field: 'brand', sort: 'asc' }];
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} apiRef={apiRef} sortModel={sortModel}/>
        </div>);
        }
        render(<TestCase />);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }]); });
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Patagonia' }]); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Fila', 'Patagonia', 'Puma']);
    });
    it('should update the sorting model on columns change', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Demo(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={isJSDOM} columns={columns} sortModel={[{ field: 'brand', sort: 'asc' }]} onSortModelChange={onSortModelChange} {...props}/>
        </div>);
        }
        var columns, rows, onSortModelChange, setProps;
        return __generator(this, function (_a) {
            columns = [{ field: 'id' }, { field: 'brand' }];
            rows = [
                { id: 0, brand: 'Nike' },
                { id: 1, brand: 'Adidas' },
                { id: 2, brand: 'Puma' },
            ];
            onSortModelChange = (0, sinon_1.spy)();
            setProps = render(<Demo rows={rows}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
            setProps({ columns: [{ field: 'id' }] });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2']);
            expect(onSortModelChange.callCount).to.equal(2);
            expect(onSortModelChange.lastCall.firstArg).to.deep.equal([]);
            return [2 /*return*/];
        });
    }); });
    // See https://github.com/mui/mui-x/issues/9204
    it('should not clear the sorting model when both columns and sortModel change', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Demo(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={isJSDOM} columns={columns} sortModel={[{ field: 'brand', sort: 'asc' }]} onSortModelChange={onSortModelChange} {...props}/>
        </div>);
        }
        var columns, rows, onSortModelChange, setProps;
        return __generator(this, function (_a) {
            columns = [{ field: 'id' }, { field: 'brand' }];
            rows = [
                { id: 0, brand: 'Nike' },
                { id: 1, brand: 'Adidas' },
                { id: 2, brand: 'Puma' },
            ];
            onSortModelChange = (0, sinon_1.spy)();
            setProps = render(<Demo rows={rows}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
            setProps({ columns: [{ field: 'id' }], sortModel: [{ field: 'id', sort: 'desc' }] });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2', '1', '0']);
            expect(onSortModelChange.callCount).to.equal(0);
            return [2 /*return*/];
        });
    }); });
    describe('getSortComparator', function () {
        it('should allow to define sort comparators depending on the sort direction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cols, rows, header;
            return __generator(this, function (_a) {
                cols = [
                    {
                        field: 'value',
                        getSortComparator: function (sortDirection) {
                            var modifier = sortDirection === 'desc' ? -1 : 1;
                            return function (value1, value2, cellParams1, cellParams2) {
                                if (value1 === null) {
                                    return 1;
                                }
                                if (value2 === null) {
                                    return -1;
                                }
                                return (modifier * (0, x_data_grid_1.gridStringOrNumberComparator)(value1, value2, cellParams1, cellParams2));
                            };
                        },
                    },
                ];
                rows = [
                    { id: 1, value: 'a' },
                    { id: 2, value: null },
                    { id: 3, value: 'b' },
                    { id: 4, value: null },
                ];
                render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={isJSDOM} columns={cols} rows={rows}/>
        </div>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['a', '', 'b', '']);
                header = (0, helperFn_1.getColumnHeaderCell)(0);
                internal_test_utils_1.fireEvent.click(header);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['a', 'b', '', '']);
                internal_test_utils_1.fireEvent.click(header);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['b', 'a', '', '']);
                return [2 /*return*/];
            });
        }); });
    });
    describe('Header class names', function () {
        it('should have the sortable class when the column is sortable', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand', sortable: true }]}/>
        </div>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).to.have.class('MuiDataGrid-columnHeader--sortable');
        });
        it('should not have the sortable class when the column is not sortable', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand', sortable: false }]}/>
        </div>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).not.to.have.class('MuiDataGrid-columnHeader--sortable');
        });
        it('should not have the sortable class when column sorting is disabled', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} disableColumnSorting columns={[{ field: 'brand' }]}/>
        </div>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).not.to.have.class('MuiDataGrid-columnHeader--sortable');
        });
    });
});

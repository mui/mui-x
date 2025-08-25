"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var x_data_grid_1 = require("@mui/x-data-grid");
var locales_1 = require("@mui/x-data-grid/locales");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var styles_1 = require("@mui/material/styles");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
var getVariable = function (name) { return (0, helperFn_1.$)('.MuiDataGrid-root').style.getPropertyValue(name); };
describe('<DataGrid /> - Layout & warnings', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        rows: [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
        ],
        columns: [{ field: 'brand' }],
    };
    describe('immutable rows', function () {
        it('should throw an error if rows props is being mutated', function () {
            expect(function () {
                // We don't want to freeze baselineProps.rows
                var rows = __spreadArray([], baselineProps.rows, true);
                render(<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} rows={rows}/>
          </div>);
                rows.push({ id: 3, brand: 'Louis Vuitton' });
            }).to.throw();
        });
        // See https://github.com/mui/mui-x/issues/5411
        it('should fail silently if not possible to freeze', function () {
            expect(function () {
                // For example, MobX
                // https://github.com/mobxjs/mobx/blob/e60b36c9c78ff9871be1bd324831343c279dd69f/packages/mobx/src/types/observablearray.ts#L115
                var rows = new Proxy(baselineProps.rows, {
                    preventExtensions: function () {
                        throw new Error('Freezing is not supported');
                    },
                });
                render(<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} rows={rows}/>
          </div>);
            }).not.to.throw();
        });
    });
    // Need layout to be able to measure the columns
    describe.skipIf(skipIf_1.isJSDOM)('Layout', function () {
        it('should resize the width of the columns', function () { return __awaiter(void 0, void 0, void 0, function () {
            function TestCase(props) {
                var _a = props.width, width = _a === void 0 ? 300 : _a;
                return (<div style={{ width: width, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps}/>
          </div>);
            }
            var _a, container, setProps, rect;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<TestCase width={300}/>), container = _a.container, setProps = _a.setProps;
                        rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
                        expect(rect.width).to.equal(300 - 2);
                        setProps({ width: 400 });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
                                expect(rect.width).to.equal(400 - 2);
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Adaptation of describeConformance()
        describe('MUI component API', function () {
            it("attaches the ref", function () {
                var _a;
                var ref = React.createRef();
                var container = render(<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} ref={ref}/>
          </div>).container;
                expect(ref.current).to.be.instanceof(window.HTMLDivElement);
                expect(ref.current).to.equal((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild);
            });
            describe('`classes` prop', function () {
                it("should apply the `root` rule name's value as a class to the root grid component", function () {
                    var _a;
                    var classes = {
                        root: 'my_class_name',
                    };
                    var container = render(<div style={{ width: 300, height: 300 }}>
              <x_data_grid_1.DataGrid {...baselineProps} classes={{ root: classes.root }}/>
            </div>).container;
                    expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild).to.have.class(classes.root);
                });
                it('should support class names with underscores', function () {
                    render(<div style={{ width: 300, height: 300 }}>
              <x_data_grid_1.DataGrid {...baselineProps} classes={{ 'columnHeader--sortable': 'foobar' }}/>
            </div>);
                    expect((0, helperFn_1.getColumnHeaderCell)(0)).to.have.class('foobar');
                });
            });
            it('applies the className to the root component', function () {
                var _a;
                function randomStringValue() {
                    return "r".concat(Math.random().toString(36).slice(2));
                }
                var className = randomStringValue();
                var container = render(<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} className={className}/>
          </div>).container;
                expect(document.querySelector(".".concat(className))).to.equal((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild);
            });
            it('should support columns.valueGetter using direct row access', function () {
                var columns = [
                    { field: 'id' },
                    { field: 'firstName' },
                    { field: 'lastName' },
                    {
                        field: 'fullName',
                        valueGetter: function (value, row) { return "".concat(row.firstName || '', " ").concat(row.lastName || ''); },
                    },
                ];
                var rows = [
                    { id: 1, lastName: 'Snow', firstName: 'Jon' },
                    { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
                ];
                render(<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
          </div>);
                expect((0, helperFn_1.getColumnValues)(3)).to.deep.equal(['Jon Snow', 'Cersei Lannister']);
            });
        });
        describe('layout warnings', function () {
            it('should error if the container has no intrinsic height', function () {
                expect(function () {
                    render(<div style={{ width: 300, height: 0 }}>
              <x_data_grid_1.DataGrid {...baselineProps}/>
            </div>);
                    // Use timeout to allow simpler tests in JSDOM.
                }).toErrorDev('MUI X: useResizeContainer - The parent DOM element of the Data Grid has an empty height.');
            });
            it('should error if the container has no intrinsic width', function () {
                expect(function () {
                    render(<div style={{ width: 0 }}>
              <div style={{ width: '100%', height: 300 }}>
                <x_data_grid_1.DataGrid {...baselineProps}/>
              </div>
            </div>);
                    // Use timeout to allow simpler tests in JSDOM.
                }).toErrorDev('MUI X: useResizeContainer - The parent DOM element of the Data Grid has an empty width');
            });
        });
        describe('swallow warnings', function () {
            beforeEach(function () {
                (0, sinon_1.stub)(console, 'error');
            });
            afterEach(function () {
                // @ts-expect-error beforeEach side effect
                console.error.restore();
            });
            it('should have a stable height if the parent container has no intrinsic height', function () {
                var _a, _b;
                render(<div>
            <p>The table keeps growing... and growing...</p>
            <x_data_grid_1.DataGrid {...baselineProps}/>
          </div>);
                var firstHeight = (_a = (0, helperFn_1.grid)('root')) === null || _a === void 0 ? void 0 : _a.clientHeight;
                var secondHeight = (_b = (0, helperFn_1.grid)('root')) === null || _b === void 0 ? void 0 : _b.clientHeight;
                expect(firstHeight).to.equal(secondHeight);
            });
        });
        describe('column width', function () {
            it('should set the columns width to 100px by default', function () {
                var rows = [
                    {
                        id: 1,
                        username: 'John Doe',
                        age: 30,
                    },
                ];
                var columns = [
                    {
                        field: 'id',
                    },
                    {
                        field: 'name',
                    },
                    {
                        field: 'age',
                    },
                ];
                render(<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                internal_test_utils_1.screen.getAllByRole('columnheader').forEach(function (col) {
                    expect(col).toHaveInlineStyle({ width: '100px' });
                });
            });
            it('should set the columns width value to what is provided', function () {
                var rows = [
                    {
                        id: 1,
                        username: 'John Doe',
                        age: 30,
                    },
                ];
                var colWidthValues = [50, 50, 200];
                var columns = [
                    {
                        field: 'id',
                        width: colWidthValues[0],
                    },
                    {
                        field: 'name',
                        width: colWidthValues[1],
                    },
                    {
                        field: 'age',
                        width: colWidthValues[2],
                    },
                ];
                render(<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                internal_test_utils_1.screen.getAllByRole('columnheader').forEach(function (col, index) {
                    expect(col).toHaveInlineStyle({ width: "".concat(colWidthValues[index], "px") });
                });
            });
            it('should set the first column to be twice as wide as the second one', function () {
                var rows = [
                    {
                        id: 1,
                        username: 'John Doe',
                    },
                ];
                var columns = [
                    {
                        field: 'id',
                        minWidth: 0,
                        flex: 1,
                    },
                    {
                        field: 'name',
                        minWidth: 0,
                        flex: 0.5,
                    },
                ];
                render(<div style={{ width: 602, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                var firstColumn = (0, helperFn_1.getColumnHeaderCell)(0);
                var secondColumn = (0, helperFn_1.getColumnHeaderCell)(1);
                expect(firstColumn.offsetWidth).to.equal(2 * secondColumn.offsetWidth);
            });
            it('should set the first column to its `minWidth` and the second one to the remaining space', function () {
                var rows = [
                    {
                        id: 1,
                        username: 'John Doe',
                    },
                ];
                var columns = [
                    {
                        field: 'id',
                        flex: 1,
                        minWidth: 100,
                    },
                    {
                        field: 'name',
                        flex: 1000,
                    },
                ];
                render(<div style={{ width: 400, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                expect((0, helperFn_1.getColumnHeaderCell)(0).offsetWidth).to.equal(100);
                expect((0, helperFn_1.getColumnHeaderCell)(1).offsetWidth).to.equal(298); // 2px border
            });
            it('should respect `minWidth` when a column is fluid', function () {
                var rows = [
                    {
                        id: 1,
                        username: 'John Doe',
                    },
                ];
                var columns = [
                    {
                        field: 'id',
                        flex: 1,
                        minWidth: 150,
                    },
                    {
                        field: 'name',
                        flex: 0.5,
                    },
                ];
                render(<div style={{ width: 200, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                expect((0, helperFn_1.getColumnHeaderCell)(0).offsetWidth).to.equal(150);
                expect((0, helperFn_1.getColumnHeaderCell)(1).offsetWidth).to.equal(50);
            });
            it('should use `minWidth` on flex columns if there is no more space to distribute', function () {
                var rows = [{ id: 1, username: '@MUI', age: 20 }];
                var columns = [
                    { field: 'id', flex: 1, minWidth: 50 },
                    // this column is wider than the viewport width
                    { field: 'username', width: 200 },
                    { field: 'age', flex: 3, minWidth: 50 },
                ];
                render(<div style={{ width: 100, height: 200 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                expect((0, helperFn_1.getColumnHeaderCell)(0).offsetWidth).to.equal(50);
                expect((0, helperFn_1.getColumnHeaderCell)(1).offsetWidth).to.equal(200);
                expect((0, helperFn_1.getColumnHeaderCell)(2).offsetWidth).to.equal(50);
            });
            it('should ignore `minWidth` on flex columns when computed width is greater', function () {
                var rows = [{ id: 1, username: '@MUI', age: 20 }];
                var columns = [
                    { field: 'id', flex: 1, minWidth: 150 },
                    { field: 'username', width: 200 },
                    { field: 'age', flex: 0.3, minWidth: 50 },
                ];
                render(
                // width 850px + 2px border
                <div style={{ width: 852, height: 200 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                expect((0, helperFn_1.getColumnHeaderCell)(0).offsetWidth).to.equal(500);
                expect((0, helperFn_1.getColumnHeaderCell)(1).offsetWidth).to.equal(200);
                expect((0, helperFn_1.getColumnHeaderCell)(2).offsetWidth).to.equal(150);
            });
            it('should respect `maxWidth` when a column is fluid', function () {
                var rows = [
                    {
                        id: 1,
                        username: 'John Doe',
                    },
                ];
                var columns = [
                    {
                        field: 'id',
                        flex: 1,
                        maxWidth: 100,
                    },
                    {
                        field: 'name',
                        width: 50,
                    },
                ];
                render(<div style={{ width: 200, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                var firstColumn = (0, helperFn_1.getColumnHeaderCell)(0);
                expect(firstColumn).toHaveInlineStyle({
                    width: '100px',
                });
            });
            it('should split the columns equally if they are all flex', function () {
                var rows = [
                    {
                        id: 1,
                        name: 'John Doe',
                        age: 30,
                    },
                ];
                var columns = [
                    {
                        field: 'id',
                        flex: 1,
                    },
                    {
                        field: 'name',
                        flex: 1,
                    },
                    {
                        field: 'age',
                        flex: 1,
                    },
                ];
                var containerWidth = 408;
                render(
                // 2px border
                <div style={{ width: containerWidth + 2, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows}/>
          </div>);
                var expectedWidth = containerWidth / 3;
                expect((0, helperFn_1.getColumnHeaderCell)(0).offsetWidth).to.be.equal(expectedWidth);
                expect((0, helperFn_1.getColumnHeaderCell)(1).offsetWidth).to.be.equal(expectedWidth);
                expect((0, helperFn_1.getColumnHeaderCell)(2).offsetWidth).to.be.equal(expectedWidth);
            });
            it('should handle hidden columns', function () {
                var rows = [{ id: 1, firstName: 'Jon' }];
                var columns = [
                    { field: 'id', headerName: 'ID', flex: 1 },
                    {
                        field: 'firstName',
                        headerName: 'First name',
                    },
                ];
                render(<div style={{ width: 200, height: 300 }}>
            <x_data_grid_1.DataGrid rows={rows} columns={columns} initialState={{ columns: { columnVisibilityModel: { firstName: false } } }}/>
          </div>);
                var firstColumn = (0, helperFn_1.getColumnHeaderCell)(0);
                expect(firstColumn).toHaveInlineStyle({
                    width: '198px', // because of the 2px border
                });
            });
            it('should resize flex: 1 column when changing columnVisibilityModel to avoid exceeding grid width', function () {
                function TestCase(props) {
                    return (<div style={{ width: 300, height: 500 }}>
              <x_data_grid_1.DataGrid {...props}/>
            </div>);
                }
                var setProps = render(<TestCase rows={[
                        {
                            id: 1,
                            first: 'Mike',
                            age: 11,
                        },
                        {
                            id: 2,
                            first: 'Jack',
                            age: 11,
                        },
                        {
                            id: 3,
                            first: 'Mike',
                            age: 20,
                        },
                    ]} columns={[
                        { field: 'id', flex: 1 },
                        { field: 'first', width: 100 },
                        { field: 'age', width: 50 },
                    ]} columnVisibilityModel={{ age: false }}/>).setProps;
                var firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
                expect(firstColumn).toHaveInlineStyle({
                    width: '198px', // because of the 2px border
                });
                setProps({
                    columnVisibilityModel: {},
                });
                firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
                expect(firstColumn).toHaveInlineStyle({
                    width: '148px', // because of the 2px border
                });
            });
            it('should be rerender invariant', function () {
                function Test() {
                    var columns = [{ field: 'id', headerName: 'ID', flex: 1 }];
                    return (<div style={{ width: 200, height: 300 }}>
              <x_data_grid_1.DataGrid rows={[]} columns={columns}/>
            </div>);
                }
                var setProps = render(<Test />).setProps;
                setProps({});
                var firstColumn = (0, helperFn_1.getColumnHeaderCell)(0);
                expect(firstColumn).toHaveInlineStyle({
                    width: '198px', // because of the 2px border
                });
            });
            it('should set the columns width so that if fills the remaining width when "checkboxSelection" is used and the columns have "flex" set', function () {
                var rows = [
                    {
                        id: 1,
                        username: 'John Doe',
                    },
                ];
                var columns = [
                    {
                        field: 'id',
                        flex: 1,
                    },
                    {
                        field: 'name',
                        flex: 0.5,
                    },
                ];
                var totalWidth = 700;
                render(<div style={{ width: totalWidth, height: 300 }}>
            <x_data_grid_1.DataGrid columns={columns} rows={rows} checkboxSelection/>
          </div>);
                expect(Array.from(document.querySelectorAll('[role="columnheader"]')).reduce(function (width, item) { return width + item.clientWidth; }, 0)).to.equal(totalWidth - 2);
            });
        });
        describe('autoHeight', function () {
            it('should have the correct intrinsic height', function () {
                var columnHeaderHeight = 40;
                var rowHeight = 30;
                render(<div style={{ width: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} columnHeaderHeight={columnHeaderHeight} rowHeight={rowHeight} autoHeight/>
          </div>);
                var rowsHeight = rowHeight * baselineProps.rows.length;
                expect((0, helperFn_1.$)('.MuiDataGrid-main').clientHeight).to.equal(columnHeaderHeight + rowsHeight);
                expect((0, helperFn_1.$)('.MuiDataGrid-virtualScroller').clientHeight).to.equal(columnHeaderHeight + rowsHeight);
            });
            it('should have the correct intrinsic height inside of a flex container', function () {
                var columnHeaderHeight = 40;
                var rowHeight = 30;
                render(<div style={{ display: 'flex' }}>
            <x_data_grid_1.DataGrid {...baselineProps} columnHeaderHeight={columnHeaderHeight} rowHeight={rowHeight} autoHeight/>
          </div>);
                var rowsHeight = rowHeight * baselineProps.rows.length;
                expect((0, helperFn_1.$)('.MuiDataGrid-main').clientHeight).to.equal(columnHeaderHeight + rowsHeight);
                expect((0, helperFn_1.$)('.MuiDataGrid-virtualScroller').clientHeight).to.equal(columnHeaderHeight + rowsHeight);
            });
            // On MacOS the scrollbar has zero width
            it.skipIf(skipIf_1.isOSX)('should include the scrollbar in the intrinsic height when there are more columns to show', function () {
                var _a;
                var columnHeaderHeight = 40;
                var rowHeight = 30;
                var apiRef;
                function Test() {
                    apiRef = (0, x_data_grid_1.useGridApiRef)();
                    return (<div style={{ width: 150 }}>
                <x_data_grid_1.DataGrid {...baselineProps} apiRef={apiRef} columnHeaderHeight={columnHeaderHeight} rowHeight={rowHeight} columns={[{ field: 'brand' }, { field: 'year' }]} autoHeight/>
              </div>);
                }
                render(<Test />);
                var scrollbarSize = ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.dimensions.scrollbarSize) || 0;
                expect(scrollbarSize).not.to.equal(0);
                expect((0, helperFn_1.grid)('main').clientHeight).to.equal(scrollbarSize + columnHeaderHeight + rowHeight * baselineProps.rows.length);
            });
            it('should give some space to the noRows overlay', function () {
                var rowHeight = 30;
                render(<div style={{ width: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} rows={[]} rowHeight={rowHeight} autoHeight/>
          </div>);
                expect((0, helperFn_1.$)('.MuiDataGrid-overlay').clientHeight).to.equal(rowHeight * 2);
            });
            it('should allow to override the noRows overlay height', function () {
                render(<div style={{ width: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} rows={[]} autoHeight sx={{ '--DataGrid-overlayHeight': '300px' }}/>
          </div>);
                expect(document.querySelector('.MuiDataGrid-overlay').clientHeight).to.equal(300);
            });
            it('should render loading overlay the same height as the content', function () {
                var rowHeight = 30;
                render(<div style={{ width: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} rowHeight={rowHeight} autoHeight loading/>
          </div>);
                expect((0, helperFn_1.$)('.MuiDataGrid-overlay').clientHeight).to.equal(rowHeight * baselineProps.rows.length);
            });
            it('should apply the autoHeight class to the root element', function () {
                render(<div style={{ width: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} autoHeight/>
          </div>);
                expect((0, helperFn_1.grid)('root')).to.have.class(x_data_grid_1.gridClasses.autoHeight);
            });
        });
        // A function test counterpart of ScrollbarOverflowVerticalSnap.
        it('should not have a horizontal scrollbar if not needed', function () {
            function TestCase() {
                var data = (0, x_data_grid_generator_1.useBasicDemoData)(100, 1);
                return (<div style={{ width: 500, height: 300 }}>
            <x_data_grid_1.DataGrid {...data}/>
          </div>);
            }
            render(<TestCase />);
            // It should not have a horizontal scrollbar
            expect((0, helperFn_1.gridVar)('--DataGrid-hasScrollX')).to.equal('0');
        });
        // On MacOS the scrollbar has zero width
        it.skipIf(skipIf_1.isOSX)('should have a horizontal scrollbar when there are more columns to show and no rows', function () {
            render(<div style={{ width: 150, height: 300 }}>
            <x_data_grid_1.DataGrid columns={[{ field: 'brand' }, { field: 'year' }]} rows={[]}/>
          </div>);
            expect((0, helperFn_1.gridVar)('--DataGrid-hasScrollX')).to.equal('1');
        });
        it('should not place the overlay on top of the horizontal scrollbar when rows=[]', function () {
            var _a;
            var columnHeaderHeight = 40;
            var height = 300;
            var border = 1;
            var apiRef;
            function Test() {
                apiRef = (0, x_data_grid_1.useGridApiRef)();
                return (<div style={{ width: 100 + 2 * border, height: height + 2 * border }}>
            <x_data_grid_1.DataGrid apiRef={apiRef} rows={[]} columns={[{ field: 'brand' }, { field: 'price' }]} columnHeaderHeight={columnHeaderHeight} hideFooter/>
          </div>);
            }
            render(<Test />);
            var scrollbarSize = ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.dimensions.scrollbarSize) || 0;
            var overlayWrapper = internal_test_utils_1.screen.getByText('No rows').parentElement;
            var expectedHeight = height - columnHeaderHeight - scrollbarSize;
            expect(overlayWrapper).toHaveComputedStyle({ height: "".concat(expectedHeight, "px") });
        });
        it('should respect the maxHeight of the flex parent', function () {
            render(<div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 200,
                }}>
          <x_data_grid_1.DataGrid columns={[{ field: 'id' }]} rows={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]}/>
        </div>);
            expect((0, helperFn_1.grid)('root').offsetHeight).to.equal(200);
        });
        it('should respect the minHeight of the flex parent', function () {
            render(<div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 600,
                }}>
          <x_data_grid_1.DataGrid columns={[{ field: 'id' }]} rows={[{ id: 1 }]}/>
        </div>);
            expect((0, helperFn_1.grid)('root').offsetHeight).to.equal(600);
        });
        it('should update the height on rows count change', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                var _a = React.useState(1), rowCount = _a[0], setRowCount = _a[1];
                var rows = React.useMemo(function () { return Array.from({ length: rowCount }, function (_, id) { return ({ id: id }); }); }, [rowCount]);
                return (<div>
            <button onClick={function () { return setRowCount(function (prev) { return prev + 1; }); }}>Add row</button>
            <button onClick={function () { return setRowCount(function (prev) { return prev - 1; }); }}>Delete row</button>
            <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: 250,
                    }}>
              <x_data_grid_1.DataGrid columns={[{ field: 'id' }]} rows={rows} hideFooter rowHeight={rowHeight} columnHeaderHeight={columnHeaderHeight}/>
            </div>
          </div>);
            }
            var rowHeight, columnHeaderHeight, borderWidth, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowHeight = 52;
                        columnHeaderHeight = 56;
                        borderWidth = 1;
                        user = render(<Test />).user;
                        expect((0, helperFn_1.grid)('root').offsetHeight).to.equal(columnHeaderHeight + rowHeight + 2 * borderWidth);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('Add row'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('Add row'))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.grid)('root').offsetHeight).to.equal(columnHeaderHeight + 3 * rowHeight + 2 * borderWidth);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('Add row'))];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.grid)('root').offsetHeight).to.equal(250);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('Delete row'))];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.grid)('root').offsetHeight).to.equal(columnHeaderHeight + 3 * rowHeight + 2 * borderWidth);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('Delete row'))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('Delete row'))];
                    case 6:
                        _a.sent();
                        expect((0, helperFn_1.grid)('root').offsetHeight).to.equal(columnHeaderHeight + 1 * rowHeight + 2 * borderWidth);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('warnings', function () {
        // TODO: reintroduce chainProptypes that has been removed in https://github.com/mui/mui-x/pull/11303
        it.skip('should raise a warning if trying to use an enterprise feature', function () {
            expect(function () {
                render(<div style={{ width: 150, height: 300 }}>
            {/* @ts-ignore */}
            <x_data_grid_1.DataGrid pagination={false} columns={[]} rows={[]}/>
          </div>);
            }).toErrorDev('MUI X: `<DataGrid pagination={false} />` is not a valid prop.');
        });
        // can't catch render errors in the browser for unknown reason
        // tried try-catch + error boundary + window onError preventDefault
        it.skipIf(!skipIf_1.isJSDOM)('should throw if the rows has no id', function () {
            var rows = [
                {
                    brand: 'Nike',
                },
            ];
            var errorRef = React.createRef();
            expect(function () {
                render(<internal_test_utils_1.ErrorBoundary ref={errorRef}>
            <x_data_grid_1.DataGrid {...baselineProps} rows={rows}/>
          </internal_test_utils_1.ErrorBoundary>);
            }).toErrorDev([
                'The Data Grid component requires all rows to have a unique `id` property',
                internal_test_utils_1.reactMajor < 19 &&
                    'The Data Grid component requires all rows to have a unique `id` property',
                internal_test_utils_1.reactMajor < 19 && 'The above error occurred in the <ForwardRef(DataGrid2)> component',
            ]);
            expect(errorRef.current.errors).to.have.length(1);
            expect(errorRef.current.errors[0].toString()).to.include('The Data Grid component requires all rows to have a unique `id` property');
        });
    });
    describe('localeText', function () {
        it('should support translations in the theme', function () {
            render(<styles_1.ThemeProvider theme={(0, styles_1.createTheme)({}, locales_1.ptBR)}>
          <div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps}/>
          </div>
        </styles_1.ThemeProvider>);
            expect(document.querySelector('[title="Ordenar"]')).not.to.equal(null);
        });
        it('should allow to change localeText on the fly', function () {
            function TestCase(props) {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} showToolbar {...props}/>
          </div>);
            }
            var setProps = render(<TestCase localeText={{ toolbarQuickFilterPlaceholder: 'Recherche' }}/>).setProps;
            expect(internal_test_utils_1.screen.getByPlaceholderText('Recherche')).not.to.equal(null);
            setProps({ localeText: { toolbarQuickFilterPlaceholder: 'Buscar' } });
            expect(internal_test_utils_1.screen.getByPlaceholderText('Buscar')).not.to.equal(null);
        });
    });
    describe('non-strict mode', function () {
        var innerRender = (0, internal_test_utils_1.createRenderer)({ strict: false }).render;
        it.skipIf(!skipIf_1.isJSDOM)('should render in JSDOM', function () {
            innerRender(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps}/>
        </div>);
            expect((0, helperFn_1.getCell)(0, 0).textContent).to.equal('Nike');
        });
    });
    // Doesn't work with mocked window.getComputedStyle
    it.skipIf(skipIf_1.isJSDOM)('should allow style customization using the theme', function () {
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiDataGrid: {
                    styleOverrides: {
                        root: {
                            backgroundColor: 'rgb(255, 0, 0)',
                        },
                        columnHeader: {
                            backgroundColor: 'rgb(255, 255, 0)',
                        },
                        row: {
                            backgroundColor: 'rgb(128, 0, 128)',
                        },
                        cell: {
                            backgroundColor: 'rgb(0, 128, 0)',
                        },
                    },
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps}/>
        </div>
      </styles_1.ThemeProvider>);
        expect(window.getComputedStyle((0, helperFn_1.grid)('root')).backgroundColor).to.equal('rgb(255, 0, 0)');
        expect(window.getComputedStyle((0, helperFn_1.getColumnHeaderCell)(0)).backgroundColor).to.equal('rgb(255, 255, 0)');
        expect(window.getComputedStyle((0, helperFn_1.getRow)(0)).backgroundColor).to.equal('rgb(128, 0, 128)');
        expect(window.getComputedStyle((0, helperFn_1.getCell)(0, 0)).backgroundColor).to.equal('rgb(0, 128, 0)');
    });
    // Doesn't work with mocked window.getComputedStyle
    it.skipIf(skipIf_1.isJSDOM)('should support the sx prop', function () {
        var theme = (0, styles_1.createTheme)({
            palette: {
                primary: {
                    main: 'rgb(0, 0, 255)',
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={[]} rows={[]} sx={{ color: 'primary.main' }}/>
        </div>
      </styles_1.ThemeProvider>);
        expect((0, helperFn_1.grid)('root')).toHaveComputedStyle({
            color: 'rgb(0, 0, 255)',
        });
    });
    it('should have ownerState in the theme style overrides', function () {
        expect(function () {
            return render(<styles_1.ThemeProvider theme={(0, styles_1.createTheme)({
                    components: {
                        MuiDataGrid: {
                            styleOverrides: {
                                root: function (_a) {
                                    var ownerState = _a.ownerState;
                                    return (__assign({}, (ownerState.columns && {})));
                                },
                            },
                        },
                    },
                })}>
          <div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps}/>
          </div>
        </styles_1.ThemeProvider>);
        }).not.to.throw();
    });
    it('should not render the "no rows" overlay when transitioning the loading prop from false to true', function () {
        var NoRowsOverlay = (0, sinon_1.spy)(function () { return null; });
        function TestCase(props) {
            return (<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} slots={{ noRowsOverlay: NoRowsOverlay }} {...props}/>
        </div>);
        }
        var setProps = render(<TestCase rows={[]} loading/>).setProps;
        expect(NoRowsOverlay.callCount).to.equal(0);
        setProps({ loading: false, rows: [{ id: 1 }] });
        expect(NoRowsOverlay.callCount).to.equal(0);
    });
    it('should render the "no rows" overlay when changing the loading to false but not changing the rows prop', function () {
        var NoRowsOverlay = (0, sinon_1.spy)(function () { return null; });
        function TestCase(props) {
            return (<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} slots={{ noRowsOverlay: NoRowsOverlay }} {...props}/>
        </div>);
        }
        var rows = [];
        var setProps = render(<TestCase rows={rows} loading/>).setProps;
        expect(NoRowsOverlay.callCount).to.equal(0);
        setProps({ loading: false });
        expect(NoRowsOverlay.callCount).not.to.equal(0);
    });
    // Doesn't work with mocked window.getComputedStyle
    describe.skipIf(skipIf_1.isJSDOM)('should not overflow parent', function () {
        var rows = [{ id: 1, username: '@MUI', age: 20 }];
        var columns = [
            { field: 'id', width: 300 },
            { field: 'username', width: 300 },
        ];
        it('grid container', function () {
            render(<div style={{ maxWidth: 400 }}>
          <div style={{ display: 'grid' }}>
            <x_data_grid_1.DataGrid autoHeight columns={columns} rows={rows}/>
          </div>
        </div>);
            expect((0, helperFn_1.grid)('root')).toHaveComputedStyle({ width: '400px' });
        });
        it('flex container', function () {
            render(<div style={{ maxWidth: 400 }}>
          <div style={{ display: 'flex' }}>
            <x_data_grid_1.DataGrid autoHeight columns={columns} rows={rows}/>
          </div>
        </div>);
            expect((0, helperFn_1.grid)('root')).toHaveComputedStyle({ width: '400px' });
        });
    });
    // See https://github.com/mui/mui-x/issues/8737
    // Need layout
    it.skipIf(skipIf_1.isJSDOM)('should not add horizontal scrollbar when .MuiDataGrid-main has border', function () { return __awaiter(void 0, void 0, void 0, function () {
        var virtualScroller, initialVirtualScrollerWidth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<div style={{ height: 300, width: 400, display: 'flex' }}>
          <x_data_grid_1.DataGrid rows={[{ id: 1 }]} columns={[{ field: 'id', flex: 1 }]} sx={{ '.MuiDataGrid-main': { border: '2px solid red' } }}/>
        </div>);
                    virtualScroller = (0, helperFn_1.$)('.MuiDataGrid-virtualScroller');
                    initialVirtualScrollerWidth = virtualScroller.clientWidth;
                    // It should not have a horizontal scrollbar
                    expect(getVariable('--DataGrid-hasScrollX')).to.equal('0');
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, helperFn_1.sleep)(200)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    // The width should not increase infinitely
                    expect(virtualScroller.clientWidth).to.equal(initialVirtualScrollerWidth);
                    return [2 /*return*/];
            }
        });
    }); });
    // See https://github.com/mui/mui-x/issues/8689#issuecomment-1582616570
    // Need layout
    it.skipIf(skipIf_1.isJSDOM)('should not add scrollbars when the parent container has fractional size', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            render(<div style={{ height: 300.5, width: 400 }}>
          <x_data_grid_1.DataGrid rows={[]} columns={[{ field: 'id', flex: 1 }]}/>
        </div>);
            // It should not have a horizontal scrollbar
            expect(getVariable('--DataGrid-hasScrollX')).to.equal('0');
            // It should not have a vertical scrollbar
            expect(getVariable('--DataGrid-hasScrollY')).to.equal('0');
            return [2 /*return*/];
        });
    }); });
    // See https://github.com/mui/mui-x/issues/9510
    // Need layout
    it.skipIf(skipIf_1.isJSDOM)('should not exceed maximum call stack size when the parent container has fractional width', function () {
        render(<div style={{ height: 300, width: 400.6 }}>
          <x_data_grid_1.DataGrid rows={[{ id: 1 }]} columns={[{ field: 'id', flex: 1 }]}/>
        </div>);
    });
    // See https://github.com/mui/mui-x/issues/9550
    // Need layout
    it.skipIf(skipIf_1.isJSDOM)('should not exceed maximum call stack size with duplicated flex fields', function () {
        expect(function () {
            render(<div style={{ height: 200, width: 400 }}>
            <x_data_grid_1.DataGrid rows={[{ id: 1 }]} columns={[
                    { field: 'id', flex: 1 },
                    { field: 'id', flex: 1 },
                ]}/>
          </div>);
        }).toErrorDev([
            'Encountered two children with the same key, `id`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.',
            'Encountered two children with the same key, `id`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.',
        ]);
    });
    // See https://github.com/mui/mui-x/issues/9550#issuecomment-1619020477
    // Need layout
    it.skipIf(skipIf_1.isJSDOM)('should not exceed maximum call stack size caused by floating point precision error', function () {
        render(<div style={{ height: 300, width: 1584 }}>
          <x_data_grid_1.DataGrid rows={[{ id: 1 }]} columns={[
                { field: '1', flex: 1 },
                { field: '2', flex: 1 },
                { field: '3', flex: 1 },
                { field: '4', flex: 1 },
                { field: '5', flex: 1 },
                { field: '6', flex: 1 },
            ]}/>
        </div>);
    });
    // See https://github.com/mui/mui-x/issues/15721
    // Need layout
    it.skipIf(skipIf_1.isJSDOM)('should not exceed maximum call stack size caused by subpixel rendering', function () {
        render(<div style={{ width: 702.37 }}>
          <x_data_grid_1.DataGrid columns={[
                { field: '1', flex: 1 },
                { field: '2', flex: 1 },
            ]} rows={[]}/>
        </div>);
    });
});

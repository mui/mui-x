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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var helperFn_1 = require("test/utils/helperFn");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Pagination', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function BaselineTestCase(props) {
        var _a = props.height, height = _a === void 0 ? 300 : _a, other = __rest(props, ["height"]);
        apiRef = (0, x_data_grid_1.useGridApiRef)();
        var basicData = (0, x_data_grid_generator_1.useBasicDemoData)(100, 2);
        return (<div style={{ width: 300, height: height }}>
        <x_data_grid_1.DataGrid {...basicData} apiRef={apiRef} autoHeight={skipIf_1.isJSDOM} {...other}/>
      </div>);
    }
    // Need layouting
    describe.skipIf(skipIf_1.isJSDOM)('prop: paginationModel and onPaginationModelChange', function () {
        it('should display the rows of page given in props', function () {
            render(<BaselineTestCase paginationModel={{ page: 1, pageSize: 1 }} pageSizeOptions={[1]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
        });
        it('should not call onPaginationModelChange on initialisation', function () {
            var onPaginationModelChange = (0, sinon_1.spy)();
            render(<BaselineTestCase paginationModel={{ page: 0, pageSize: 1 }} onPaginationModelChange={onPaginationModelChange} pageSizeOptions={[1]}/>);
            expect(onPaginationModelChange.callCount).to.equal(0);
        });
        it('should allow to update the paginationModel from the outside', function () {
            var setProps = render(<BaselineTestCase paginationModel={{ page: 0, pageSize: 1 }} pageSizeOptions={[1]}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            setProps({ paginationModel: { page: 1, pageSize: 1 } });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
        });
        it('should not apply new page when clicking on next / previous button and onPaginationModelChange is not defined and paginationModel is controlled', function () {
            render(<BaselineTestCase paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1]}/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
        });
        it('should call onPaginationModelChange and apply new page when clicking on next / previous button', function () {
            var onPaginationModelChange = (0, sinon_1.spy)();
            render(<BaselineTestCase onPaginationModelChange={onPaginationModelChange} initialState={{ pagination: { paginationModel: { pageSize: 1 } } }} pageSizeOptions={[1]}/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect(onPaginationModelChange.callCount).to.equal(1);
            expect(onPaginationModelChange.lastCall.args[0].page).to.equal(1);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }));
            expect(onPaginationModelChange.callCount).to.equal(2);
            expect(onPaginationModelChange.lastCall.args[0].page).to.equal(0);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
        });
        it('should apply the new pageSize when clicking on a page size option and onPaginationModelChange is not defined and paginationModel is not controlled', function () {
            render(<BaselineTestCase pageSizeOptions={[1, 2, 3, 100]}/>);
            internal_test_utils_1.fireEvent.mouseDown(internal_test_utils_1.screen.getByLabelText('Rows per page:'));
            expect(internal_test_utils_1.screen.queryAllByRole('option').length).to.equal(4);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.queryAllByRole('option')[1]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
        });
        it('should call onPaginationModelChange and apply the new pageSize when clicking on a page size option and paginationModel is not controlled', function () {
            var onPaginationModelChange = (0, sinon_1.spy)();
            render(<BaselineTestCase onPaginationModelChange={onPaginationModelChange} pageSizeOptions={[1, 2, 3, 100]}/>);
            internal_test_utils_1.fireEvent.mouseDown(internal_test_utils_1.screen.getByLabelText('Rows per page:'));
            expect(internal_test_utils_1.screen.queryAllByRole('option').length).to.equal(4);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.queryAllByRole('option')[1]);
            expect(onPaginationModelChange.callCount).to.equal(1);
            expect(onPaginationModelChange.lastCall.args[0].pageSize).to.equal(2);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
        });
        it('should call onPaginationModelChange with the correct paginationModel when clicking on next / previous button when paginationModel is controlled', function () {
            var onPaginationModelChange = (0, sinon_1.spy)();
            function TestCase(_a) {
                var handlePaginationModelChange = _a.handlePaginationModelChange;
                var _b = React.useState({ pageSize: 1, page: 0 }), paginationModel = _b[0], setPaginationModel = _b[1];
                return (<BaselineTestCase onPaginationModelChange={function (newModel) {
                        handlePaginationModelChange(newModel);
                        setPaginationModel(newModel);
                    }} paginationModel={paginationModel} pageSizeOptions={[1]}/>);
            }
            render(<TestCase handlePaginationModelChange={onPaginationModelChange}/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 1, pageSize: 1 });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }));
            expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 0, pageSize: 1 });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
        });
        it('should call onPaginationModelChange when clicking on next / previous button in "server" mode', function () {
            var onPaginationModelChange = (0, sinon_1.spy)();
            render(<BaselineTestCase onPaginationModelChange={onPaginationModelChange} initialState={{ pagination: { paginationModel: { pageSize: 1 } } }} pageSizeOptions={[1]} paginationMode="server" rowCount={4}/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect(onPaginationModelChange.callCount).to.equal(1);
            expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 1, pageSize: 1 });
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }));
            expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 0, pageSize: 1 });
        });
        it('should not change the state when clicking on next button and a `paginationModel` prop is provided', function () {
            render(<BaselineTestCase paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
        });
        it('should control `paginationModel` state when the prop and the onChange are set', function () {
            function ControlCase() {
                var _a = React.useState({ page: 0, pageSize: 1 }), paginationModel = _a[0], setPaginationModel = _a[1];
                return (<BaselineTestCase paginationModel={paginationModel} onPaginationModelChange={function (newPaginationModel) { return setPaginationModel(newPaginationModel); }} pageSizeOptions={[1]}/>);
            }
            render(<ControlCase />);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
        });
        it('should go to last page when paginationModel is controlled and the current page is greater than the last page', function () {
            var onPaginationModelChange = (0, sinon_1.spy)();
            function TestCasePaginationFilteredData(props) {
                var _a = React.useState({ page: 1, pageSize: 5 }), paginationModel = _a[0], setPaginationModel = _a[1];
                var handlePaginationModelChange = function (newPaginationModel) {
                    onPaginationModelChange(newPaginationModel);
                    setPaginationModel(newPaginationModel);
                };
                return (<BaselineTestCase paginationModel={paginationModel} onPaginationModelChange={handlePaginationModelChange} pageSizeOptions={[5]} {...props}/>);
            }
            var setProps = render(<TestCasePaginationFilteredData />).setProps;
            expect(onPaginationModelChange.callCount).to.equal(0);
            setProps({
                filterModel: {
                    logicOperator: x_data_grid_1.GridLogicOperator.And,
                    items: [
                        {
                            field: 'id',
                            operator: '<=',
                            value: '3',
                        },
                    ],
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3']);
            expect(onPaginationModelChange.callCount).to.equal(1);
            expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 0, pageSize: 5 });
        });
        it('should scroll to the top of the page when changing page', function () {
            var setProps = render(<BaselineTestCase paginationModel={{ page: 0, pageSize: 5 }} pageSizeOptions={[5]}/>).setProps;
            var virtualScroller = document.querySelector(".".concat(x_data_grid_1.gridClasses.virtualScroller));
            virtualScroller.scrollTop = 100;
            setProps({ paginationModel: { page: 1, pageSize: 5 } });
            expect(virtualScroller.scrollTop).to.equal(0);
        });
        it('should display the amount of rows given in props', function () {
            render(<BaselineTestCase paginationModel={{ page: 0, pageSize: 2 }} pageSizeOptions={[2]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
        });
        it('should throw if pageSize exceeds 100', function () {
            render(<BaselineTestCase paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1, 2, 101]}/>);
            expect(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPageSize(101); }).to.throw(/`pageSize` cannot exceed 100 in the MIT version of the DataGrid./);
        });
        it('should call onPaginationModelChange with the correct page when clicking on a page size option when paginationModel is controlled', function () {
            var onPaginationModelChange = (0, sinon_1.spy)();
            render(<BaselineTestCase onPaginationModelChange={onPaginationModelChange} paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1, 2, 3]}/>);
            internal_test_utils_1.fireEvent.mouseDown(internal_test_utils_1.screen.getByLabelText('Rows per page:'));
            expect(internal_test_utils_1.screen.queryAllByRole('option').length).to.equal(3);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.queryAllByRole('option')[1]);
            expect(onPaginationModelChange.callCount).to.equal(1);
            expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ pageSize: 2, page: 0 });
        });
        it('should not change the pageSize state when clicking on a page size option when paginationModel prop is provided', function () {
            render(<BaselineTestCase paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1, 2, 3]}/>);
            internal_test_utils_1.fireEvent.mouseDown(internal_test_utils_1.screen.getByLabelText('Rows per page:'));
            expect(internal_test_utils_1.screen.queryAllByRole('option').length).to.equal(3);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.queryAllByRole('option')[1]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
        });
        it('should display a warning if the prop pageSize is not in the prop pageSizeOptions', function () {
            var pageSize = 12;
            expect(function () {
                render(<BaselineTestCase paginationModel={{ pageSize: pageSize, page: 0 }} pageSizeOptions={[25, 50, 100]}/>);
            }).toWarnDev([
                "MUI X: The page size `".concat(pageSize, "` is not present in the `pageSizeOptions`"),
                internal_test_utils_1.reactMajor < 19 &&
                    "MUI X: The page size `".concat(pageSize, "` is not present in the `pageSizeOptions`"),
            ]);
        });
        it('should not display a warning if the prop pageSize is in the prop pageSizeOptions when it is an array of objects.', function () {
            var pageSize = 10;
            expect(function () {
                render(<BaselineTestCase paginationModel={{ pageSize: pageSize, page: 0 }} pageSizeOptions={[
                        { label: '10', value: 10 },
                        { label: '20', value: 20 },
                        { label: '30', value: 30 },
                    ]}/>);
            }).not.toWarnDev();
        });
        it('should display a warning if the prop pageSize is not in the default pageSizeOptions', function () {
            var pageSize = 12;
            expect(function () {
                render(<BaselineTestCase paginationModel={{ pageSize: pageSize, page: 0 }}/>);
            }).toWarnDev([
                "MUI X: The page size `".concat(pageSize, "` is not present in the `pageSizeOptions`"),
                internal_test_utils_1.reactMajor < 19 &&
                    "MUI X: The page size `".concat(pageSize, "` is not present in the `pageSizeOptions`"),
            ]);
        });
        it('should display a warning if the default pageSize given as props is not in the prop pageSizeOptions', function () {
            expect(function () {
                render(<BaselineTestCase pageSizeOptions={[25, 50]}/>);
            }).toWarnDev([
                "MUI X: The page size `100` is not present in the `pageSizeOptions`",
                internal_test_utils_1.reactMajor < 19 && "MUI X: The page size `100` is not present in the `pageSizeOptions`",
            ]);
        });
        it('should update the pageCount state when updating the paginationModel prop with a lower pageSize value', function () {
            function TestCase(props) {
                var _a = React.useState({ pageSize: 20, page: 0 }), paginationModel = _a[0], setPaginationModel = _a[1];
                return (<BaselineTestCase pageSizeOptions={[10, 20]} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} disableVirtualization {...props}/>);
            }
            var setProps = render(<TestCase />).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.have.length(20);
            setProps({ paginationModel: { pageSize: 10, page: 0 } });
            expect((0, helperFn_1.getColumnValues)(0)).to.have.length(10);
            expect((0, helperFn_1.getCell)(0, 0)).not.to.equal(null);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.have.length(10);
        });
    });
    // Need layout
    describe.skipIf(skipIf_1.isJSDOM)('prop: autoPageSize', function () {
        function TestCaseAutoPageSize(props) {
            var height = props.height, nbRows = props.nbRows, other = __rest(props, ["height", "nbRows"]);
            var data = (0, x_data_grid_generator_1.useBasicDemoData)(nbRows, 10);
            return (<div style={{ width: 300, height: props.height }}>
          <x_data_grid_1.DataGrid columns={data.columns} rows={data.rows} autoPageSize {...other}/>
        </div>);
        }
        it('should give priority to the controlled paginationModel', function () {
            render(<BaselineTestCase autoPageSize paginationModel={{ pageSize: 3, page: 2 }} pageSizeOptions={[3]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['6', '7', '8']);
        });
        it('should always render the same amount of rows and fit the viewport', function () {
            var nbRows = 27;
            var height = 780;
            var columnHeaderHeight = 56;
            var rowHeight = 52;
            render(<TestCaseAutoPageSize nbRows={nbRows} height={height} columnHeaderHeight={columnHeaderHeight} rowHeight={rowHeight}/>);
            var footerHeight = document.querySelector('.MuiDataGrid-footerContainer').clientHeight;
            var expectedFullPageRowsLength = Math.floor((height - columnHeaderHeight - footerHeight) / rowHeight);
            var rows = (0, helperFn_1.getRows)();
            expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            rows = (0, helperFn_1.getRows)();
            expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows - expectedFullPageRowsLength));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }));
            rows = (0, helperFn_1.getRows)();
            expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            rows = (0, helperFn_1.getRows)();
            expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows - 2 * expectedFullPageRowsLength));
            // make sure there is no more pages.
            var nextPageBtn = document.querySelector('.MuiTablePagination-actions button:last-child');
            expect(nextPageBtn).not.to.have.attribute('disabled', 'false'); // next page should be disabled
        });
        it('should update the amount of rows rendered and call onPageSizeChange when changing the table height', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onPaginationModelChange, nbRows, heightBefore, heightAfter, columnHeaderHeight, rowHeight, setProps, footerHeight, expectedViewportRowsLengthBefore, expectedViewportRowsLengthAfter, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onPaginationModelChange = (0, sinon_1.spy)();
                        nbRows = 27;
                        heightBefore = 780;
                        heightAfter = 360;
                        columnHeaderHeight = 56;
                        rowHeight = 52;
                        setProps = render(<TestCaseAutoPageSize nbRows={nbRows} height={heightBefore} columnHeaderHeight={columnHeaderHeight} rowHeight={rowHeight} onPaginationModelChange={onPaginationModelChange}/>).setProps;
                        footerHeight = document.querySelector('.MuiDataGrid-footerContainer').clientHeight;
                        expectedViewportRowsLengthBefore = Math.floor((heightBefore - columnHeaderHeight - footerHeight) / rowHeight);
                        expectedViewportRowsLengthAfter = Math.floor((heightAfter - columnHeaderHeight - footerHeight) / rowHeight);
                        rows = document.querySelectorAll('.MuiDataGrid-virtualScrollerRenderZone [role="row"]');
                        expect(rows.length).to.equal(expectedViewportRowsLengthBefore);
                        setProps({ height: heightAfter });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(document.querySelector('.MuiTablePagination-displayedRows').innerHTML).to.equal("1\u2013".concat(expectedViewportRowsLengthAfter, " of ").concat(nbRows));
                            })];
                    case 1:
                        _a.sent();
                        rows = document.querySelectorAll('.MuiDataGrid-virtualScrollerRenderZone [role="row"]');
                        expect(rows.length).to.equal(expectedViewportRowsLengthAfter);
                        expect(onPaginationModelChange.lastCall.args[0].pageSize).to.equal(expectedViewportRowsLengthAfter);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should react to an update of rowCount when `paginationMode = server`', function () {
        var setProps = render(<BaselineTestCase rowCount={5} paginationModel={{ page: 0, pageSize: 1 }} pageSizeOptions={[1]} paginationMode="server"/>).setProps;
        expect(document.querySelector('.MuiTablePagination-root')).to.have.text('1–1 of 5'); // "–" is not a hyphen, it's an "en dash"
        setProps({ rowCount: 21 });
        expect(document.querySelector('.MuiTablePagination-root')).to.have.text('1–1 of 21');
    });
    describe('server-side pagination', function () {
        function ServerPaginationGrid(props) {
            var _this = this;
            var _a = React.useState([]), rows = _a[0], setRows = _a[1];
            var _b = React.useState({ page: 0, pageSize: 1 }), paginationModel = _b[0], setPaginationModel = _b[1];
            var handlePaginationModelChange = function (newPaginationModel) {
                setPaginationModel(newPaginationModel);
            };
            React.useEffect(function () {
                var active = true;
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var newRows;
                    return __generator(this, function (_a) {
                        newRows = [
                            {
                                id: paginationModel.page,
                            },
                        ];
                        if (!active) {
                            return [2 /*return*/];
                        }
                        setRows(newRows);
                        return [2 /*return*/];
                    });
                }); })();
                return function () {
                    active = false;
                };
            }, [paginationModel.page]);
            return (<div style={{ height: 300, width: 300 }}>
          <x_data_grid_1.DataGrid columns={[{ field: 'id' }]} rows={rows} paginationMeta={{ hasNextPage: props.rowCount === -1 }} paginationModel={paginationModel} pageSizeOptions={[1]} paginationMode="server" onPaginationModelChange={handlePaginationModelChange} {...props}/>
        </div>);
        }
        it('should support server side pagination with known row count', function () {
            render(<ServerPaginationGrid rowCount={3}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
        });
        it('should support server side pagination with unknown row count', function () {
            var setProps = render(<ServerPaginationGrid rowCount={-1}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            expect(internal_test_utils_1.screen.getByText('1–1 of more than 1')).not.to.equal(null);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(internal_test_utils_1.screen.getByText('2–2 of more than 2')).not.to.equal(null);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            setProps({ rowCount: 3 });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2']);
            expect(internal_test_utils_1.screen.getByText('3–3 of 3')).not.to.equal(null);
        });
        it('should support server side pagination with estimated row count', function () {
            var setProps = render(<ServerPaginationGrid rowCount={-1} estimatedRowCount={2}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            expect(internal_test_utils_1.screen.getByText('1–1 of around 2')).not.to.equal(null);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(internal_test_utils_1.screen.getByText('2–2 of more than 2')).not.to.equal(null);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2']);
            expect(internal_test_utils_1.screen.getByText('3–3 of more than 3')).not.to.equal(null);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            setProps({ rowCount: 4 });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['3']);
            expect(internal_test_utils_1.screen.getByText('4–4 of 4')).not.to.equal(null);
        });
    });
    it('should reset page to 0 and scroll to top if sort or filter is applied', function () {
        render(<BaselineTestCase initialState={{ pagination: { paginationModel: { page: 0, pageSize: 50 }, rowCount: 0 } }} pageSizeOptions={[50]}/>);
        var randomScrollTopPostion = 500;
        (0, internal_test_utils_1.act)(function () {
            apiRef.current.setPage(1);
            apiRef.current.scroll({ top: randomScrollTopPostion });
        });
        expect(apiRef.current.state.pagination.paginationModel.page).to.equal(1);
        expect(apiRef.current.getScrollPosition().top).to.equal(randomScrollTopPostion);
        (0, internal_test_utils_1.act)(function () {
            apiRef.current.sortColumn('id', 'asc');
        });
        // page is reset to 0 after sorting
        expect(apiRef.current.state.pagination.paginationModel.page).to.equal(0);
        expect(apiRef.current.getScrollPosition().top).to.equal(0);
        // scroll but stay on the same page
        (0, internal_test_utils_1.act)(function () {
            apiRef.current.scroll({ top: randomScrollTopPostion });
        });
        expect(apiRef.current.getScrollPosition().top).to.equal(randomScrollTopPostion);
        (0, internal_test_utils_1.act)(function () {
            apiRef.current.sortColumn('id', 'desc');
        });
        expect(apiRef.current.getScrollPosition().top).to.equal(0);
        // move to the next page again and scroll
        (0, internal_test_utils_1.act)(function () {
            apiRef.current.setPage(1);
            apiRef.current.scroll({ top: randomScrollTopPostion });
        });
        expect(apiRef.current.state.pagination.paginationModel.page).to.equal(1);
        expect(apiRef.current.getScrollPosition().top).to.equal(randomScrollTopPostion);
        (0, internal_test_utils_1.act)(function () {
            var _a;
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                items: [
                    {
                        field: 'id',
                        value: '1',
                        operator: '>=',
                    },
                ],
            });
        });
        // page and scroll position are reset filtering
        expect(apiRef.current.state.pagination.paginationModel.page).to.equal(0);
        expect(apiRef.current.getScrollPosition().top).to.equal(0);
    });
    it('should make the first cell focusable after changing the page', function () {
        render(<BaselineTestCase initialState={{ pagination: { paginationModel: { pageSize: 1 } } }} pageSizeOptions={[1]}/>);
        fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(0, 0));
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
        expect((0, helperFn_1.getCell)(1, 0)).to.have.attr('tabindex', '0');
    });
    // Need layout
    describe.skipIf(skipIf_1.isJSDOM)('prop: initialState.pagination', function () {
        it('should allow to initialize the paginationModel', function () {
            render(<BaselineTestCase initialState={{
                    pagination: {
                        paginationModel: { pageSize: 2, page: 0 },
                    },
                }} pageSizeOptions={[2, 5]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
        });
        it('should use the paginationModel control state upon the initialize state when both are defined', function () {
            render(<BaselineTestCase paginationModel={{ pageSize: 5, page: 0 }} initialState={{
                    pagination: {
                        paginationModel: { pageSize: 2, page: 0 },
                    },
                }} pageSizeOptions={[2, 5]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4']);
        });
        it('should not update the paginationModel when updating the initial state', function () {
            var setProps = render(<BaselineTestCase initialState={{
                    pagination: {
                        paginationModel: { pageSize: 2, page: 0 },
                    },
                }} pageSizeOptions={[2, 5]}/>).setProps;
            setProps({
                initialState: {
                    pagination: {
                        paginationModel: { pageSize: 5, page: 0 },
                    },
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
        });
        it('should allow to update the paginationModel when initialized with initialState', function () {
            render(<BaselineTestCase initialState={{
                    pagination: {
                        paginationModel: { pageSize: 2, page: 0 },
                    },
                }} pageSizeOptions={[2, 5]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
            internal_test_utils_1.fireEvent.mouseDown(internal_test_utils_1.screen.getByLabelText('Rows per page:'));
            expect(internal_test_utils_1.screen.queryAllByRole('option').length).to.equal(2);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.queryAllByRole('option')[1]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4']);
        });
    });
    // See https://github.com/mui/mui-x/issues/11247
    it('should not throw on deleting the last row of a page > 0', function () {
        var columns = [{ field: 'name' }];
        var rows = [
            { id: 0, name: 'a' },
            { id: 1, name: 'b' },
            { id: 2, name: 'c' },
            { id: 3, name: 'd' },
        ];
        expect(function () {
            var setProps = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={columns} rows={rows} initialState={{ pagination: { paginationModel: { pageSize: 2, page: 1 } } }} pageSizeOptions={[2]}/>
        </div>).setProps;
            setProps({ rows: rows.slice(0, 2) });
        }).not.to.throw();
    });
    it('should log an error if rowCount is used with client-side pagination', function () {
        expect(function () {
            render(<BaselineTestCase paginationMode="client" rowCount={100}/>);
        }).toErrorDev([
            'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect.',
            '`rowCount` is only meant to be used with `paginationMode="server"`.',
        ].join('\n'));
    });
});

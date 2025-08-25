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
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Detail panel', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestCase(_a) {
        var _b = _a.nbRows, nbRows = _b === void 0 ? 20 : _b, other = __rest(_a, ["nbRows"]);
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        var data = (0, x_data_grid_generator_1.useBasicDemoData)(nbRows, 1);
        return (<div style={{ width: 300, height: 302 }}>
        <x_data_grid_pro_1.DataGridPro {...data} apiRef={apiRef} {...other}/>
      </div>);
    }
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not allow to expand rows that do not specify a detail element', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelContent={function (_a) {
                        var id = _a.id;
                        return (Number(id) === 0 ? null : <div />);
                    }}/>).user;
                    cell = (0, helperFn_1.getCell)(0, 0);
                    expect(cell.querySelector('[aria-label="Expand"]')).to.have.attribute('disabled');
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getRow)(0)).toHaveComputedStyle({ marginBottom: '0px' });
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not consider the height of the detail panels when rendering new rows during scroll', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rowHeight, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowHeight = 50;
                    render(<TestCase getDetailPanelHeight={function (_a) {
                        var id = _a.id;
                        return (Number(id) % 2 === 0 ? 1 : 2) * rowHeight;
                    }} // 50px for even rows, otherwise 100px
                     getDetailPanelContent={function () { return <div />; }} rowHeight={rowHeight} rowBufferPx={0} initialState={{
                            detailPanel: {
                                expandedRowIds: new Set([0, 1]),
                            },
                        }}/>);
                    expect((0, helperFn_1.getColumnValues)(1)[0]).to.equal('0');
                    virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, virtualScroller.scrollTo({
                                        // 50 + 50 (detail panel) + 50 + 100 (detail panel * 2)
                                        top: 250,
                                        behavior: 'instant',
                                    })];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getColumnValues)(1)[0]).to.equal('2'); // If there was no expanded row, the first rendered would be 5
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should derive the height from the content if getDetailPanelHeight returns "auto"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rowHeight, detailPanelHeight, user, virtualScrollerContent, detailPanels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowHeight = 50;
                    detailPanelHeight = 100;
                    user = render(<TestCase nbRows={1} rowHeight={rowHeight} getDetailPanelContent={function () { return <div style={{ height: detailPanelHeight }}/>; }} getDetailPanelHeight={function () { return 'auto'; }}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Expand' })[0])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            return expect((0, helperFn_1.getRow)(0).className).to.include(x_data_grid_pro_1.gridClasses['row--detailPanelExpanded']);
                        })];
                case 2:
                    _a.sent();
                    virtualScrollerContent = (0, helperFn_1.$)('.MuiDataGrid-virtualScrollerContent');
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(virtualScrollerContent).toHaveComputedStyle({
                                height: "".concat(rowHeight + detailPanelHeight, "px"),
                            });
                        })];
                case 3:
                    _a.sent();
                    expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                    detailPanels = (0, helperFn_1.$$)('.MuiDataGrid-detailPanel');
                    expect(detailPanels[0]).toHaveComputedStyle({
                        height: "".concat(detailPanelHeight, "px"),
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should update the detail panel height if the content height changes when getDetailPanelHeight returns "auto"', function () { return __awaiter(void 0, void 0, void 0, function () {
        function ExpandableCell() {
            var _a = React.useState(false), expanded = _a[0], setExpanded = _a[1];
            return (<div style={{ height: expanded ? 200 : 100 }}>
            <button onClick={function () { return setExpanded(!expanded); }}>
              {expanded ? 'Decrease' : 'Increase'}
            </button>
          </div>);
        }
        var rowHeight, user, virtualScrollerContent, detailPanels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowHeight = 50;
                    user = render(<TestCase nbRows={1} rowHeight={rowHeight} getDetailPanelContent={function () { return <ExpandableCell />; }} getDetailPanelHeight={function () { return 'auto'; }}/>).user;
                    virtualScrollerContent = (0, helperFn_1.grid)('virtualScrollerContent');
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Expand' }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            return expect((0, helperFn_1.getRow)(0).className).to.include(x_data_grid_pro_1.gridClasses['row--detailPanelExpanded']);
                        })];
                case 2:
                    _a.sent();
                    expect(virtualScrollerContent).toHaveComputedStyle({ height: "".concat(rowHeight + 100, "px") });
                    expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                    detailPanels = (0, helperFn_1.$$)('.MuiDataGrid-detailPanel');
                    expect(detailPanels[0]).toHaveComputedStyle({
                        height: "100px",
                    });
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Increase' }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(virtualScrollerContent).toHaveComputedStyle({ height: "".concat(rowHeight + 200, "px") });
                        })];
                case 4:
                    _a.sent();
                    expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                    expect(detailPanels[0]).toHaveComputedStyle({
                        height: "200px",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // Doesn't work with mocked window.getComputedStyle
    it.skipIf(skipIf_1.isJSDOM)('should position correctly the detail panels', function () {
        var rowHeight = 50;
        var evenHeight = rowHeight;
        var oddHeight = 2 * rowHeight;
        render(<TestCase getDetailPanelHeight={function (_a) {
                var id = _a.id;
                return Number(id) % 2 === 0 ? evenHeight : oddHeight;
            }} getDetailPanelContent={function () { return <div />; }} rowHeight={rowHeight} initialState={{
                detailPanel: {
                    expandedRowIds: new Set([0, 1]),
                },
            }}/>);
        var detailPanels = (0, helperFn_1.$$)('.MuiDataGrid-detailPanel');
        expect(detailPanels[0]).toHaveComputedStyle({
            height: "".concat(evenHeight, "px"),
        });
        expect(detailPanels[1]).toHaveComputedStyle({
            height: "".concat(oddHeight, "px"),
        });
    });
    it('should not render detail panels for non-visible rows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelContent={function (_a) {
                        var id = _a.id;
                        return <div>Row {id}</div>;
                    }} pagination pageSizeOptions={[1]} initialState={{
                            detailPanel: { expandedRowIds: new Set([0]) },
                            pagination: { paginationModel: { pageSize: 1 } },
                        }}/>).user;
                    expect(internal_test_utils_1.screen.queryByText('Row 0')).not.to.equal(null);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByText('Row 0')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should consider the height of the detail panel when scrolling to a cell', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rowHeight, columnHeaderHeight, user, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowHeight = 50;
                    columnHeaderHeight = 50;
                    user = render(<TestCase getDetailPanelHeight={function () { return rowHeight; }} getDetailPanelContent={function () { return <div />; }} rowHeight={rowHeight} columnHeaderHeight={columnHeaderHeight} initialState={{
                            detailPanel: {
                                expandedRowIds: new Set([0]),
                            },
                        }} hideFooter/>).user;
                    virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('[ArrowDown]')];
                case 2:
                    _a.sent();
                    expect(virtualScroller.scrollTop).to.equal(0);
                    return [4 /*yield*/, user.keyboard('[ArrowDown]')];
                case 3:
                    _a.sent();
                    expect(virtualScroller.scrollTop).to.equal(50);
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not scroll vertically when navigating expanded row cells', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Component() {
            var data = (0, x_data_grid_generator_1.useBasicDemoData)(10, 4);
            return (<TestCase {...data} getDetailPanelContent={function () { return <div />; }} initialState={{
                    detailPanel: {
                        expandedRowIds: new Set([0]),
                    },
                }} hideFooter/>);
        }
        var user, virtualScroller, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<Component />).user;
                    virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                    cell = (0, helperFn_1.getCell)(0, 0);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('[ArrowRight]')];
                case 2:
                    _a.sent();
                    expect(virtualScroller.scrollTop).to.equal(0);
                    return [4 /*yield*/, user.keyboard('[ArrowRight]')];
                case 3:
                    _a.sent();
                    expect(virtualScroller.scrollTop).to.equal(0);
                    return [4 /*yield*/, user.keyboard('[ArrowRight]')];
                case 4:
                    _a.sent();
                    expect(virtualScroller.scrollTop).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should toggle the detail panel when pressing Space on detail toggle cell', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelContent={function () { return <div>Detail</div>; }}/>).user;
                    expect(internal_test_utils_1.screen.queryByText('Detail')).to.equal(null);
                    cell = (0, helperFn_1.getCell)(0, 0);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('[Space]')];
                case 2:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByText('Detail')).not.to.equal(null);
                    return [4 /*yield*/, user.keyboard('[Space]')];
                case 3:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByText('Detail')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow to pass a custom toggle by adding a column with field=GRID_DETAIL_PANEL_TOGGLE_FIELD', function () {
        render(<TestCase nbRows={1} columns={[
                { field: 'currencyPair' },
                { field: x_data_grid_pro_1.GRID_DETAIL_PANEL_TOGGLE_FIELD, renderCell: function () { return <button>Toggle</button>; } },
            ]} getDetailPanelContent={function () { return <div>Detail</div>; }}/>);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: 'Expand' })).to.equal(null);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: 'Toggle' })).not.to.equal(null);
        expect((0, helperFn_1.getCell)(0, 1).firstChild).to.equal(internal_test_utils_1.screen.queryByRole('button', { name: 'Toggle' }));
    });
    it('should cache the content of getDetailPanelContent', function () { return __awaiter(void 0, void 0, void 0, function () {
        var getDetailPanelContent, _a, setProps, user, expectedCallCount, getDetailPanelContent2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    getDetailPanelContent = (0, sinon_1.spy)(function () { return <div>Detail</div>; });
                    _a = render(<TestCase columns={[{ field: 'brand' }]} rows={[
                            { id: 0, brand: 'Nike' },
                            { id: 1, brand: 'Adidas' },
                        ]} getDetailPanelContent={getDetailPanelContent} pagination pageSizeOptions={[1]} initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}/>), setProps = _a.setProps, user = _a.user;
                    expectedCallCount = internal_test_utils_1.reactMajor >= 19 ? 8 : 12;
                    expect(getDetailPanelContent.callCount).to.equal(expectedCallCount);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Expand' }))];
                case 1:
                    _b.sent();
                    expect(getDetailPanelContent.callCount).to.equal(expectedCallCount);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 2:
                    _b.sent();
                    expect(getDetailPanelContent.callCount).to.equal(expectedCallCount);
                    getDetailPanelContent2 = (0, sinon_1.spy)(function () { return <div>Detail</div>; });
                    setProps({ getDetailPanelContent: getDetailPanelContent2 });
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Expand' }))];
                case 3:
                    _b.sent();
                    expect(getDetailPanelContent2.callCount).to.equal(2); // Called 2x by the effect
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }))];
                case 4:
                    _b.sent();
                    expect(getDetailPanelContent2.callCount).to.equal(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should cache the content of getDetailPanelHeight', function () { return __awaiter(void 0, void 0, void 0, function () {
        var getDetailPanelHeight, _a, setProps, user, expectedCallCount, getDetailPanelHeight2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    getDetailPanelHeight = (0, sinon_1.spy)(function () { return 100; });
                    _a = render(<TestCase columns={[{ field: 'brand' }]} rows={[
                            { id: 0, brand: 'Nike' },
                            { id: 1, brand: 'Adidas' },
                        ]} getDetailPanelContent={function () { return <div>Detail</div>; }} getDetailPanelHeight={getDetailPanelHeight} pagination pageSizeOptions={[1]} initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}/>), setProps = _a.setProps, user = _a.user;
                    expectedCallCount = internal_test_utils_1.reactMajor >= 19 ? 8 : 12;
                    expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Expand' }))];
                case 1:
                    _b.sent();
                    expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 2:
                    _b.sent();
                    expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);
                    getDetailPanelHeight2 = (0, sinon_1.spy)(function () { return 200; });
                    setProps({ getDetailPanelHeight: getDetailPanelHeight2 });
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Expand' }))];
                case 3:
                    _b.sent();
                    expect(getDetailPanelHeight2.callCount).to.equal(2); // Called 2x by the effect
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }))];
                case 4:
                    _b.sent();
                    expect(getDetailPanelHeight2.callCount).to.equal(2);
                    return [2 /*return*/];
            }
        });
    }); });
    // Doesn't work with mocked window.getComputedStyle
    it.skipIf(skipIf_1.isJSDOM)('should update the panel height if getDetailPanelHeight is changed while the panel is open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var getDetailPanelHeight, _a, setProps, user, detailPanel, virtualScroller, getDetailPanelHeight2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    getDetailPanelHeight = (0, sinon_1.spy)(function () { return 100; });
                    _a = render(<TestCase columns={[{ field: 'brand' }]} rows={[
                            { id: 0, brand: 'Nike' },
                            { id: 1, brand: 'Adidas' },
                        ]} getDetailPanelContent={function () { return <div>Detail</div>; }} getDetailPanelHeight={getDetailPanelHeight} pagination pageSizeOptions={[1]} initialState={{ pagination: { paginationModel: { pageSize: 1 } } }} autoHeight/>), setProps = _a.setProps, user = _a.user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Expand' }))];
                case 1:
                    _b.sent();
                    detailPanel = (0, helperFn_1.$$)('.MuiDataGrid-detailPanel')[0];
                    expect(detailPanel).toHaveComputedStyle({ height: '100px' });
                    virtualScroller = (0, helperFn_1.grid)('virtualScroller');
                    expect(virtualScroller.scrollHeight).to.equal(208);
                    getDetailPanelHeight2 = (0, sinon_1.spy)(function () { return 200; });
                    setProps({ getDetailPanelHeight: getDetailPanelHeight2 });
                    expect(detailPanel).toHaveComputedStyle({ height: '200px' });
                    expect(virtualScroller.scrollHeight).to.equal(200 + 52 + 56);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should only call getDetailPanelHeight on the rows that have detail content', function () {
        var getDetailPanelHeight = (0, sinon_1.spy)(function (_a) {
            var row = _a.row;
            return row.id + 100;
        }); // Use `row` to allow to assert its args below
        render(<TestCase columns={[{ field: 'brand' }]} rows={[
                { id: 0, brand: 'Nike' },
                { id: 1, brand: 'Adidas' },
            ]} getDetailPanelContent={function (_a) {
            var row = _a.row;
            return (row.id === 0 ? <div>Detail</div> : null);
        }} getDetailPanelHeight={getDetailPanelHeight}/>);
        //   1x during state initialization
        // + 1x during state initialization (StrictMode)
        // + 1x when sortedRowsSet is fired
        // + 1x when sortedRowsSet is fired (StrictMode) = 4x
        // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
        // from React 19 it is:
        //   1x during state initialization
        // + 1x when sortedRowsSet is fired
        var expectedCallCount = internal_test_utils_1.reactMajor >= 19 ? 4 : 6;
        expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);
        expect(getDetailPanelHeight.lastCall.args[0].id).to.equal(0);
    });
    it('should not select the row when opening the detail panel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handleRowSelectionModelChange, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleRowSelectionModelChange = (0, sinon_1.spy)();
                    user = render(<TestCase getDetailPanelContent={function () { return <div>Detail</div>; }} onRowSelectionModelChange={handleRowSelectionModelChange} checkboxSelection/>).user;
                    expect(internal_test_utils_1.screen.queryByText('Detail')).to.equal(null);
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                case 1:
                    _a.sent();
                    expect(handleRowSelectionModelChange.callCount).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    // See https://github.com/mui/mui-x/issues/4607
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should make detail panel to take full width of the content', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelContent={function () { return <div>Detail</div>; }} columns={[{ field: 'id', width: 400 }]}/>).user;
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('button'))];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByText('Detail').offsetWidth).to.equal(50 + 400);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should add an accessible name to the toggle column', function () {
        render(<TestCase getDetailPanelContent={function () { return <div />; }}/>);
        expect(internal_test_utils_1.screen.queryByRole('columnheader', { name: /detail panel toggle/i })).not.to.equal(null);
    });
    it('should add the MuiDataGrid-row--detailPanelExpanded class to the expanded row', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelContent={function (_a) {
                        var id = _a.id;
                        return (id === 0 ? <div /> : null);
                    }}/>).user;
                    expect((0, helperFn_1.getRow)(0)).not.to.have.class(x_data_grid_pro_1.gridClasses['row--detailPanelExpanded']);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Expand' })[0])];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getRow)(0)).to.have.class(x_data_grid_pro_1.gridClasses['row--detailPanelExpanded']);
                    return [2 /*return*/];
            }
        });
    }); });
    // See https://github.com/mui/mui-x/issues/6694
    // Doesn't work with mocked window.getComputedStyle
    it.skipIf(skipIf_1.isJSDOM)('should add a bottom margin to the expanded row when using `getRowSpacing`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelContent={function (_a) {
                        var id = _a.id;
                        return (id === 0 ? <div /> : null);
                    }} getRowSpacing={function () { return ({ top: 2, bottom: 2 }); }}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Expand' })[0])];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getRow)(0)).toHaveComputedStyle({ marginBottom: '2px' });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not reuse detail panel components', function () {
        var counter = 0;
        function DetailPanel() {
            counter += 1;
            return <div data-testid="detail-panel-content">{counter}</div>;
        }
        var setProps = render(<TestCase getDetailPanelContent={function () { return <DetailPanel />; }} detailPanelExpandedRowIds={new Set([0])}/>).setProps;
        expect(internal_test_utils_1.screen.getByTestId("detail-panel-content").textContent).to.equal("".concat(counter));
        setProps({ detailPanelExpandedRowIds: new Set([1]) });
        expect(internal_test_utils_1.screen.getByTestId("detail-panel-content").textContent).to.equal("".concat(counter));
    });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)("should not render detail panel for the focused row if it's outside of the viewport", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelHeight={function () { return 50; }} getDetailPanelContent={function () { return <div />; }} rowBufferPx={0} nbRows={20}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Expand' })[0])];
                case 1:
                    _a.sent();
                    virtualScroller = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.virtualScroller));
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ top: 500, behavior: 'instant' })];
                        }); }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            var detailPanels = document.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses.detailPanel));
                            expect(detailPanels.length).to.equal(0);
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('prop: onDetailPanelsExpandedRowIds', function () {
        it('should call when a row is expanded or closed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleDetailPanelsExpandedRowIdsChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleDetailPanelsExpandedRowIdsChange = (0, sinon_1.spy)();
                        user = render(<TestCase getDetailPanelContent={function () { return <div>Detail</div>; }} onDetailPanelExpandedRowIdsChange={handleDetailPanelsExpandedRowIdsChange}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Expand' })[0])];
                    case 1:
                        _a.sent(); // Expand the 1st row
                        expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([0]));
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Expand' })[0])];
                    case 2:
                        _a.sent(); // Expand the 2nd row
                        expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([0, 1]));
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Collapse' })[0])];
                    case 3:
                        _a.sent(); // Close the 1st row
                        expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([1]));
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Collapse' })[0])];
                    case 4:
                        _a.sent(); // Close the 2nd row
                        expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not change the open detail panels when called while detailPanelsExpandedRowIds is the same', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleDetailPanelsExpandedRowIdsChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleDetailPanelsExpandedRowIdsChange = (0, sinon_1.spy)();
                        user = render(<TestCase getDetailPanelContent={function (_a) {
                            var id = _a.id;
                            return <div>Row {id}</div>;
                        }} detailPanelExpandedRowIds={new Set([0])} onDetailPanelExpandedRowIdsChange={handleDetailPanelsExpandedRowIdsChange}/>).user;
                        expect(internal_test_utils_1.screen.getByText('Row 0')).not.to.equal(null);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Collapse' }))];
                    case 1:
                        _a.sent();
                        expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([]));
                        expect(internal_test_utils_1.screen.getByText('Row 0')).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: detailPanelExpandedRowIds', function () {
        it('should open the detail panel of the specified rows', function () {
            render(<TestCase getDetailPanelContent={function (_a) {
                var id = _a.id;
                return <div>Row {id}</div>;
            }} detailPanelExpandedRowIds={new Set([0, 1])}/>);
            expect(internal_test_utils_1.screen.queryByText('Row 0')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByText('Row 1')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByText('Row 2')).to.equal(null);
        });
        it("should not change the open detail panels if the prop didn't change", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getDetailPanelContent={function (_a) {
                            var id = _a.id;
                            return <div>Row {id}</div>;
                        }} detailPanelExpandedRowIds={new Set([0])}/>).user;
                        expect(internal_test_utils_1.screen.queryByText('Row 0')).not.to.equal(null);
                        expect(internal_test_utils_1.screen.queryByText('Row 1')).to.equal(null);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'Expand' })[0])];
                    case 1:
                        _a.sent(); // Expand the second row
                        expect(internal_test_utils_1.screen.queryByText('Row 0')).not.to.equal(null);
                        expect(internal_test_utils_1.screen.queryByText('Row 1')).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter out duplicated ids and render only one panel', function () {
            render(<TestCase getDetailPanelContent={function (_a) {
                var id = _a.id;
                return <div>Row {id}</div>;
            }} detailPanelExpandedRowIds={new Set([0, 0])}/>);
            expect(internal_test_utils_1.screen.queryAllByText('Row 0').length).to.equal(1);
        });
    });
    describe('apiRef', function () {
        describe('toggleDetailPanel', function () {
            it('should toggle the panel of the given row id', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase getDetailPanelContent={function () { return <div>Detail</div>; }}/>);
                            expect(internal_test_utils_1.screen.queryByText('Detail')).to.equal(null);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.toggleDetailPanel(0)];
                                }); }); })];
                        case 1:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByText('Detail')).not.to.equal(null);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.toggleDetailPanel(0)];
                                }); }); })];
                        case 2:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByText('Detail')).to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not toggle the panel of a row without detail component', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase rowHeight={50} getDetailPanelContent={function (_a) {
                                var id = _a.id;
                                return (id === 0 ? <div>Detail</div> : null);
                            }}/>);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.toggleDetailPanel(1)];
                                }); }); })];
                        case 1:
                            _a.sent();
                            expect(document.querySelector('.MuiDataGrid-detailPanels')).to.equal(null);
                            expect((0, helperFn_1.getRow)(1)).not.toHaveComputedStyle({ marginBottom: '50px' });
                            return [2 /*return*/];
                    }
                });
            }); });
            // See https://github.com/mui/mui-x/pull/8976
            it('should not toggle the panel if the row id is of a different type', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase getDetailPanelContent={function () { return <div>Detail</div>; }}/>);
                            expect(internal_test_utils_1.screen.queryByText('Detail')).to.equal(null);
                            // '0' !== 0
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.toggleDetailPanel('0')];
                                }); }); })];
                        case 1:
                            // '0' !== 0
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByText('Detail')).to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getExpandedDetailPanels', function () {
            it('should return a set of ids', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase getDetailPanelContent={function () { return <div>Detail</div>; }} initialState={{
                                    detailPanel: {
                                        expandedRowIds: new Set([0, 1]),
                                    },
                                }}/>);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getExpandedDetailPanels()).to.deep.equal(new Set([0, 1]))];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('setExpandedDetailPanels', function () {
            it('should update which detail panels are open', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase getDetailPanelContent={function (_a) {
                                var id = _a.id;
                                return <div>Row {id}</div>;
                            }} initialState={{
                                    detailPanel: {
                                        expandedRowIds: new Set([0]),
                                    },
                                }}/>);
                            expect(internal_test_utils_1.screen.queryByText('Row 0')).not.to.equal(null);
                            expect(internal_test_utils_1.screen.queryByText('Row 1')).to.equal(null);
                            expect(internal_test_utils_1.screen.queryByText('Row 2')).to.equal(null);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setExpandedDetailPanels(new Set([1, 2]))];
                                }); }); })];
                        case 1:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByText('Row 0')).to.equal(null);
                            expect(internal_test_utils_1.screen.queryByText('Row 1')).not.to.equal(null);
                            expect(internal_test_utils_1.screen.queryByText('Row 2')).not.to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    it('should merge row styles when expanded', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestCase getDetailPanelHeight={function () { return 0; }} nbRows={1} getDetailPanelContent={function () { return <div />; }} slotProps={{
                            row: { style: { color: 'yellow' } },
                        }}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Expand' }))];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getRow)(0)).toHaveInlineStyle({
                        color: 'yellow',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});

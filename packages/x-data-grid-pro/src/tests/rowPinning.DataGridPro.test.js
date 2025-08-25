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
describe('<DataGridPro /> - Row pinning', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function getRowById(id) {
        return (0, helperFn_1.$)("[data-id=\"".concat(id, "\"]"));
    }
    function isRowPinned(row, section) {
        var container = section === 'top' ? (0, helperFn_1.grid)('pinnedRows--top') : (0, helperFn_1.grid)('pinnedRows--bottom');
        if (!row || !container) {
            return false;
        }
        return container.contains(row);
    }
    function BaselineTestCase(_a) {
        var rowCount = _a.rowCount, colCount = _a.colCount, _b = _a.height, height = _b === void 0 ? 300 : _b, props = __rest(_a, ["rowCount", "colCount", "height"]);
        var data = (0, x_data_grid_generator_1.getBasicGridData)(rowCount, colCount);
        var _c = data.rows, pinnedRow0 = _c[0], pinnedRow1 = _c[1], rows = _c.slice(2);
        return (<div style={{ width: 302, height: height }}>
        <x_data_grid_pro_1.DataGridPro {...data} rows={rows} pinnedRows={{
                top: [pinnedRow0],
                bottom: [pinnedRow1],
            }} {...props}/>
      </div>);
    }
    it('should render pinned rows in pinned containers', function () {
        render(<BaselineTestCase rowCount={20} colCount={5}/>);
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    });
    it('should treat row as pinned even if row with the same id is present in `rows` prop', function () {
        var rowCount = 5;
        function TestCase(_a) {
            var _b = _a.pinRows, pinRows = _b === void 0 ? true : _b;
            var data = (0, x_data_grid_generator_1.getBasicGridData)(rowCount, 5);
            var pinnedRows = React.useMemo(function () {
                if (pinRows) {
                    return {
                        top: [data.rows[0]],
                        bottom: [data.rows[1]],
                    };
                }
                return undefined;
            }, [pinRows, data.rows]);
            return (<div style={{ width: 302, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...data} autoHeight pinnedRows={pinnedRows}/>
        </div>);
        }
        var setProps = render(<TestCase />).setProps;
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '2', '3', '4', '1']);
        expect(internal_test_utils_1.screen.getByText("Total Rows: ".concat(rowCount - 2))).not.to.equal(null);
        setProps({ pinRows: false });
        expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 not pinned');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 not pinned');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4']);
        expect(internal_test_utils_1.screen.getByText("Total Rows: ".concat(rowCount))).not.to.equal(null);
        setProps({ pinRows: true });
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '2', '3', '4', '1']);
        expect(internal_test_utils_1.screen.getByText("Total Rows: ".concat(rowCount - 2))).not.to.equal(null);
    });
    // Needs layouting
    it.skipIf(skipIf_1.isJSDOM)('should keep rows pinned on rows scroll', function () { return __awaiter(void 0, void 0, void 0, function () {
        var virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<BaselineTestCase rowCount={20} colCount={5}/>);
                    virtualScroller = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.virtualScroller));
                    expect(virtualScroller.scrollTop).to.equal(0);
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    // scroll to the very bottom
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ top: 1000, behavior: 'instant' })];
                        }); }); })];
                case 1:
                    // scroll to the very bottom
                    _a.sent();
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update pinned rows when `pinnedRows` prop change', function () {
        var data = (0, x_data_grid_generator_1.getBasicGridData)(20, 5);
        function TestCase(props) {
            var _a = data.rows, pinnedRow0 = _a[0], pinnedRow1 = _a[1], rows = _a.slice(2);
            return (<div style={{ width: 302, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...data} rows={rows} pinnedRows={{
                    top: [pinnedRow0],
                    bottom: [pinnedRow1],
                }} {...props} experimentalFeatures={{ rowPinning: true }}/>
        </div>);
        }
        var setProps = render(<TestCase />).setProps;
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
        var pinnedRows = { top: [data.rows[11]], bottom: [data.rows[3]] };
        var rows = data.rows.filter(function (row) { return row.id !== 11 && row.id !== 3; });
        setProps({ pinnedRows: pinnedRows, rows: rows });
        expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 pinned bottom');
        expect(isRowPinned(getRowById(11), 'top')).to.equal(true, '#11 pinned top');
        expect(isRowPinned(getRowById(3), 'bottom')).to.equal(true, '#3 pinned bottom');
    });
    it('should update pinned rows when calling `apiRef.current.setPinnedRows` method', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase(props) {
            var _a = data.rows, pinnedRow0 = _a[0], pinnedRow1 = _a[1], rows = _a.slice(2);
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 302, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...data} rows={rows} pinnedRows={{
                    top: [pinnedRow0],
                    bottom: [pinnedRow1],
                }} apiRef={apiRef} {...props} experimentalFeatures={{ rowPinning: true }}/>
        </div>);
        }
        var data, apiRef, pinnedRows, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = (0, x_data_grid_generator_1.getBasicGridData)(20, 5);
                    render(<TestCase />);
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    pinnedRows = { top: [data.rows[11]], bottom: [data.rows[3]] };
                    rows = data.rows.filter(function (row) { return row.id !== 11 && row.id !== 3; });
                    // should work when calling `setPinnedRows` before `setRows`
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.unstable_setPinnedRows(pinnedRows); })];
                case 1:
                    // should work when calling `setPinnedRows` before `setRows`
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows(rows); })];
                case 2:
                    _a.sent();
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 pinned bottom');
                    expect(isRowPinned(getRowById(11), 'top')).to.equal(true, '#11 pinned top');
                    expect(isRowPinned(getRowById(3), 'bottom')).to.equal(true, '#3 pinned bottom');
                    pinnedRows = { top: [data.rows[8]], bottom: [data.rows[5]] };
                    rows = data.rows.filter(function (row) { return row.id !== 8 && row.id !== 5; });
                    // should work when calling `setPinnedRows` after `setRows`
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows(rows); })];
                case 3:
                    // should work when calling `setPinnedRows` after `setRows`
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.unstable_setPinnedRows(pinnedRows); })];
                case 4:
                    _a.sent();
                    expect(isRowPinned(getRowById(11), 'top')).to.equal(false, '#11 pinned top');
                    expect(isRowPinned(getRowById(3), 'bottom')).to.equal(false, '#3 pinned bottom');
                    expect(isRowPinned(getRowById(8), 'top')).to.equal(true, '#8 pinned top');
                    expect(isRowPinned(getRowById(5), 'bottom')).to.equal(true, '#5 pinned bottom');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should work with `getRowId`', function () {
        function TestCase() {
            var data = (0, x_data_grid_generator_1.getBasicGridData)(20, 5);
            var rowsData = data.rows.map(function (row) {
                var id = row.id, rowData = __rest(row, ["id"]);
                return __assign(__assign({}, rowData), { productId: id });
            });
            var pinnedRow0 = rowsData[0], pinnedRow1 = rowsData[1], rows = rowsData.slice(2);
            var getRowId = React.useCallback(function (row) { return row.productId; }, []);
            return (<div style={{ width: 302, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...data} rows={rows} pinnedRows={{
                    top: [pinnedRow0],
                    bottom: [pinnedRow1],
                }} getRowId={getRowId}/>
        </div>);
        }
        render(<TestCase />);
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    });
    it('should not be impacted by sorting', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<BaselineTestCase rowCount={5} colCount={5}/>).user;
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '2', '3', '4', '1']);
                    return [4 /*yield*/, user.click((0, helperFn_1.getColumnHeaderCell)(0))];
                case 1:
                    _a.sent();
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '2', '3', '4', '1']);
                    return [4 /*yield*/, user.click((0, helperFn_1.getColumnHeaderCell)(0))];
                case 2:
                    _a.sent();
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '4', '3', '2', '1']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not be impacted by filtering', function () {
        var setProps = render(<BaselineTestCase rowCount={20} colCount={5}/>).setProps;
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
        setProps({
            filterModel: {
                items: [{ field: 'currencyPair', operator: 'equals', value: 'GBPEUR' }],
            },
        });
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
        // should show pinned rows even if there's no filtering results
        setProps({
            filterModel: {
                items: [{ field: 'currencyPair', operator: 'equals', value: 'whatever' }],
            },
        });
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    });
    it('should work when there is no rows data', function () {
        render(<BaselineTestCase rowCount={20} colCount={5}/>);
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    });
    describe('keyboard navigation', function () {
        function getActiveCellRowId() {
            var cell = document.activeElement;
            if (!cell || cell.getAttribute('role') !== 'gridcell') {
                return undefined;
            }
            return cell.parentElement.getAttribute('data-id');
        }
        it('should work with top pinned rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            function TestCase() {
                var data = (0, x_data_grid_generator_1.getBasicGridData)(20, 5);
                var _a = data.rows, pinnedRow0 = _a[0], pinnedRow1 = _a[1], rows = _a.slice(2);
                return (<div style={{ width: 302, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...data} rows={rows} pinnedRows={{
                        top: [pinnedRow1, pinnedRow0],
                    }}/>
          </div>);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        expect(isRowPinned(getRowById(1), 'top')).to.equal(true, '#1 pinned top');
                        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        // first top pinned row
                        expect(getActiveCellRowId()).to.equal('1');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        // second top pinned row
                        expect(getActiveCellRowId()).to.equal('0');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 3:
                        _a.sent();
                        // first non-pinned row
                        expect(getActiveCellRowId()).to.equal('2');
                        return [4 /*yield*/, user.keyboard('{ArrowRight}{ArrowUp}{ArrowUp}{ArrowUp}')];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work with bottom pinned rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            function TestCase() {
                var data = (0, x_data_grid_generator_1.getBasicGridData)(5, 5);
                var _a = data.rows, pinnedRow0 = _a[0], pinnedRow1 = _a[1], rows = _a.slice(2);
                return (<div style={{ width: 302, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...data} rows={rows} pinnedRows={{
                        bottom: [pinnedRow0, pinnedRow1],
                    }}/>
          </div>);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        expect(isRowPinned(getRowById(0), 'bottom')).to.equal(true, '#0 pinned top');
                        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned top');
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(getActiveCellRowId()).to.equal('2');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect(getActiveCellRowId()).to.equal('3');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 3:
                        _a.sent();
                        expect(getActiveCellRowId()).to.equal('4');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 4:
                        _a.sent();
                        expect(getActiveCellRowId()).to.equal('0');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 5:
                        _a.sent();
                        expect(getActiveCellRowId()).to.equal('1');
                        return [2 /*return*/];
                }
            });
        }); });
        // Needs layouting
        it.skipIf(skipIf_1.isJSDOM)('should work with pinned columns', function () { return __awaiter(void 0, void 0, void 0, function () {
            function TestCase() {
                var data = (0, x_data_grid_generator_1.getBasicGridData)(5, 7);
                var _a = data.rows, pinnedRow0 = _a[0], pinnedRow1 = _a[1], rows = _a.slice(2);
                return (<div style={{ width: 502, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...data} rows={rows} pinnedRows={{
                        top: [pinnedRow1],
                        bottom: [pinnedRow0],
                    }} initialState={{
                        pinnedColumns: {
                            left: ['id'],
                            right: ['price2M'],
                        },
                    }}/>
          </div>);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        expect(isRowPinned(getRowById(1), 'top')).to.equal(true, '#1 pinned top');
                        expect(isRowPinned(getRowById(0), 'bottom')).to.equal(true, '#0 pinned bottom');
                        // top-pinned row
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 3))];
                    case 1:
                        // top-pinned row
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-3');
                        expect(getActiveCellRowId()).to.equal('1');
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-4');
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-5');
                        // right-pinned column cell
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 4:
                        // right-pinned column cell
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-6');
                        // go through the right-pinned column all way down to bottom-pinned row
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 5:
                        // go through the right-pinned column all way down to bottom-pinned row
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-6');
                        expect(getActiveCellRowId()).to.equal('2');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 6:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('2-6');
                        expect(getActiveCellRowId()).to.equal('3');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 7:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('3-6');
                        expect(getActiveCellRowId()).to.equal('4');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 8:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('4-6');
                        expect(getActiveCellRowId()).to.equal('0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Needs layouting
    it.skipIf(skipIf_1.isJSDOM)('should work with variable row height', function () {
        var _a, _b;
        function TestCase() {
            return (<BaselineTestCase rowCount={20} colCount={5} getRowHeight={function (row) {
                    if (row.id === 0) {
                        return 100;
                    }
                    if (row.id === 1) {
                        return 20;
                    }
                    return undefined;
                }}/>);
        }
        render(<TestCase />);
        expect((_a = getRowById(0)) === null || _a === void 0 ? void 0 : _a.clientHeight).to.equal(100);
        expect((_b = getRowById(1)) === null || _b === void 0 ? void 0 : _b.clientHeight).to.equal(20);
    });
    // Needs layouting
    it.skipIf(skipIf_1.isJSDOM)('should always update on `rowHeight` change', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase(_a) {
            var rowHeight = _a.rowHeight;
            return (<BaselineTestCase rowCount={10} colCount={5} rowHeight={rowHeight !== null && rowHeight !== void 0 ? rowHeight : defaultRowHeight}/>);
        }
        var defaultRowHeight, setProps;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    defaultRowHeight = 52;
                    setProps = render(<TestCase />).setProps;
                    return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                case 1:
                    _c.sent();
                    expect(getRowById(0).offsetHeight).to.equal(defaultRowHeight);
                    expect((0, helperFn_1.grid)('pinnedRows--top').offsetHeight).to.equal(defaultRowHeight);
                    expect(getRowById(1).clientHeight).to.equal(defaultRowHeight);
                    expect((0, helperFn_1.grid)('pinnedRows--bottom').offsetHeight).to.equal(defaultRowHeight);
                    setProps({ rowHeight: 36 });
                    expect((_a = getRowById(0)) === null || _a === void 0 ? void 0 : _a.clientHeight).to.equal(36);
                    expect((0, helperFn_1.grid)('pinnedRows--top').offsetHeight).to.equal(36);
                    expect((_b = getRowById(1)) === null || _b === void 0 ? void 0 : _b.clientHeight).to.equal(36);
                    expect((0, helperFn_1.grid)('pinnedRows--bottom').offsetHeight).to.equal(36);
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layouting
    it.skipIf(skipIf_1.isJSDOM)('should work with `autoHeight`', function () {
        var columnHeaderHeight = 56;
        var rowHeight = 52;
        var rowCount = 10;
        render(<BaselineTestCase rowCount={rowCount} colCount={2} rowHeight={rowHeight} columnHeaderHeight={columnHeaderHeight} hideFooter autoHeight/>);
        expect((0, helperFn_1.grid)('main').clientHeight).to.equal(columnHeaderHeight + rowHeight * rowCount);
    });
    // Needs layouting
    it.skipIf(skipIf_1.isJSDOM)('should work with `autoPageSize`', function () {
        render(<BaselineTestCase rowCount={10} colCount={5} rowHeight={52} pagination autoPageSize columnHeaderHeight={56} hideFooter/>);
        // 300px grid height - 56px header = 244px available for rows
        // 244px / 52px = 4 rows = 2 rows + 1 top-pinned row + 1 bottom-pinned row
        expect((0, helperFn_1.getRows)().length).to.equal(4);
    });
    it('should not allow to expand detail panel of pinned row', function () {
        render(<BaselineTestCase rowCount={10} colCount={5} height={500} getDetailPanelContent={function (_a) {
            var row = _a.row;
            return <div>{row.id}</div>;
        }}/>);
        var cell = (0, helperFn_1.getCell)(0, 0);
        expect(cell.querySelector('[aria-label="Expand"]')).to.have.attribute('disabled');
    });
    it('should not allow to reorder pinned rows', function () {
        render(<BaselineTestCase rowCount={10} colCount={5} rowReordering/>);
        var cell = (0, helperFn_1.getCell)(0, 0);
        expect(cell.querySelector(".".concat(x_data_grid_pro_1.gridClasses.rowReorderCell))).to.equal(null);
    });
    it('should keep pinned rows on page change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<BaselineTestCase rowCount={20} colCount={5} height={500} pagination initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} pageSizeOptions={[5]}/>).user;
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 1:
                    _a.sent();
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 2:
                    _a.sent();
                    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
                    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not count pinned rows as part of the page', function () {
        var pageSize = 3;
        render(<BaselineTestCase rowCount={20} colCount={5} height={500} pagination initialState={{ pagination: { paginationModel: { pageSize: pageSize } } }} pageSizeOptions={[pageSize]}/>);
        expect((0, helperFn_1.getRows)().length).to.equal(pageSize + 2); // + 2 pinned rows
    });
    it('should render pinned rows outside of the tree data', function () {
        var rows = [
            { id: 0, name: 'A' },
            { id: 1, name: 'A.B' },
            { id: 2, name: 'A.A' },
            { id: 3, name: 'B.A' },
            { id: 4, name: 'B.B' },
        ];
        var columns = [{ field: 'name', width: 200 }];
        function Test() {
            var pinnedRow0 = rows[0], pinnedRow1 = rows[1], rowsData = rows.slice(2);
            return (<div style={{ width: 300, height: 400 }}>
          <x_data_grid_pro_1.DataGridPro treeData getTreeDataPath={function (row) { return row.name.split('.'); }} rows={rowsData} columns={columns} pinnedRows={{
                    top: [pinnedRow0],
                    bottom: [pinnedRow1],
                }}/>
        </div>);
        }
        render(<Test />);
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    });
    it('should not be selectable', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase() {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return <BaselineTestCase rowCount={20} colCount={5} apiRef={apiRef}/>;
        }
        var apiRef, user;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = render(<TestCase />).user;
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                case 1:
                    _b.sent();
                    expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.isRowSelected(0)).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not render selection checkbox for pinned rows', function () {
        render(<BaselineTestCase rowCount={20} colCount={5} checkboxSelection/>);
        expect(getRowById(0).querySelector('input[type="checkbox"]')).to.equal(null);
        expect(getRowById(1).querySelector('input[type="checkbox"]')).to.equal(null);
    });
    it('should export pinned rows to CSV', function () {
        var _a;
        var apiRef;
        function TestCase() {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return <BaselineTestCase rowCount={20} colCount={1} apiRef={apiRef}/>;
        }
        render(<TestCase />);
        var csv = ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsCsv({
            includeHeaders: false,
        })) || '';
        var csvRows = csv.split('\r\n');
        expect(csvRows[0]).to.equal('0');
        expect(csvRows[csvRows.length - 1]).to.equal('1');
    });
    it('should include pinned rows in `aria-rowcount` attribute', function () {
        var rowCount = 10;
        render(<BaselineTestCase rowCount={rowCount} colCount={1}/>);
        expect(internal_test_utils_1.screen.getByRole('grid')).to.have.attribute('aria-rowcount', "".concat(rowCount + 1)); // +1 for header row
    });
    // https://github.com/mui/mui-x/issues/5845
    it('should work with `getCellClassName` when `rows=[]`', function () {
        var className = 'test-class-name';
        render(<BaselineTestCase rowCount={2} colCount={1} rows={[]} getRowClassName={function () { return className; }}/>);
        expect(getRowById(0)).to.have.class(className);
        expect(getRowById(1)).to.have.class(className);
    });
    // flaky in JSDOM
    it.skipIf(skipIf_1.isJSDOM)('should support cell editing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var processRowUpdate, columns, user, cell, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processRowUpdate = (0, sinon_1.spy)(function (row) { return (__assign(__assign({}, row), { currencyPair: 'USD-GBP' })); });
                    columns = [{ field: 'id' }, { field: 'name', editable: true }];
                    user = render(<div style={{ width: 400, height: 400 }}>
        <x_data_grid_pro_1.DataGridPro rows={[
                            { id: 1, name: 'Jack' },
                            { id: 2, name: 'Theo' },
                            { id: 4, name: 'Cory' },
                            { id: 5, name: 'Woody' },
                        ]} columns={columns} pinnedRows={{
                            top: [{ id: 3, name: 'Joe' }],
                        }} processRowUpdate={processRowUpdate}/>
      </div>).user;
                    cell = (0, helperFn_1.getCell)(0, 1);
                    return [4 /*yield*/, user.dblClick(cell)];
                case 1:
                    _a.sent();
                    input = cell.querySelector('input');
                    // remove the previous value before typing in the new one
                    // was "fireEvent.change(input, { target: { value: 'Marcus' } })"
                    return [4 /*yield*/, user.clear(input)];
                case 2:
                    // remove the previous value before typing in the new one
                    // was "fireEvent.change(input, { target: { value: 'Marcus' } })"
                    _a.sent();
                    return [4 /*yield*/, user.type(input, 'Marcus')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('{Enter}')];
                case 4:
                    _a.sent();
                    expect(cell.textContent).to.equal('Marcus');
                    expect(processRowUpdate.callCount).to.equal(1);
                    expect(processRowUpdate.lastCall.args[0]).to.deep.equal({ id: 3, name: 'Marcus' });
                    return [2 /*return*/];
            }
        });
    }); });
    // flaky in JSDOM
    it.skipIf(skipIf_1.isJSDOM)('should support row editing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var processRowUpdate, columns, user, cell, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processRowUpdate = (0, sinon_1.spy)(function (row) { return (__assign(__assign({}, row), { currencyPair: 'USD-GBP' })); });
                    columns = [{ field: 'id' }, { field: 'name', editable: true }];
                    user = render(<div style={{ width: 400, height: 400 }}>
        <x_data_grid_pro_1.DataGridPro rows={[
                            { id: 1, name: 'Jack' },
                            { id: 2, name: 'Theo' },
                            { id: 4, name: 'Cory' },
                            { id: 5, name: 'Woody' },
                        ]} columns={columns} pinnedRows={{
                            top: [{ id: 3, name: 'Joe' }],
                        }} editMode="row" processRowUpdate={processRowUpdate}/>
      </div>).user;
                    cell = (0, helperFn_1.getCell)(0, 1);
                    return [4 /*yield*/, user.dblClick(cell)];
                case 1:
                    _a.sent();
                    input = cell.querySelector('input');
                    // remove the previous value before typing in the new one
                    // was "fireEvent.change(input, { target: { value: 'Marcus' } })"
                    return [4 /*yield*/, user.clear(input)];
                case 2:
                    // remove the previous value before typing in the new one
                    // was "fireEvent.change(input, { target: { value: 'Marcus' } })"
                    _a.sent();
                    return [4 /*yield*/, user.type(input, 'Marcus')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('{Enter}')];
                case 4:
                    _a.sent();
                    expect(cell.textContent).to.equal('Marcus');
                    expect(processRowUpdate.callCount).to.equal(1);
                    expect(processRowUpdate.lastCall.args[0]).to.deep.equal({ id: 3, name: 'Marcus' });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should support `updateRows`', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase() {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 400, height: 400 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} rows={[
                    { id: 1, name: 'Jack' },
                    { id: 2, name: 'Theo' },
                    { id: 5, name: 'Woody' },
                ]} columns={columns} pinnedRows={{
                    top: [{ id: 3, name: 'Joe' }],
                    bottom: [{ id: 4, name: 'Cory' }],
                }}/>
        </div>);
        }
        var columns, apiRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    columns = [{ field: 'id' }, { field: 'name', editable: true }];
                    render(<TestCase />);
                    expect((0, helperFn_1.getCell)(0, 1).textContent).to.equal('Joe');
                    expect((0, helperFn_1.getCell)(4, 1).textContent).to.equal('Cory');
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([
                                        { id: 3, name: 'Marcus' },
                                        { id: 4, name: 'Tom' },
                                    ])];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getCell)(0, 1).textContent).to.equal('Marcus');
                    expect((0, helperFn_1.getCell)(4, 1).textContent).to.equal('Tom');
                    return [2 /*return*/];
            }
        });
    }); });
});

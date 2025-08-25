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
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var skipIf_1 = require("test/utils/skipIf");
// TODO Move to utils
// Fix https://github.com/mui/mui-x/pull/2085/files/058f56ac3c729b2142a9a28b79b5b13535cdb819#diff-db85480a519a5286d7341e9b8957844762cf04cdacd946331ebaaaff287482ec
function createDragOverEvent(target) {
    var dragOverEvent = internal_test_utils_1.createEvent.dragOver(target);
    // Safari 13 doesn't have DragEvent.
    // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
    Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    return dragOverEvent;
}
describe('<DataGridPro /> - Column pinning', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestCase(_a) {
        var _b = _a.nbCols, nbCols = _b === void 0 ? 20 : _b, other = __rest(_a, ["nbCols"]);
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        var data = (0, x_data_grid_generator_1.useBasicDemoData)(1, nbCols);
        return (<div style={{ width: 302, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro {...data} apiRef={apiRef} {...other}/>
      </div>);
    }
    function ResizeObserverMock(callback) {
        var timeout;
        return {
            observe: function (element) {
                // Simulates the async behavior of the native ResizeObserver
                timeout = setTimeout(function () {
                    callback([{ borderBoxSize: [{ blockSize: element.clientHeight }] }]);
                });
            },
            disconnect: function () {
                clearTimeout(timeout);
            },
            unobserve: function () {
                clearTimeout(timeout);
            },
        };
    }
    var originalResizeObserver = window.ResizeObserver;
    beforeEach(function () {
        var userAgent = window.navigator.userAgent;
        if (userAgent.includes('Chrome') && !userAgent.includes('Headless')) {
            // Only use the mock in non-headless Chrome
            window.ResizeObserver = ResizeObserverMock;
        }
    });
    afterEach(function () {
        window.ResizeObserver = originalResizeObserver;
    });
    it.skipIf(skipIf_1.isJSDOM)('should scroll when the next cell to focus is covered by the left pinned columns', function () {
        render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }}/>);
        var virtualScroller = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.virtualScroller));
        virtualScroller.scrollLeft = 100;
        (0, internal_test_utils_1.act)(function () { return virtualScroller.dispatchEvent(new Event('scroll')); });
        var cell = (0, helperFn_1.getCell)(0, 2);
        fireUserEvent_1.fireUserEvent.mousePress(cell);
        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'ArrowLeft' });
        expect(virtualScroller.scrollLeft).to.equal(0);
    });
    it.skipIf(skipIf_1.isJSDOM)('should scroll when the next cell to focus is covered by the right pinned columns', function () {
        render(<TestCase initialState={{ pinnedColumns: { right: ['price16M'] } }}/>);
        var virtualScroller = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.virtualScroller));
        expect(virtualScroller.scrollLeft).to.equal(0);
        var cell = (0, helperFn_1.getCell)(0, 1);
        fireUserEvent_1.fireUserEvent.mousePress(cell);
        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'ArrowRight' });
        expect(virtualScroller.scrollLeft).to.equal(100);
    });
    it.skipIf(skipIf_1.isJSDOM)('should increase the width of right pinned columns by resizing to the left', function () {
        render(<TestCase nbCols={3} initialState={{ pinnedColumns: { right: ['price1M'] } }}/>);
        var columnHeader = (0, helperFn_1.getColumnHeaderCell)(2);
        expect(columnHeader).toHaveInlineStyle({ width: '100px' });
        var separator = columnHeader.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
        internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 200 });
        internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 190, buttons: 1 });
        internal_test_utils_1.fireEvent.mouseUp(separator);
        expect(columnHeader).toHaveInlineStyle({ width: '110px' });
        expect(separator).to.have.class(x_data_grid_pro_1.gridClasses['columnSeparator--sideLeft']);
    });
    it.skipIf(skipIf_1.isJSDOM)('should reduce the width of right pinned columns by resizing to the right', function () {
        render(<TestCase nbCols={3} initialState={{ pinnedColumns: { right: ['price1M'] } }}/>);
        var columnHeader = (0, helperFn_1.getColumnHeaderCell)(2);
        expect(columnHeader).toHaveInlineStyle({ width: '100px' });
        var separator = columnHeader.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
        internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 200 });
        internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 210, buttons: 1 });
        internal_test_utils_1.fireEvent.mouseUp(separator);
        expect(columnHeader).toHaveInlineStyle({ width: '90px' });
        expect(separator).to.have.class(x_data_grid_pro_1.gridClasses['columnSeparator--sideLeft']);
    });
    it('should not allow to drag pinned columns', function () {
        render(<TestCase nbCols={3} initialState={{ pinnedColumns: { left: ['id'], right: ['price1M'] } }}/>);
        expect((0, helperFn_1.getColumnHeaderCell)(0).firstChild).to.have.attribute('draggable', 'false');
        expect((0, helperFn_1.getColumnHeaderCell)(2).firstChild).to.have.attribute('draggable', 'false');
    });
    it('should not allow to drop a column on top of a pinned column', function () {
        var onPinnedColumnsChange = (0, sinon_1.spy)();
        render(<TestCase nbCols={3} initialState={{ pinnedColumns: { right: ['price1M'] } }} onPinnedColumnsChange={onPinnedColumnsChange}/>);
        var dragCol = (0, helperFn_1.getColumnHeaderCell)(1).firstChild;
        var targetCell = (0, helperFn_1.getCell)(0, 2);
        internal_test_utils_1.fireEvent.dragStart(dragCol);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        expect(onPinnedColumnsChange.callCount).to.equal(0);
    });
    it('should filter out invalid columns when blocking a column from being dropped', function () {
        render(<TestCase nbCols={3} initialState={{ pinnedColumns: { left: ['foo', 'bar'] } }}/>);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'Currency Pair', '1M']);
        var dragCol = (0, helperFn_1.getColumnHeaderCell)(0).firstChild;
        var targetCell = (0, helperFn_1.getCell)(0, 1);
        internal_test_utils_1.fireEvent.dragStart(dragCol);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Currency Pair', 'id', '1M']);
    });
    it('should not override the first left pinned column when checkboxSelection=true', function () {
        render(<TestCase nbCols={2} initialState={{ pinnedColumns: { left: ['id'] } }} checkboxSelection/>);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', '', 'Currency Pair']);
    });
    // Doesn't work with mocked window.getComputedStyle
    it.skipIf(skipIf_1.isJSDOM)('should add border to right pinned columns section when `showCellVerticalBorder={true}`', function () {
        render(<div style={{ width: 300, height: 500 }}>
          <TestCase showCellVerticalBorder initialState={{ pinnedColumns: { right: ['id'] } }}/>
        </div>);
        var computedStyle = window.getComputedStyle(document.querySelector('.MuiDataGrid-cell--pinnedRight'));
        var borderLeftColor = computedStyle.getPropertyValue('border-left-color');
        var borderLeftWidth = computedStyle.getPropertyValue('border-left-width');
        expect(borderLeftWidth).to.equal('1px');
        // should not be transparent
        expect(borderLeftColor).not.to.equal('rgba(0, 0, 0, 0)');
    });
    // https://github.com/mui/mui-x/issues/12431
    it.skipIf(skipIf_1.isJSDOM)('should not render unnecessary filler after the last row', function () {
        var _a;
        var rowHeight = 50;
        var columns = [
            { field: 'id', headerName: 'ID', width: 120 },
            { field: 'name', headerName: 'Name', width: 120 },
        ];
        var rows = [
            { id: 1, name: 'Robert Cooper' },
            { id: 2, name: 'Dora Wallace' },
            { id: 3, name: 'Howard Dixon' },
            { id: 4, name: 'Essie Reynolds' },
        ];
        render(<div style={{ height: 300, width: 300 }}>
        <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} initialState={{ pinnedColumns: { left: ['name'] } }} rowHeight={rowHeight} columnHeaderHeight={rowHeight}/>
      </div>);
        expect((_a = (0, helperFn_1.grid)('virtualScroller')) === null || _a === void 0 ? void 0 : _a.scrollHeight).to.equal((rows.length + 1) * rowHeight);
    });
    describe('props: onPinnedColumnsChange', function () {
        it('should call when a column is pinned', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handlePinnedColumnsChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handlePinnedColumnsChange = (0, sinon_1.spy)();
                        render(<TestCase onPinnedColumnsChange={handlePinnedColumnsChange}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('currencyPair', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                    case 1:
                        _a.sent();
                        expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
                            left: ['currencyPair'],
                            right: [],
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('price17M', x_data_grid_pro_1.GridPinnedColumnPosition.RIGHT); })];
                    case 2:
                        _a.sent();
                        expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
                            left: ['currencyPair'],
                            right: ['price17M'],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not change the pinned columns when it is called', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handlePinnedColumnsChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handlePinnedColumnsChange = (0, sinon_1.spy)();
                        render(<TestCase pinnedColumns={{ left: ['currencyPair'] }} onPinnedColumnsChange={handlePinnedColumnsChange}/>);
                        expect((0, helperFn_1.$$)("[role=\"gridcell\"].".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft']))).to.have.length(1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('price17M', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.$$)("[role=\"gridcell\"].".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft']))).to.have.length(1);
                        expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
                            left: ['currencyPair', 'price17M'],
                            right: [],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: pinnedColumns', function () {
        it('should pin the columns specified', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cell;
            return __generator(this, function (_a) {
                render(<TestCase pinnedColumns={{ left: ['currencyPair'] }}/>);
                cell = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"currencyPair\"]"));
                expect(cell).not.to.equal(null);
                return [2 /*return*/];
            });
        }); });
        it("should not change the pinned columns if the prop didn't change", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase pinnedColumns={{ left: ['currencyPair'] }}/>);
                        expect(document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"currencyPair\"]"))).not.to.equal(null);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('price17M', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                    case 1:
                        _a.sent();
                        expect(document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"currencyPair\"]"))).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter our duplicated columns', function () {
            render(<TestCase pinnedColumns={{ left: ['currencyPair'], right: ['currencyPair'] }}/>);
            var cell = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"currencyPair\"]"));
            expect(cell).not.to.equal(null);
            expect(document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedRight'], "[data-field=\"currencyPair\"]"))).to.equal(null);
        });
    });
    describe('prop: disableColumnPinning', function () {
        it('should not add any button to the column menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase disableColumnPinning/>).user;
                        columnCell = document.querySelector('[role="columnheader"][data-field="id"]');
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        return [4 /*yield*/, user.click(menuIconButton)];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Pin to left' })).to.equal(null);
                        expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Pin to right' })).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to pin column using `initialState.pinnedColumns` prop', function () {
            render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} disableColumnPinning/>);
            var cell = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"id\"]"));
            expect(cell).not.to.equal(null);
        });
        it('should allow to pin column using `pinnedColumns` prop', function () {
            render(<TestCase pinnedColumns={{ left: ['id'] }} disableColumnPinning/>);
            var cell = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"id\"]"));
            expect(cell).not.to.equal(null);
        });
        it('should allow to pin column using `apiRef.current.pinColumn`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase disableColumnPinning/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('id', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                    case 1:
                        _a.sent();
                        cell = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"id\"]"));
                        expect(cell).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiRef', function () {
        it('should reorder the columns to render the left pinned columns before all other columns', function () {
            render(<TestCase initialState={{ pinnedColumns: { left: ['currencyPair', 'price1M'] } }}/>);
            expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"currencyPair\"]"))).not.to.equal(null);
            expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"price1M\"]"))).not.to.equal(null);
        });
        it('should reorder the columns to render the right pinned columns after all other columns', function () {
            render(<TestCase initialState={{ pinnedColumns: { right: ['price16M', 'price17M'] } }}/>);
            expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedRight'], "[data-field=\"price16M\"]"))).not.to.equal(null);
            expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedRight'], "[data-field=\"price17M\"]"))).not.to.equal(null);
        });
        it('should not crash if a non-existent column is pinned', function () {
            expect(function () {
                render(<TestCase initialState={{ pinnedColumns: { left: ['currency'] } }}/>);
            }).not.to.throw();
            expect(function () {
                render(<TestCase initialState={{ pinnedColumns: { right: ['currency'] } }}/>);
            }).not.to.throw();
        });
        describe('pinColumn', function () {
            it('should pin the given column', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            render(<TestCase />);
                            expect((_a = (0, helperFn_1.$)('[data-field="currencyPair"]')) === null || _a === void 0 ? void 0 : _a.className).not.to.include('pinned');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('currencyPair', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                        case 1:
                            _b.sent();
                            expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"currencyPair\"]"))).not.to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should change the side when called on a pinned column', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderZone;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            renderZone = (0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses.virtualScrollerRenderZone));
                            expect((0, helperFn_1.$)(renderZone, '[data-field="currencyPair"]').className).not.to.include('pinned');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('currencyPair', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.$)(renderZone, ".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"currencyPair\"]"))).not.to.equal(null);
                            expect((0, helperFn_1.$)(renderZone, '[data-field="currencyPair"]').className).to.include('pinned');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('currencyPair', x_data_grid_pro_1.GridPinnedColumnPosition.RIGHT); })];
                        case 2:
                            _a.sent();
                            expect((0, helperFn_1.$$)(renderZone, ".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'])).length).to.equal(0);
                            expect((0, helperFn_1.$)(renderZone, ".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedRight'], "[data-field=\"currencyPair\"]"))).not.to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not change the columns when called on a pinned column with the same side', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('currencyPair', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.$$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft']))).to.have.length(1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('currencyPair', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                        case 2:
                            _a.sent();
                            expect((0, helperFn_1.$$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft']))).to.have.length(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('unpinColumn', function () {
            it('should unpin the given column', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderZone;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('currencyPair', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT); })];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.$$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'])).length).not.to.equal(0);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.unpinColumn('currencyPair'); })];
                        case 2:
                            _a.sent();
                            expect((0, helperFn_1.$$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'])).length).to.equal(0);
                            renderZone = (0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses.virtualScrollerRenderZone));
                            expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('isColumnPinned', function () {
            it('should return the correct value', function () {
                var _a, _b, _c;
                render(<TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }}/>);
                expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.isColumnPinned('id')).to.equal(x_data_grid_pro_1.GridPinnedColumnPosition.LEFT);
                expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.isColumnPinned('price16M')).to.equal(x_data_grid_pro_1.GridPinnedColumnPosition.RIGHT);
                expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.isColumnPinned('currencyPair')).to.equal(false);
            });
        });
        // See https://github.com/mui/mui-x/issues/7819
        describe('`getCellElement` method should return cell element', function () {
            it('should return the correct value', function () {
                var _a;
                render(<TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }}/>);
                var cellElement = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getCellElement(0, 'currencyPair');
                expect(cellElement).not.to.equal(null);
            });
        });
    });
    describe('column menu', function () {
        it('should pin the column to the left when clicking the "Pin to left" pinning button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        columnCell = (0, helperFn_1.$)('[role="columnheader"][data-field="id"]');
                        menuIconButton = columnCell.querySelector('button[aria-label="id column menu"]');
                        return [4 /*yield*/, user.click(menuIconButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Pin to left' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"id\"]"))).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pin the column to the right when clicking the "Pin to right" pinning button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        columnCell = (0, helperFn_1.$)('[role="columnheader"][data-field="id"]');
                        menuIconButton = columnCell.querySelector('button[aria-label="id column menu"]');
                        return [4 /*yield*/, user.click(menuIconButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Pin to right' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedRight'], "[data-field=\"id\"]"))).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to invert the side when clicking on "Pin to right" pinning button on a left pinned column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }}/>).user;
                        columnCell = (0, helperFn_1.$)('[role="columnheader"][data-field="id"]');
                        menuIconButton = columnCell.querySelector('button[aria-label="id column menu"]');
                        return [4 /*yield*/, user.click(menuIconButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Pin to right' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"id\"]"))).to.equal(null);
                        expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedRight'], "[data-field=\"id\"]"))).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to invert the side when clicking on "Pin to left" pinning button on a right pinned column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase initialState={{ pinnedColumns: { right: ['id'] } }}/>).user;
                        columnCell = (0, helperFn_1.$)('[role="columnheader"][data-field="id"]');
                        menuIconButton = columnCell.querySelector('button[aria-label="id column menu"]');
                        return [4 /*yield*/, user.click(menuIconButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Pin to left' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedRight'], "[data-field=\"id\"]"))).to.equal(null);
                        expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"id\"]"))).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to unpin a pinned left column when clicking "Unpin" pinning button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }}/>).user;
                        columnCell = (0, helperFn_1.$)('[role="columnheader"][data-field="id"]');
                        menuIconButton = columnCell.querySelector('button[aria-label="id column menu"]');
                        return [4 /*yield*/, user.click(menuIconButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Unpin' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.$)(".".concat(x_data_grid_pro_1.gridClasses['cell--pinnedLeft'], "[data-field=\"id\"]"))).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('with fake timers', function () {
            it('should not render menu items if the column has `pinnable` equals to false', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, brandHeader, yearHeader;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<TestCase columns={[
                                    { field: 'brand', pinnable: true },
                                    { field: 'year', pinnable: false },
                                ]} rows={[{ id: 0, brand: 'Nike', year: 1941 }]}/>).user;
                            brandHeader = document.querySelector('[role="columnheader"][data-field="brand"]');
                            return [4 /*yield*/, user.click(brandHeader.querySelector('button[aria-label="brand column menu"]'))];
                        case 1:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Pin to left' })).not.to.equal(null);
                            return [4 /*yield*/, user.keyboard('[Escape]')];
                        case 2:
                            _a.sent();
                            // Ensure that the first menu was closed
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Pin to left' })).to.equal(null);
                                })];
                        case 3:
                            // Ensure that the first menu was closed
                            _a.sent();
                            yearHeader = document.querySelector('[role="columnheader"][data-field="year"]');
                            return [4 /*yield*/, user.click(yearHeader.querySelector('button[aria-label="year column menu"]'))];
                        case 4:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Pin to left' })).to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('restore column position after unpinning', function () {
        it('should restore the position when unpinning existing columns', function () {
            var setProps = render(<TestCase nbCols={4} checkboxSelection disableVirtualization/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['', 'id', 'Currency Pair', '1M', '2M']);
            setProps({ pinnedColumns: { left: ['currencyPair', 'id'], right: ['__check__'] } });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Currency Pair', 'id', '1M', '2M', '']);
            setProps({ pinnedColumns: { left: [], right: [] } });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['', 'id', 'Currency Pair', '1M', '2M']);
        });
        it('should restore the position when unpinning a column added after the first pinned column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<TestCase nbCols={2} disableVirtualization/>).setProps;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'Currency Pair']);
                        setProps({ pinnedColumns: { left: ['currencyPair'] } });
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Currency Pair', 'id']);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                var _a;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([{ field: 'foo' }, { field: 'bar' }]);
                            })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Currency Pair', 'id', 'foo', 'bar']);
                        setProps({ pinnedColumns: { left: ['currencyPair', 'foo'] } });
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Currency Pair', 'foo', 'id', 'bar']);
                        setProps({ pinnedColumns: {} });
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'Currency Pair', 'foo', 'bar']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should restore the position of a column pinned before it is added', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<TestCase nbCols={2} pinnedColumns={{ left: ['foo'] }} disableVirtualization/>).setProps;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'Currency Pair']);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([{ field: 'foo' }, { field: 'bar' }]); })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['foo', 'id', 'Currency Pair', 'bar']);
                        setProps({ pinnedColumns: {} });
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'Currency Pair', 'foo', 'bar']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should restore the position of a column unpinned after a column is removed', function () {
            var setProps = render(<TestCase nbCols={3} columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]} pinnedColumns={{ left: ['price1M'] }} disableVirtualization/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['price1M', 'id', 'currencyPair']);
            setProps({ columns: [{ field: 'id' }, { field: 'price1M' }] });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['price1M', 'id']);
            setProps({ pinnedColumns: {}, columns: [{ field: 'id' }, { field: 'price1M' }] });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'price1M']);
        });
        it('should restore the position when the neighboring columns are reordered', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<TestCase nbCols={4} disableVirtualization/>).setProps;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'Currency Pair', '1M', '2M']); // price1M's index = 2
                        setProps({ pinnedColumns: { left: ['price1M'] } });
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['1M', 'id', 'Currency Pair', '2M']);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnIndex('id', 2); })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['1M', 'Currency Pair', 'id', '2M']);
                        setProps({ pinnedColumns: {} });
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Currency Pair', 'id', '1M', '2M']); // price1M's index = 2
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not crash when unpinning the first column', function () {
            var setProps = render(<TestCase nbCols={3} columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]} pinnedColumns={{ left: ['id', 'currencyPair'] }} disableVirtualization/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'currencyPair', 'price1M']);
            setProps({ pinnedColumns: { left: ['currencyPair'] } });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['currencyPair', 'id', 'price1M']);
        });
        it('should not crash when unpinning the last column', function () {
            var setProps = render(<TestCase nbCols={3} columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]} pinnedColumns={{ right: ['currencyPair', 'price1M'] }} disableVirtualization/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'currencyPair', 'price1M']);
            setProps({ pinnedColumns: { right: ['currencyPair'] } });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'price1M', 'currencyPair']);
        });
        it('should not crash when removing a pinned column', function () {
            var setProps = render(<TestCase nbCols={3} columns={[{ field: 'id' }, { field: 'currencyPair' }, { field: 'price1M' }]} pinnedColumns={{ right: ['currencyPair'] }} disableVirtualization/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'price1M', 'currencyPair']);
            setProps({
                pinnedColumns: { right: [] },
                columns: [{ field: 'id' }, { field: 'price1M' }],
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'price1M']);
        });
    });
    describe('Column grouping', function () {
        var columns = [
            { field: 'id', headerName: 'ID', width: 90 },
            {
                field: 'firstName',
                headerName: 'First name',
                width: 150,
            },
            {
                field: 'lastName',
                headerName: 'Last name',
                width: 150,
            },
            {
                field: 'age',
                headerName: 'Age',
                type: 'number',
                width: 110,
            },
        ];
        var rows = [
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
            { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
            { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
            { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
            { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
            { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
            { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
            { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
            { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
        ];
        var columnGroupingModel = [
            {
                groupId: 'Internal',
                description: '',
                children: [{ field: 'id' }],
            },
            {
                groupId: 'Basic info',
                children: [
                    {
                        groupId: 'Full name',
                        children: [{ field: 'lastName' }, { field: 'firstName' }],
                    },
                    { field: 'age' },
                ],
            },
        ];
        it('should create separate column groups for pinned and non-pinned columns having same column group', function () {
            render(<TestCase columns={columns} rows={rows} columnGroupingModel={columnGroupingModel} initialState={{ pinnedColumns: { right: ['age'] } }}/>);
            var firstNameLastNameColumnGroupHeader = document.querySelector('[role="columnheader"][data-fields="|-firstName-|-lastName-|"]');
            expect(firstNameLastNameColumnGroupHeader.textContent).to.equal('Basic info');
            var ageCellColumnGroupHeader = document.querySelector('[role="columnheader"][data-fields="|-age-|"]');
            expect(ageCellColumnGroupHeader.textContent).to.equal('Basic info');
        });
    });
    describe('pinned columns order in column management', function () {
        it('should keep pinned column order in column management panel when toggling columns', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCheckboxes, checkboxesAfterToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={[{ id: 1, brand: 'Nike' }]} columns={[{ field: 'id' }, { field: 'brand' }]} showToolbar initialState={{
                                pinnedColumns: {
                                    left: ['brand'],
                                },
                            }}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        columnCheckboxes = internal_test_utils_1.screen.getAllByRole('checkbox');
                        expect(columnCheckboxes[0]).to.have.attribute('name', 'brand');
                        expect(columnCheckboxes[1]).to.have.attribute('name', 'id');
                        return [4 /*yield*/, user.click(columnCheckboxes[1])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 4:
                        _a.sent();
                        checkboxesAfterToggle = internal_test_utils_1.screen.getAllByRole('checkbox');
                        expect(checkboxesAfterToggle[0]).to.have.attribute('name', 'brand');
                        expect(checkboxesAfterToggle[1]).to.have.attribute('name', 'id');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should keep pinned column order in column management panel when clicking show/hide all checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCheckboxes, checkboxesAfterToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={[{ id: 0, brand: 'Nike' }]} columns={[{ field: 'id' }, { field: 'brand' }]} showToolbar initialState={{
                                pinnedColumns: {
                                    left: ['brand'],
                                },
                            }}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        columnCheckboxes = internal_test_utils_1.screen.getAllByRole('checkbox');
                        expect(columnCheckboxes[0]).to.have.attribute('name', 'brand');
                        expect(columnCheckboxes[1]).to.have.attribute('name', 'id');
                        return [4 /*yield*/, user.click(columnCheckboxes[columnCheckboxes.length - 1])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 4:
                        _a.sent();
                        checkboxesAfterToggle = internal_test_utils_1.screen.getAllByRole('checkbox');
                        expect(checkboxesAfterToggle[0]).to.have.attribute('name', 'brand');
                        expect(checkboxesAfterToggle[1]).to.have.attribute('name', 'id');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update column order when pinned columns are updated', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnCheckboxes, checkboxesAfterPinning;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={[{ id: 0, brand: 'Nike', price: 100 }]} columns={[{ field: 'id' }, { field: 'brand' }, { field: 'price' }]} showToolbar initialState={{
                                pinnedColumns: {},
                                columns: {
                                    columnVisibilityModel: { id: false },
                                },
                            }}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        columnCheckboxes = internal_test_utils_1.screen.getAllByRole('checkbox');
                        expect(columnCheckboxes[0]).to.have.attribute('name', 'id');
                        expect(columnCheckboxes[1]).to.have.attribute('name', 'brand');
                        expect(columnCheckboxes[2]).to.have.attribute('name', 'price');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                var _a, _b;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.pinColumn('brand', x_data_grid_pro_1.GridPinnedColumnPosition.LEFT);
                                (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.pinColumn('id', x_data_grid_pro_1.GridPinnedColumnPosition.RIGHT);
                            })];
                    case 2:
                        _a.sent();
                        checkboxesAfterPinning = internal_test_utils_1.screen.getAllByRole('checkbox');
                        expect(checkboxesAfterPinning[0]).to.have.attribute('name', 'brand');
                        expect(checkboxesAfterPinning[1]).to.have.attribute('name', 'price');
                        expect(checkboxesAfterPinning[2]).to.have.attribute('name', 'id');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});

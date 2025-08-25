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
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var sinon_1 = require("sinon");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
function createDragOverEvent(target) {
    var dragOverEvent = internal_test_utils_1.createEvent.dragOver(target);
    // Safari 13 doesn't have DragEvent.
    // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
    Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    return dragOverEvent;
}
function createDragEndEvent(target, isOutsideTheGrid) {
    if (isOutsideTheGrid === void 0) { isOutsideTheGrid = false; }
    var dragEndEvent = internal_test_utils_1.createEvent.dragEnd(target);
    Object.defineProperty(dragEndEvent, 'dataTransfer', {
        value: { dropEffect: isOutsideTheGrid ? 'none' : 'copy' },
    });
    return dragEndEvent;
}
describe('<DataGridPro /> - Columns reorder', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: isJSDOM,
        rows: [
            {
                id: 0,
                brand: 'Nike',
            },
            {
                id: 1,
                brand: 'Adidas',
            },
        ],
        columns: [{ field: 'id' }, { field: 'brand' }],
    };
    it('resizing after columns reorder should respect the new columns order', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase(props) {
            var width = props.width;
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: width, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} columns={baselineProps.columns} rows={baselineProps.rows}/>
        </div>);
        }
        var apiRef, setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<TestCase width={300}/>).setProps;
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'brand']);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnIndex('id', 1); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        setProps({ width: 200 });
                                        // `hydrateRowsMeta()` inside `ResizeObserver -> requestAnimationFrame()`
                                        return [4 /*yield*/, (0, helperFn_1.raf)()];
                                    case 1:
                                        // `hydrateRowsMeta()` inside `ResizeObserver -> requestAnimationFrame()`
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'id']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not reset the column order when a prop change', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Test() {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} rows={rows} columns={columns}/>
        </div>);
        }
        var apiRef, rows, columns, forceUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rows = [{ id: 0, brand: 'Nike' }];
                    columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];
                    forceUpdate = render(<Test />).forceUpdate;
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnIndex('brand', 2); })];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['desc', 'type', 'brand']);
                    forceUpdate(); // test stability
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['desc', 'type', 'brand']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow to reorder columns by dropping outside the header row', function () {
        var rows = [{ id: 0, brand: 'Nike' }];
        var columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
        var dragCol = (0, helperFn_1.getColumnHeaderCell)(0).firstChild;
        var targetCell = (0, helperFn_1.getCell)(0, 2);
        internal_test_utils_1.fireEvent.dragStart(dragCol);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['desc', 'type', 'brand']);
        var dragEndEvent = createDragEndEvent(dragCol);
        (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['desc', 'type', 'brand']);
    });
    it('should cancel the reordering when dropping the column outside the grid', function () {
        var rows = [{ id: 0, brand: 'Nike' }];
        var columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
        var dragCol = (0, helperFn_1.getColumnHeaderCell)(0).firstChild;
        var targetCell = (0, helperFn_1.getCell)(0, 2);
        internal_test_utils_1.fireEvent.dragStart(dragCol);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['desc', 'type', 'brand']);
        var dragEndEvent = createDragEndEvent(dragCol, true);
        (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
    });
    it('should keep the order of the columns when dragStart is fired and disableColumnReorder=true', function () {
        var rows = [{ id: 0, brand: 'Nike' }];
        var columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} disableColumnReorder/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
        var columnHeader = (0, helperFn_1.getColumnHeaderCell)(0);
        var columnHeaderDraggableContainer = columnHeader.firstChild;
        internal_test_utils_1.fireEvent.dragStart(columnHeaderDraggableContainer.firstChild);
        expect(columnHeaderDraggableContainer).not.to.have.class(x_data_grid_pro_1.gridClasses['columnHeader--dragging']);
    });
    it('should keep the order of the columns when dragEnd is fired and disableColumnReorder=true', function () {
        var rows = [{ id: 0, brand: 'Nike' }];
        var columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} disableColumnReorder/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
        var dragCol = (0, helperFn_1.getColumnHeaderCell)(2).firstChild;
        var dragEndEvent = createDragEndEvent(dragCol, true);
        (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
    });
    it('should call onColumnOrderChange after the column has been reordered', function () {
        var onColumnOrderChange = (0, sinon_1.spy)();
        function Test() {
            var data = (0, x_data_grid_generator_1.useBasicDemoData)(1, 3);
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...data} onColumnOrderChange={onColumnOrderChange}/>
        </div>);
        }
        render(<Test />);
        var dragCol = (0, helperFn_1.getColumnHeaderCell)(0).firstChild;
        var targetCell = (0, helperFn_1.getCell)(0, 2);
        internal_test_utils_1.fireEvent.dragStart(dragCol);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        var dragEndEvent = createDragEndEvent(dragCol);
        (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
        expect(onColumnOrderChange.callCount).to.equal(1);
        expect(onColumnOrderChange.lastCall.args[2].api.state.columns.orderedFields).to.deep.equal([
            'currencyPair',
            'price1M',
            'id',
        ]);
    });
    describe('column - disableReorder', function () {
        it('should not allow to start dragging a column with disableReorder=true', function () {
            var rows = [{ id: 0, brand: 'Nike' }];
            var columns = [
                { field: 'brand' },
                { field: 'desc', disableReorder: true },
                { field: 'type' },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(0).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            expect(dragCol).to.have.attribute('draggable', 'false');
            expect(dragCol).not.to.have.class(x_data_grid_pro_1.gridClasses['columnHeader--dragging']);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
        });
        it('should not allow to drag left of first visible column if it has disableReorder=true', function () {
            var rows = [{ id: 0, brand: 'Nike' }];
            var columns = [
                { field: 'brand', disableReorder: true },
                { field: 'desc' },
                { field: 'type' },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(0).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
        });
        it('should not allow to drag right of last visible column if it has disableReorder=true', function () {
            var rows = [{ id: 0, brand: 'Nike' }];
            var columns = [
                { field: 'brand' },
                { field: 'desc' },
                { field: 'type', disableReorder: true },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(2).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
        });
        it('should allow to drag right of a column with disableReorder=true if it is not the last visible one', function () {
            var rows = [{ id: 0, brand: 'Nike' }];
            var columns = [
                { field: 'brand' },
                { field: 'desc', disableReorder: true },
                { field: 'type' },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand', 'desc', 'type']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(0).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(2).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent2 = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent2);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['desc', 'type', 'brand']);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['desc', 'type', 'brand']);
        });
    });
    it('should prevent drag events propagation', function () {
        var handleDragStart = (0, sinon_1.spy)();
        var handleDragEnter = (0, sinon_1.spy)();
        var handleDragOver = (0, sinon_1.spy)();
        var handleDragEnd = (0, sinon_1.spy)();
        function Test() {
            var data = (0, x_data_grid_generator_1.useBasicDemoData)(3, 3);
            return (<div draggable onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragEnd={handleDragEnd} style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...data} rowReordering/>
        </div>);
        }
        render(<Test />);
        var dragCol = (0, helperFn_1.getColumnHeaderCell)(1).firstChild;
        var targetCell = (0, helperFn_1.getCell)(1, 2);
        internal_test_utils_1.fireEvent.dragStart(dragCol);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var dragOverCellEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverCellEvent);
        var dragEndColEvent = createDragEndEvent(dragCol);
        (0, internal_test_utils_1.fireEvent)(dragCol, dragEndColEvent);
        expect(handleDragStart.callCount).to.equal(0);
        expect(handleDragEnter.callCount).to.equal(0);
        expect(handleDragOver.callCount).to.equal(0);
        expect(handleDragEnd.callCount).to.equal(0);
    });
    describe('reorder with column grouping', function () {
        it('should not allow to drag column outside of its group', function () {
            var rows = [{ id: 0 }];
            var columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];
            var columnGroupingModel = [
                { groupId: 'col12', children: [{ field: 'col1' }, { field: 'col2' }] },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(0, 1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(2, 1).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent2 = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent2);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
        });
        describe('column - hidden', function () {
            it('should use the correct start and end index', function () {
                var rows = [{ id: 0 }];
                var columns = [
                    { field: 'col1' },
                    { field: 'col2' },
                    { field: 'col3' },
                    { field: 'col4' },
                ];
                var columnGroupingModel = [
                    { groupId: 'col23', children: [{ field: 'col2' }, { field: 'col3' }] },
                ];
                function Test() {
                    return (<div style={{ width: 300, height: 300 }}>
              <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} columnVisibilityModel={{ col1: false }}/>
            </div>);
                }
                render(<Test />);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col23', '', 'col2', 'col3', 'col4']);
                var dragCol = (0, helperFn_1.getColumnHeaderCell)(0, 1).firstChild;
                var col3 = (0, helperFn_1.getColumnHeaderCell)(1, 1).firstChild;
                var col4 = (0, helperFn_1.getColumnHeaderCell)(2, 1).firstChild;
                // Do not allow to move col2 after col4
                internal_test_utils_1.fireEvent.dragStart(dragCol);
                internal_test_utils_1.fireEvent.dragEnter(col3);
                var dragOverEvent1 = createDragOverEvent(col3);
                (0, internal_test_utils_1.fireEvent)(col3, dragOverEvent1);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col23', '', 'col3', 'col2', 'col4']);
                // Allow to move col2 after col3
                internal_test_utils_1.fireEvent.dragEnter(col4);
                var dragOverEvent2 = createDragOverEvent(col4);
                (0, internal_test_utils_1.fireEvent)(col4, dragOverEvent2);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col23', '', 'col3', 'col2', 'col4']);
            });
            it('should consider moving the column between hidden columns if it respect group constraint and visible behavior', function () {
                var rows = [{ id: 0 }];
                var columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];
                var columnGroupingModel = [
                    { groupId: 'col23', children: [{ field: 'col2' }, { field: 'col3' }] },
                ];
                function Test(props) {
                    return (<div style={{ width: 300, height: 300 }}>
              <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} columnVisibilityModel={{ col3: false }} {...props}/>
            </div>);
                }
                var setProps = render(<Test />).setProps;
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['', 'col23', 'col1', 'col2']);
                var dragCol = (0, helperFn_1.getColumnHeaderCell)(0, 1).firstChild;
                var targetCol = (0, helperFn_1.getColumnHeaderCell)(1, 1).firstChild;
                // Move col 1 after col 3 to respect column grouping consistency even if col3 is hidden
                internal_test_utils_1.fireEvent.dragStart(dragCol);
                internal_test_utils_1.fireEvent.dragEnter(targetCol);
                var dragOverEvent = createDragOverEvent(targetCol);
                (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col23', '', 'col2', 'col1']);
                setProps({ columnVisibilityModel: {} });
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col23', '', 'col2', 'col3', 'col1']);
            });
        });
        it('should not allow to drag column inside a group', function () {
            var rows = [{ id: 0 }];
            var columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];
            var columnGroupingModel = [
                { groupId: 'col12', children: [{ field: 'col1' }, { field: 'col2' }] },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(2, 1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(1, 1).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent2 = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent2);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
        });
        it('should allow to drag column outside of its group if it allows freeReordering', function () {
            var rows = [{ id: 0 }];
            var columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];
            var columnGroupingModel = [
                {
                    groupId: 'col12',
                    children: [{ field: 'col1' }, { field: 'col2' }],
                    freeReordering: true,
                },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(0, 1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(2, 1).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent2 = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent2);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col12',
                '',
                'col12',
                'col2',
                'col3',
                'col1',
            ]);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col12',
                '',
                'col12',
                'col2',
                'col3',
                'col1',
            ]);
        });
        it('should allow to drag column inside a group if it allows freeReordering', function () {
            // TODO: I observed columns are always moved from left to right
            // The reason being that is:
            // - when event.clientX does not change we consider that column is moving to the right
            // - fireEvent.dragStart always set event.clientX = 1 (did not managed to modify this behavior)
            var rows = [{ id: 0 }];
            var columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];
            var columnGroupingModel = [
                {
                    groupId: 'col23',
                    children: [{ field: 'col2' }, { field: 'col3' }],
                    freeReordering: true,
                },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['', 'col23', 'col1', 'col2', 'col3']);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(0, 1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(1, 1).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent2 = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent2);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col23',
                '',
                'col23',
                'col2',
                'col1',
                'col3',
            ]);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col23',
                '',
                'col23',
                'col2',
                'col1',
                'col3',
            ]);
        });
        it('should allow to split a group with freeReordering in another group', function () {
            var rows = [{ id: 0 }];
            var columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];
            var columnGroupingModel = [
                {
                    groupId: 'col123',
                    children: [
                        { field: 'col1' },
                        {
                            groupId: 'col23',
                            children: [{ field: 'col2' }, { field: 'col3' }],
                            freeReordering: true,
                        },
                    ],
                },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col123',
                '',
                'col23',
                'col1',
                'col2',
                'col3',
            ]);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(0, 2).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(1, 2).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent2 = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent2);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col123',
                'col23',
                '',
                'col23',
                'col2',
                'col1',
                'col3',
            ]);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col123',
                'col23',
                '',
                'col23',
                'col2',
                'col1',
                'col3',
            ]);
        });
        it('should block dragging outside of a group even at deeper level', function () {
            var rows = [{ id: 0 }];
            var columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];
            var columnGroupingModel = [
                {
                    groupId: 'col12',
                    children: [
                        { field: 'col1' },
                        {
                            groupId: 'col2',
                            children: [{ field: 'col2' }],
                            freeReordering: true,
                        },
                    ],
                },
            ];
            function Test() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel}/>
          </div>);
            }
            render(<Test />);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col12',
                '',
                '',
                'col2',
                '',
                'col1',
                'col2',
                'col3',
            ]);
            var dragCol = (0, helperFn_1.getColumnHeaderCell)(0, 1).firstChild;
            var targetCol = (0, helperFn_1.getColumnHeaderCell)(2, 1).firstChild;
            internal_test_utils_1.fireEvent.dragStart(dragCol);
            internal_test_utils_1.fireEvent.dragEnter(targetCol);
            var dragOverEvent2 = createDragOverEvent(targetCol);
            (0, internal_test_utils_1.fireEvent)(targetCol, dragOverEvent2);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col12',
                '',
                '',
                'col2',
                '',
                'col1',
                'col2',
                'col3',
            ]);
            var dragEndEvent = createDragEndEvent(dragCol);
            (0, internal_test_utils_1.fireEvent)(dragCol, dragEndEvent);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'col12',
                '',
                '',
                'col2',
                '',
                'col1',
                'col2',
                'col3',
            ]);
        });
    });
});

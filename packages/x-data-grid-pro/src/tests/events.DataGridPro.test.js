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
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var helperFn_1 = require("test/utils/helperFn");
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Events params', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        rows: [
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
        ],
        columns: [
            { field: 'id' },
            { field: 'first', editable: true },
            { field: 'age' },
            {
                field: 'firstAge',
                valueGetter: function (value, row) { return "".concat(row.first, "_").concat(row.age); },
                valueFormatter: function (value) { return "".concat(value, " yrs"); },
            },
        ],
    };
    var apiRef;
    function TestEvents(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} {...props} disableVirtualization/>
      </div>);
    }
    describe('columnHeaderParams', function () {
        it('should include the correct params', function () {
            var _a;
            var eventArgs = null;
            var handleClick = function (params, event) {
                eventArgs = { params: params, event: event };
            };
            render(<TestEvents onColumnHeaderClick={handleClick}/>);
            var ageColumnElement = (0, helperFn_1.getColumnHeaderCell)(2);
            internal_test_utils_1.fireEvent.click(ageColumnElement);
            expect(eventArgs.params).to.deep.include({
                colDef: (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getColumn('age'),
                field: 'age',
            });
        });
    });
    describe('RowsParams', function () {
        it('should include the correct params', function () {
            var _a;
            var eventArgs = null;
            var handleClick = function (params, event) {
                eventArgs = { params: params, event: event };
            };
            render(<TestEvents onRowClick={handleClick}/>);
            var row1 = (0, helperFn_1.getCell)(1, 0);
            internal_test_utils_1.fireEvent.click(row1);
            expect(eventArgs.params).to.deep.include({
                id: 2,
                row: baselineProps.rows[1],
                columns: (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getAllColumns(),
            });
        });
    });
    describe('CellsParams', function () {
        var eventArgs = null;
        var cell11;
        it('should include the correct params', function () {
            var _a;
            var handleClick = function (params, event) {
                eventArgs = { params: params, event: event };
            };
            render(<TestEvents onCellClick={handleClick}/>);
            cell11 = (0, helperFn_1.getCell)(1, 1);
            internal_test_utils_1.fireEvent.click(cell11);
            expect(eventArgs.params).to.deep.include({
                id: 2,
                value: 'Jack',
                formattedValue: 'Jack',
                isEditable: true,
                row: baselineProps.rows[1],
                colDef: (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getColumn('first'),
                hasFocus: false,
                tabIndex: -1,
            });
            expect(eventArgs.params.api).to.not.equal(null);
        });
        it('should include the correct params when grid is sorted', function () {
            var _a;
            var handleClick = function (params, event) {
                eventArgs = { params: params, event: event };
            };
            render(<TestEvents onCellClick={handleClick}/>);
            var header = internal_test_utils_1.screen
                .getByRole('columnheader', { name: 'first' })
                .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
            internal_test_utils_1.fireEvent.click(header);
            var cell01 = (0, helperFn_1.getCell)(0, 1);
            internal_test_utils_1.fireEvent.click(cell01);
            expect(eventArgs.params).to.deep.include({
                id: 2,
                value: 'Jack',
                formattedValue: 'Jack',
                isEditable: true,
                row: baselineProps.rows[1],
                colDef: (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getColumn('first'),
                hasFocus: false,
                tabIndex: -1,
            });
        });
        it('should consider value getter', function () {
            var handleClick = function (params, event) {
                eventArgs = { params: params, event: event };
            };
            render(<TestEvents onCellClick={handleClick}/>);
            var cellFirstAge = (0, helperFn_1.getCell)(1, 3);
            internal_test_utils_1.fireEvent.click(cellFirstAge);
            expect(eventArgs.params.value).to.equal('Jack_11');
        });
        it('should consider value formatter', function () {
            var handleClick = function (params, event) {
                eventArgs = { params: params, event: event };
            };
            render(<TestEvents onCellClick={handleClick}/>);
            var cellFirstAge = (0, helperFn_1.getCell)(1, 3);
            internal_test_utils_1.fireEvent.click(cellFirstAge);
            expect(eventArgs.params.formattedValue).to.equal('Jack_11 yrs');
        });
    });
    describe('onCellClick', function () {
        var eventStack = [];
        var push = function (name) { return function () {
            eventStack.push(name);
        }; };
        beforeEach(function () {
            eventStack = [];
        });
        it('should bubble to the row', function () {
            render(<TestEvents onCellClick={push('cellClick')} onRowClick={push('rowClick')}/>);
            var cell11 = (0, helperFn_1.getCell)(1, 1);
            internal_test_utils_1.fireEvent.click(cell11);
            expect(eventStack).to.deep.equal(['cellClick', 'rowClick']);
        });
        it('should allow to stop propagation', function () {
            var stopClick = function (params, event) {
                event.stopPropagation();
            };
            render(<TestEvents onCellClick={stopClick} onRowClick={push('rowClick')}/>);
            var cell11 = (0, helperFn_1.getCell)(1, 1);
            internal_test_utils_1.fireEvent.click(cell11);
            expect(eventStack).to.deep.equal([]);
        });
        it('should allow to prevent the default behavior', function () {
            var handleCellDoubleClick = (0, sinon_1.spy)(function (params, event) {
                event.defaultMuiPrevented = true;
            });
            render(<TestEvents onCellDoubleClick={handleCellDoubleClick}/>);
            var cell = (0, helperFn_1.getCell)(1, 1);
            internal_test_utils_1.fireEvent.doubleClick(cell);
            expect(handleCellDoubleClick.callCount).to.equal(1);
            expect(cell).not.to.have.class(x_data_grid_pro_1.gridClasses['row--editing']);
        });
        it('should allow to prevent the default behavior while allowing the event to propagate', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleCellEditStop, cell, input;
            return __generator(this, function (_a) {
                handleCellEditStop = (0, sinon_1.spy)(function (params, event) {
                    event.defaultMuiPrevented = true;
                });
                render(<TestEvents onCellEditStop={handleCellEditStop}/>);
                cell = (0, helperFn_1.getCell)(1, 1);
                expect(cell).not.to.have.class(x_data_grid_pro_1.gridClasses['cell--editing']);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(cell).to.have.class(x_data_grid_pro_1.gridClasses['cell--editing']);
                input = cell.querySelector('input');
                internal_test_utils_1.fireEvent.keyDown(input, { key: 'Enter' });
                expect(handleCellEditStop.callCount).to.equal(1);
                expect(cell).to.have.class(x_data_grid_pro_1.gridClasses['cell--editing']);
                return [2 /*return*/];
            });
        }); });
        it('should select a row by default', function () {
            var handleRowSelectionModelChange = (0, sinon_1.spy)();
            render(<TestEvents onRowSelectionModelChange={handleRowSelectionModelChange}/>);
            var cell11 = (0, helperFn_1.getCell)(1, 1);
            internal_test_utils_1.fireEvent.click(cell11);
            expect(handleRowSelectionModelChange.callCount).to.equal(1);
            expect(handleRowSelectionModelChange.lastCall.firstArg).to.deep.equal((0, helperFn_1.includeRowSelection)([2]));
        });
        it('should not select a row if props.disableRowSelectionOnClick', function () {
            var handleRowSelectionModelChange = (0, sinon_1.spy)();
            render(<TestEvents onRowSelectionModelChange={handleRowSelectionModelChange} disableRowSelectionOnClick/>);
            var cell11 = (0, helperFn_1.getCell)(1, 1);
            internal_test_utils_1.fireEvent.click(cell11);
            expect(handleRowSelectionModelChange.callCount).to.equal(0);
        });
    });
    describe('onRowClick', function () {
        var eventStack = [];
        var push = function (name) { return function () {
            eventStack.push(name);
        }; };
        beforeEach(function () {
            eventStack = [];
        });
        it('should be called when clicking a cell', function () {
            render(<TestEvents onRowClick={push('rowClick')}/>);
            var cell11 = (0, helperFn_1.getCell)(1, 1);
            internal_test_utils_1.fireEvent.click(cell11);
            expect(eventStack).to.deep.equal(['rowClick']);
        });
        it('should not be called when clicking the checkbox added by checkboxSelection', function () {
            render(<TestEvents onRowClick={push('rowClick')} checkboxSelection/>);
            var cell11 = (0, helperFn_1.getCell)(1, 0).querySelector('input');
            internal_test_utils_1.fireEvent.click(cell11);
            expect(eventStack).to.deep.equal([]);
        });
        it('should not be called when clicking in an action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestEvents onRowClick={push('rowClick')} rows={[{ id: 0 }]} columns={[
                                {
                                    field: 'actions',
                                    type: 'actions',
                                    getActions: function () { return [<x_data_grid_pro_1.GridActionsCellItem icon={<span />} label="print"/>]; },
                                },
                            ]}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'print' }))];
                    case 1:
                        _a.sent();
                        expect(eventStack).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not be called when opening the detail panel of a row', function () {
            render(<TestEvents onRowClick={push('rowClick')} getDetailPanelContent={function () { return <div />; }}/>);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0));
            expect(eventStack).to.deep.equal([]);
        });
        it('should not be called when expanding a group of rows', function () {
            render(<TestEvents onRowClick={push('rowClick')} rows={[
                    { id: 0, path: ['Group 1'] },
                    { id: 1, path: ['Group 1', 'Group 2'] },
                ]} getTreeDataPath={function (row) { return row.path; }} treeData/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'see children' }));
            expect(eventStack).to.deep.equal([]);
        });
        it('should not be called when clicking inside a cell being edited', function () {
            render(<TestEvents onRowClick={push('rowClick')}/>);
            var cell = (0, helperFn_1.getCell)(0, 1);
            internal_test_utils_1.fireEvent.doubleClick(cell);
            internal_test_utils_1.fireEvent.click(cell.querySelector('input'));
            expect(eventStack).to.deep.equal([]);
        });
    });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('lazy loaded grid should load the rest of the rows when mounted when virtualization is disabled', function () {
        var handleFetchRows = (0, sinon_1.spy)();
        render(<TestEvents onFetchRows={handleFetchRows} sortingMode="server" filterMode="server" rowsLoadingMode="server" paginationMode="server" rowCount={50}/>);
        expect(handleFetchRows.callCount).to.equal(1);
        expect(handleFetchRows.lastCall.firstArg).to.contain({
            firstRowToRender: 3,
            lastRowToRender: 50,
        });
    });
    it('publishing renderedRowsIntervalChange should call onFetchRows callback when rows lazy loading is enabled', function () {
        var handleFetchRows = (0, sinon_1.spy)();
        render(<TestEvents onFetchRows={handleFetchRows} sortingMode="server" filterMode="server" rowsLoadingMode="server" paginationMode="server" rowCount={50}/>);
        // Since rowheight < viewport height, onmount calls fetchRows directly
        expect(handleFetchRows.callCount).to.equal(1);
        (0, internal_test_utils_1.act)(function () {
            var _a;
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.publishEvent('renderedRowsIntervalChange', {
                firstRowIndex: 3,
                lastRowIndex: 10,
                firstColumnIndex: 0,
                lastColumnIndex: 0,
            });
        });
        expect(handleFetchRows.callCount).to.equal(2);
        expect(handleFetchRows.lastCall.firstArg).to.contain({
            firstRowToRender: 3,
            lastRowToRender: 10,
        });
    });
    it('should publish "unmount" event when unmounting the Grid', function () {
        var onUnmount = (0, sinon_1.spy)();
        var unmount = render(<TestEvents />).unmount;
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('unmount', onUnmount); });
        unmount();
        expect(onUnmount.calledOnce).to.equal(true);
    });
});

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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var vitest_1 = require("vitest");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Rows', function () {
    var baselineProps;
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('getRowId', function () {
        beforeEach(function () {
            baselineProps = {
                autoHeight: skipIf_1.isJSDOM,
                rows: [
                    {
                        clientId: 'c1',
                        first: 'Mike',
                        age: 11,
                    },
                    {
                        clientId: 'c2',
                        first: 'Jack',
                        age: 11,
                    },
                    {
                        clientId: 'c3',
                        first: 'Mike',
                        age: 20,
                    },
                ],
                columns: [{ field: 'clientId' }, { field: 'first' }, { field: 'age' }],
            };
        });
        it('should not crash with weird id', function () {
            var columns = [{ field: 'id' }];
            var rows = [{ id: "'1" }, { id: '"2' }];
            render(<div style={{ height: 300, width: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} checkboxSelection/>
        </div>);
        });
        it('should allow to switch between cell mode', function () {
            var apiRef;
            var editableProps = __assign({}, baselineProps);
            editableProps.columns = editableProps.columns.map(function (col) { return (__assign(__assign({}, col), { editable: true })); });
            var getRowId = function (row) { return "".concat(row.clientId); };
            function Test() {
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...editableProps} apiRef={apiRef} getRowId={getRowId}/>
          </div>);
            }
            render(<Test />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 'c2', field: 'first' }); });
            var cell = (0, helperFn_1.getCell)(1, 1);
            expect(cell).to.have.class('MuiDataGrid-cell--editable');
            expect(cell).to.have.class('MuiDataGrid-cell--editing');
            expect(cell.querySelector('input').value).to.equal('Jack');
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 'c2', field: 'first' }); });
            expect(cell).to.have.class('MuiDataGrid-cell--editable');
            expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
            expect(cell.querySelector('input')).to.equal(null);
        });
        it('should not clone the row', function () {
            var _a;
            var getRowId = function (row) { return "".concat(row.clientId); };
            var apiRef;
            function Test() {
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps} getRowId={getRowId} apiRef={apiRef}/>
          </div>);
            }
            render(<Test />);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRow('c1')).to.equal(baselineProps.rows[0]);
        });
    });
    describe('prop: rows', function () {
        it('should not throttle even when props.throttleRowsMs is defined', function () {
            var _a = (0, x_data_grid_generator_1.getBasicGridData)(5, 2), rows = _a.rows, columns = _a.columns;
            function Test(props) {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...props} columns={columns} autoHeight={skipIf_1.isJSDOM} throttleRowsMs={100} disableVirtualization/>
          </div>);
            }
            var setProps = render(<Test rows={rows.slice(0, 2)}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
            setProps({ rows: rows });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4']);
        });
    });
    describe('apiRef: updateRows', function () {
        beforeEach(function () {
            baselineProps = {
                autoHeight: skipIf_1.isJSDOM,
                rows: [
                    {
                        id: 0,
                        brand: 'Nike',
                    },
                    {
                        id: 1,
                        brand: 'Adidas',
                    },
                    {
                        id: 2,
                        brand: 'Puma',
                    },
                ],
                columns: [{ field: 'brand', headerName: 'Brand' }],
            };
        });
        var apiRef;
        function TestCase(props) {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef} {...props} disableVirtualization/>
        </div>);
        }
        describe('throttling', function () {
            beforeEach(function () {
                vitest_1.vi.useFakeTimers();
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it('should not throttle by default', function () {
                render(<TestCase />);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }]); });
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Fila', 'Puma']);
            });
            it('should allow to enable throttle', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase throttleRowsMs={100}/>);
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }])];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(10)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(100)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            // It seems that the trigger is not dependant only on timeout.
                            vitest_1.vi.useRealTimers();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Fila', 'Puma']);
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should allow to update row data', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Pata' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 2, brand: 'Pum' }]); });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Pata', 'Fila', 'Pum']);
        });
        it('update row data can also add rows', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Pata' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 2, brand: 'Pum' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 3, brand: 'Jordan' }]); });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
        });
        it('update row data can also add rows in bulk', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([
                    { id: 1, brand: 'Fila' },
                    { id: 0, brand: 'Pata' },
                    { id: 2, brand: 'Pum' },
                    { id: 3, brand: 'Jordan' },
                ]);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
        });
        it('update row data can also delete rows', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, _action: 'delete' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Apple' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 2, _action: 'delete' }]); });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 5, brand: 'Atari' }]); });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apple', 'Atari']);
        });
        it('update row data can also delete rows in bulk', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([
                    { id: 1, _action: 'delete' },
                    { id: 0, brand: 'Apple' },
                    { id: 2, _action: 'delete' },
                    { id: 5, brand: 'Atari' },
                ]);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apple', 'Atari']);
        });
        it('update row data should process getRowId', function () {
            function TestCaseGetRowId() {
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                var getRowId = React.useCallback(function (row) { return row.idField; }, []);
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef} rows={baselineProps.rows.map(function (row) { return ({ idField: row.id, brand: row.brand }); })} getRowId={getRowId}/>
          </div>);
            }
            render(<TestCaseGetRowId />);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([
                    { idField: 1, _action: 'delete' },
                    { idField: 0, brand: 'Apple' },
                    { idField: 2, _action: 'delete' },
                    { idField: 5, brand: 'Atari' },
                ]);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apple', 'Atari']);
        });
        it('should not loose partial updates after a props.loading switch', function () {
            function Test(props) {
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef} {...props}/>
          </div>);
            }
            var setProps = render(<Test />).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
            setProps({ loading: true });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Nike 2' }]); });
            setProps({ loading: false });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike 2', 'Adidas', 'Puma']);
        });
        it('should not trigger unnecessary cells rerenders', function () {
            var renderCellSpy = (0, sinon_1.spy)(function (params) {
                return params.value;
            });
            function Test() {
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro rows={[{ id: 1, name: 'John' }]} columns={[{ field: 'name', renderCell: renderCellSpy }]} apiRef={apiRef}/>
          </div>);
            }
            render(<Test />);
            var initialRendersCount = 2;
            expect(renderCellSpy.callCount).to.equal(initialRendersCount);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, name: 'John' }]); });
            expect(renderCellSpy.callCount).to.equal(initialRendersCount + 2);
        });
    });
    describe('apiRef: setRows', function () {
        beforeEach(function () {
            baselineProps = {
                autoHeight: skipIf_1.isJSDOM,
                rows: [
                    {
                        id: 0,
                        brand: 'Nike',
                    },
                    {
                        id: 1,
                        brand: 'Adidas',
                    },
                    {
                        id: 2,
                        brand: 'Puma',
                    },
                ],
                columns: [{ field: 'brand', headerName: 'Brand' }],
            };
        });
        var apiRef;
        function TestCase(props) {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef} {...props}/>
        </div>);
        }
        describe('throttling', function () {
            beforeEach(function () {
                vitest_1.vi.useFakeTimers();
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it('should not throttle by default', function () {
                render(<TestCase />);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows([{ id: 3, brand: 'Asics' }]); });
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics']);
            });
            it('should allow to enable throttle', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase throttleRowsMs={100}/>);
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows([{ id: 3, brand: 'Asics' }]); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(10)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                            expect(vitest_1.vi.getTimerCount()).to.equal(2);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, vitest_1.vi.advanceTimersByTimeAsync(100)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            expect(vitest_1.vi.getTimerCount()).to.equal(0);
                            // It seems that the trigger is not dependant only on timeout.
                            vitest_1.vi.useRealTimers();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics']);
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should work with `loading` prop change', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps, newRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<TestCase />).setProps;
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        newRows = [{ id: 3, brand: 'Asics' }];
                        setProps({ loading: true });
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows(newRows); });
                        setProps({ loading: false });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics']);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Need layouting
    describe.skipIf(skipIf_1.isJSDOM)('virtualization', function () {
        var apiRef;
        function TestCaseVirtualization(props) {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            var data = (0, x_data_grid_generator_1.useBasicDemoData)(props.nbRows || 100, props.nbCols || 10);
            return (<div style={{ width: props.width || 300, height: props.height || 300 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} columns={data.columns} rows={data.rows} {...props}/>
        </div>);
        }
        it('should compute rows correctly on height change', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<TestCaseVirtualization nbRows={5} nbCols={2} height={160} rowBufferPx={0}/>).setProps;
                        expect((0, helperFn_1.getRows)()).to.have.length(1);
                        setProps({
                            height: 220,
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getRows)()).to.have.length(3);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render last row when scrolling to the bottom', function () { return __awaiter(void 0, void 0, void 0, function () {
            var n, rowHeight, rowBufferPx, nbRows, height, headerHeight, innerHeight, virtualScroller, scrollbarSize, renderingZone, distanceToFirstRow;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        n = 4;
                        rowHeight = 50;
                        rowBufferPx = n * rowHeight;
                        nbRows = 996;
                        height = 600;
                        headerHeight = rowHeight;
                        innerHeight = height - headerHeight;
                        render(<TestCaseVirtualization nbRows={nbRows} columnHeaderHeight={headerHeight} rowHeight={rowHeight} rowBufferPx={rowBufferPx} hideFooter height={height}/>);
                        virtualScroller = (0, helperFn_1.grid)('virtualScroller');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    // scrollTo doesn't seem to work in this case
                                    virtualScroller.scrollTop = 1000000;
                                    virtualScroller.dispatchEvent(new Event('scroll'));
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var lastCell = (0, helperFn_1.$$)('[role="row"]:last-child [role="gridcell"]')[0];
                                expect(lastCell).to.have.text('995');
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var renderingZone = (0, helperFn_1.grid)('virtualScrollerRenderZone');
                                expect(renderingZone.children.length).to.equal(Math.floor(innerHeight / rowHeight) + n, 'children should have the correct length');
                            })];
                    case 3:
                        _b.sent();
                        scrollbarSize = ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.dimensions.scrollbarSize) || 0;
                        renderingZone = (0, helperFn_1.grid)('virtualScrollerRenderZone');
                        distanceToFirstRow = (nbRows - renderingZone.children.length) * rowHeight;
                        expect((0, helperFn_1.gridOffsetTop)()).to.equal(distanceToFirstRow, 'gridOffsetTop should be correct');
                        expect(virtualScroller.scrollHeight - scrollbarSize - headerHeight).to.equal(nbRows * rowHeight, 'scrollHeight should be correct');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have all the rows rendered of the page in the DOM when autoPageSize: true', function () {
            render(<TestCaseVirtualization autoPageSize pagination/>);
            expect((0, helperFn_1.getRows)()).to.have.length(apiRef.current.state.pagination.paginationModel.pageSize);
        });
        it('should have all the rows rendered in the DOM when autoPageSize: true', function () {
            render(<TestCaseVirtualization autoHeight/>);
            expect((0, helperFn_1.getRows)()).to.have.length(apiRef.current.state.pagination.paginationModel.pageSize);
        });
        it('should render extra columns when the columnBuffer prop is present', function () { return __awaiter(void 0, void 0, void 0, function () {
            var border, width, n, columnWidth, columnBufferPx, firstRow, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        border = 1;
                        width = 300;
                        n = 2;
                        columnWidth = 100;
                        columnBufferPx = n * columnWidth;
                        render(<TestCaseVirtualization width={width + border * 2} nbRows={1} columnBufferPx={columnBufferPx}/>);
                        firstRow = (0, helperFn_1.getRow)(0);
                        expect((0, helperFn_1.$$)(firstRow, '[role="gridcell"]')).to.have.length(Math.floor(width / columnWidth) + n);
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, virtualScroller.scrollTo({ left: 301 })];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.$$)(firstRow, '[role="gridcell"]')).to.have.length(n + 1 + Math.floor(width / columnWidth) + n);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render new rows when scrolling past the threshold value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rowHeight, rowThresholdPx, virtualScroller, renderingZone, firstRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowHeight = 50;
                        rowThresholdPx = 1 * rowHeight;
                        render(<TestCaseVirtualization rowHeight={rowHeight} rowBufferPx={0}/>);
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        renderingZone = document.querySelector('.MuiDataGrid-virtualScrollerRenderZone');
                        firstRow = renderingZone.firstChild;
                        expect(firstRow).to.have.attr('data-rowindex', '0');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, virtualScroller.scrollTo({ top: rowThresholdPx })];
                            }); }); })];
                    case 1:
                        _a.sent();
                        firstRow = renderingZone.firstChild;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(firstRow).to.have.attr('data-rowindex', '1');
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should render new columns when scrolling past the threshold value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columnWidth, columnThresholdPx, virtualScroller, renderingZone, firstRow, firstColumn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columnWidth = 100;
                        columnThresholdPx = 1 * columnWidth;
                        render(<TestCaseVirtualization nbRows={1} columnBufferPx={0}/>);
                        virtualScroller = (0, helperFn_1.grid)('virtualScroller');
                        renderingZone = (0, helperFn_1.grid)('virtualScrollerRenderZone');
                        firstRow = (0, helperFn_1.$)(renderingZone, '[role="row"]:first-child');
                        firstColumn = (0, helperFn_1.$$)(firstRow, '[role="gridcell"]')[0];
                        expect(firstColumn).to.have.attr('data-colindex', '0');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, virtualScroller.scrollTo({ left: columnThresholdPx })];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                firstColumn = (0, helperFn_1.$)(renderingZone, '[role="row"] > [role="gridcell"]');
                                expect(firstColumn).to.have.attr('data-colindex', '1');
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('Pagination', function () {
            it('should render only the pageSize', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rowHeight, nbRows, virtualScroller, dimensions, lastCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rowHeight = 50;
                            nbRows = 32;
                            render(<TestCaseVirtualization pagination rowHeight={50} initialState={{ pagination: { paginationModel: { pageSize: nbRows } } }} pageSizeOptions={[nbRows]}/>);
                            virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                            // scroll to the bottom
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, virtualScroller.scrollTo({ top: 2000 })];
                                }); }); })];
                        case 1:
                            // scroll to the bottom
                            _a.sent();
                            dimensions = apiRef.current.state.dimensions;
                            lastCell = (0, helperFn_1.$$)('[role="row"]:last-child [role="gridcell"]')[0];
                            expect(lastCell).to.have.text('31');
                            expect(virtualScroller.scrollHeight).to.equal(dimensions.headerHeight + nbRows * rowHeight + dimensions.scrollbarSize);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not virtualize the last page if smaller than viewport', function () { return __awaiter(void 0, void 0, void 0, function () {
                var virtualScroller, lastCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCaseVirtualization pagination initialState={{ pagination: { paginationModel: { pageSize: 32, page: 3 } } }} pageSizeOptions={[32]} height={500}/>);
                            virtualScroller = (0, helperFn_1.grid)('virtualScroller');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, virtualScroller.scrollTo({ top: 2000 })];
                                }); }); })];
                        case 1:
                            _a.sent();
                            lastCell = (0, helperFn_1.$$)('[role="row"]:last-child [role="gridcell"]')[0];
                            expect(lastCell).to.have.text('99');
                            expect(virtualScroller.scrollTop).to.equal(0);
                            expect(virtualScroller.scrollHeight).to.equal(virtualScroller.clientHeight);
                            expect((0, helperFn_1.grid)('virtualScrollerRenderZone').children).to.have.length(4);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should paginate small dataset in auto page-size #1492', function () {
                render(<TestCaseVirtualization pagination autoPageSize height={496} nbCols={1} nbRows={9}/>);
                var virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                var lastCell = (0, helperFn_1.$$)('[role="row"]:last-child [role="gridcell"]')[0];
                expect(lastCell).to.have.text('6');
                var rows = document.querySelectorAll('.MuiDataGrid-row[role="row"]');
                expect(rows.length).to.equal(7);
                expect(virtualScroller.scrollTop).to.equal(0);
                expect(virtualScroller.scrollHeight).to.equal(virtualScroller.clientHeight);
                expect((0, helperFn_1.grid)('virtualScrollerRenderZone').children).to.have.length(7);
            });
        });
        describe('scrollToIndexes', function () {
            it('should scroll correctly when the given rowIndex is partially visible at the bottom', function () { return __awaiter(void 0, void 0, void 0, function () {
                var columnHeaderHeight, rowHeight, offset, border, virtualScroller;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            columnHeaderHeight = 40;
                            rowHeight = 50;
                            offset = 10;
                            border = 1;
                            render(<TestCaseVirtualization hideFooter columnHeaderHeight={columnHeaderHeight} height={columnHeaderHeight + 4 * rowHeight + offset + border * 2} nbCols={2} rowHeight={rowHeight}/>);
                            virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 4, colIndex: 0 })];
                                }); }); })];
                        case 1:
                            _a.sent();
                            expect(virtualScroller.scrollTop).to.equal(rowHeight - offset);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should scroll correctly when the given index is partially visible at the top', function () { return __awaiter(void 0, void 0, void 0, function () {
                var columnHeaderHeight, rowHeight, offset, border, virtualScroller;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            columnHeaderHeight = 40;
                            rowHeight = 50;
                            offset = 10;
                            border = 1;
                            render(<TestCaseVirtualization hideFooter columnHeaderHeight={columnHeaderHeight} height={columnHeaderHeight + 4 * rowHeight + border + border * 2} nbCols={2} rowHeight={rowHeight}/>);
                            virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                            // Simulate browser behavior
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, virtualScroller.scrollTo({ top: offset })];
                                }); }); })];
                        case 1:
                            // Simulate browser behavior
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 2, colIndex: 0 })];
                                }); }); })];
                        case 2:
                            _a.sent();
                            expect(virtualScroller.scrollTop).to.equal(offset);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 1, colIndex: 0 })];
                                }); }); })];
                        case 3:
                            _a.sent();
                            expect(virtualScroller.scrollTop).to.equal(offset);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 0, colIndex: 0 })];
                                }); }); })];
                        case 4:
                            _a.sent();
                            expect(virtualScroller.scrollTop).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should scroll correctly when the given colIndex is partially visible at the right', function () { return __awaiter(void 0, void 0, void 0, function () {
                var width, border, columnWidth, rows, columns, virtualScroller;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            width = 300;
                            border = 1;
                            columnWidth = 120;
                            rows = [{ id: 0, firstName: 'John', lastName: 'Doe', age: 11 }];
                            columns = [
                                { field: 'id', width: columnWidth },
                                { field: 'firstName', width: columnWidth },
                                { field: 'lastName', width: columnWidth },
                                { field: 'age', width: columnWidth },
                            ];
                            render(<TestCaseVirtualization width={width + border * 2} rows={rows} columns={columns}/>);
                            virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                            expect(virtualScroller.scrollLeft).to.equal(0);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 0, colIndex: 2 })];
                                }); }); })];
                        case 1:
                            _a.sent();
                            expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not scroll when going back', function () { return __awaiter(void 0, void 0, void 0, function () {
                var width, border, columnWidth, rows, columns, virtualScroller;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            width = 300;
                            border = 1;
                            columnWidth = 120;
                            rows = [{ id: 0, firstName: 'John', lastName: 'Doe', age: 11 }];
                            columns = [
                                { field: 'id', width: columnWidth },
                                { field: 'firstName', width: columnWidth },
                                { field: 'lastName', width: columnWidth },
                                { field: 'age', width: columnWidth },
                            ];
                            render(<TestCaseVirtualization width={width + border * 2} rows={rows} columns={columns}/>);
                            virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                            expect(virtualScroller.scrollLeft).to.equal(0);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 0, colIndex: 2 })];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, virtualScroller.dispatchEvent(new Event('scroll'))];
                                }); }); })];
                        case 2:
                            _a.sent(); // Simulate browser behavior
                            expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 0, colIndex: 1 })];
                                }); }); })];
                        case 3:
                            _a.sent();
                            expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('no virtualization', function () {
        var apiRef;
        function TestCase(props) {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            var data = (0, x_data_grid_generator_1.useBasicDemoData)(props.nbRows || 10, props.nbCols || 10);
            return (<div style={{ width: 100, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} columns={data.columns} rows={data.rows} disableVirtualization {...props}/>
        </div>);
        }
        it('should allow to disable virtualization', function () {
            render(<TestCase />);
            expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(10);
            expect(document.querySelectorAll('[role="gridcell"]')).to.have.length(10 * 10);
        });
        it('should render the correct rows when changing pages', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase initialState={{ pagination: { paginationModel: { pageSize: 6 } } }} pageSizeOptions={[6]} pagination/>);
                        expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(6);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(1);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(4);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Cell focus', function () {
        var apiRef;
        function TestCase(props) {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} {...props}/>
        </div>);
        }
        beforeEach(function () {
            baselineProps = {
                autoHeight: skipIf_1.isJSDOM,
                rows: [
                    {
                        id: 1,
                        clientId: 'c1',
                        first: 'Mike',
                        age: 11,
                    },
                    {
                        id: 2,
                        clientId: 'c2',
                        first: 'Jack',
                        age: 11,
                    },
                    {
                        id: 3,
                        clientId: 'c3',
                        first: 'Mike',
                        age: 20,
                    },
                ],
                columns: [{ field: 'clientId' }, { field: 'first' }, { field: 'age' }],
            };
        });
        it('should focus the clicked cell in the state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<TestCase rows={baselineProps.rows}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.focus.cell).to.deep.equal({
                            id: baselineProps.rows[0].id,
                            field: baselineProps.columns[0].field,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset focus when removing the row containing the focus cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<TestCase rows={baselineProps.rows}/>).setProps;
                        internal_test_utils_1.fireEvent.focus((0, helperFn_1.getCell)(0, 0));
                        setProps({ rows: baselineProps.rows.slice(1) });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef)).to.equal(null);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not reset focus when removing a row not containing the focus cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<TestCase rows={baselineProps.rows}/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                    case 1:
                        _b.sent();
                        setProps({ rows: baselineProps.rows.slice(1) });
                        expect((0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef)).to.deep.equal({
                            id: baselineProps.rows[1].id,
                            field: baselineProps.columns[0].field,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the focus when pressing a key inside a cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={baselineProps.rows}/>).user;
                        cell = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('a')];
                    case 2:
                        _a.sent();
                        expect((0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef)).to.deep.equal({
                            id: baselineProps.rows[1].id,
                            field: baselineProps.columns[0].field,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update the focus when clicking from one cell to another', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={baselineProps.rows}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                    case 1:
                        _a.sent();
                        expect((0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef)).to.deep.equal({
                            id: baselineProps.rows[1].id,
                            field: baselineProps.columns[0].field,
                        });
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 2:
                        _a.sent();
                        expect((0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef)).to.deep.equal({
                            id: baselineProps.rows[2].id,
                            field: baselineProps.columns[1].field,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset focus when clicking outside the focused cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={baselineProps.rows}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                    case 1:
                        _a.sent();
                        expect((0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef)).to.deep.equal({
                            id: baselineProps.rows[1].id,
                            field: baselineProps.columns[0].field,
                        });
                        return [4 /*yield*/, user.click(document.body)];
                    case 2:
                        _a.sent();
                        expect((0, x_data_grid_pro_1.gridFocusCellSelector)(apiRef)).to.deep.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should publish "cellFocusOut" when clicking outside the focused cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleCellFocusOut, user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        handleCellFocusOut = (0, sinon_1.spy)();
                        user = render(<TestCase rows={baselineProps.rows}/>).user;
                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellFocusOut', handleCellFocusOut);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                    case 1:
                        _b.sent();
                        expect(handleCellFocusOut.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(document.body)];
                    case 2:
                        _b.sent();
                        expect(handleCellFocusOut.callCount).to.equal(1);
                        expect(handleCellFocusOut.args[0][0].id).to.equal(baselineProps.rows[1].id);
                        expect(handleCellFocusOut.args[0][0].field).to.equal(baselineProps.columns[0].field);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not crash when the row is removed during the click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={baselineProps.rows} onCellClick={function () {
                                var _a;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, _action: 'delete' }]);
                            }}/>).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not crash when the row is removed between events', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={baselineProps.rows}/>).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.pointer([{ keys: '[MouseLeft>]', target: cell }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, _action: 'delete' }])];
                            }); }); })];
                    case 2:
                        _a.sent();
                        // cleanup
                        return [4 /*yield*/, user.pointer([{ keys: '[/MouseLeft]', target: cell }])];
                    case 3:
                        // cleanup
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // See https://github.com/mui/mui-x/issues/5742
        it('should not crash when focusing header after row is removed during the click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell, columnHeaderCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={baselineProps.rows} onCellClick={function () {
                                var _a;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, _action: 'delete' }]);
                            }}/>).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        columnHeaderCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        internal_test_utils_1.fireEvent.focus(columnHeaderCell);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: rowCount', function () {
        function TestCase(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...props}/>
        </div>);
        }
        it('should not show total row count in footer if `rowCount === rows.length`', function () {
            var _a = (0, x_data_grid_generator_1.getBasicGridData)(10, 2), rows = _a.rows, columns = _a.columns;
            var rowCount = rows.length;
            render(<TestCase rows={rows} columns={columns} rowCount={rowCount} paginationMode="server"/>);
            var rowCountElement = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.rowCount));
            expect(rowCountElement.textContent).to.equal("Total Rows: ".concat(rows.length));
        });
        it('should show total row count in footer if `rowCount !== rows.length`', function () {
            var _a = (0, x_data_grid_generator_1.getBasicGridData)(10, 2), rows = _a.rows, columns = _a.columns;
            var rowCount = rows.length + 10;
            render(<TestCase rows={rows} columns={columns} rowCount={rowCount} paginationMode="server"/>);
            var rowCountElement = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.rowCount));
            expect(rowCountElement.textContent).to.equal("Total Rows: ".concat(rows.length, " of ").concat(rowCount));
        });
        it('should update total row count in footer on `rowCount` prop change', function () {
            var _a = (0, x_data_grid_generator_1.getBasicGridData)(10, 2), rows = _a.rows, columns = _a.columns;
            var rowCount = rows.length;
            var setProps = render(<TestCase rows={rows} columns={columns} rowCount={rowCount} paginationMode="server"/>).setProps;
            rowCount += 1;
            setProps({ rowCount: rowCount });
            var rowCountElement = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.rowCount));
            expect(rowCountElement.textContent).to.equal("Total Rows: ".concat(rows.length, " of ").concat(rowCount));
        });
    });
});

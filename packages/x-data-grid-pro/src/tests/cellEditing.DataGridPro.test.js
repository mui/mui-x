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
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var vitest_1 = require("vitest");
describe('<DataGridPro /> - Cell editing', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var defaultData = (0, x_data_grid_generator_1.getBasicGridData)(4, 2);
    var defaultRenderEditCell = (function () { return <input />; });
    function TestCase(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        var _a = props.columnProps, columnProps = _a === void 0 ? {} : _a, rest = __rest(props, ["columnProps"]);
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...defaultData} columns={defaultData.columns.map(function (column) {
                return column.field === 'currencyPair'
                    ? __assign(__assign(__assign({}, column), { renderEditCell: defaultRenderEditCell, editable: true }), columnProps) : column;
            })} {...rest}/>
      </div>);
    }
    describe('apiRef', function () {
        describe('startCellEditMode', function () {
            it('should throw when the cell is already in edit mode', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); })];
                        case 1:
                            _a.sent();
                            expect(function () {
                                var _a;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' });
                            }).to.throw('MUI X: The cell with id=0 and field=currencyPair is not in view mode.');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should update the CSS class of the cell', function () {
                render(<TestCase />);
                expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
            });
            it('should render the component given in renderEditCell', function () {
                var renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                render(<TestCase columnProps={{ renderEditCell: renderEditCell }}/>);
                expect(renderEditCell.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                expect(renderEditCell.callCount).not.to.equal(0);
            });
            it('should pass props to renderEditCell', function () {
                var renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                render(<TestCase columnProps={{ renderEditCell: renderEditCell }}/>);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
                expect(renderEditCell.lastCall.args[0].error).to.equal(false);
                expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
            });
            it('should empty the value if deleteValue is true', function () {
                var renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                render(<TestCase columnProps={{ renderEditCell: renderEditCell }}/>);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair', deleteValue: true }); });
                expect(renderEditCell.lastCall.args[0].value).to.equal('');
                expect(renderEditCell.lastCall.args[0].error).to.equal(false);
                expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
            });
        });
        describe('setEditCellValue', function () {
            it('should update the value prop given to renderEditCell', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderEditCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase columnProps={{ renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'usdgbp' }); })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell.lastCall.args[0].value).to.equal('usdgbp');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass to renderEditCell the row with the value updated', function () { return __awaiter(void 0, void 0, void 0, function () {
                var valueSetter, renderEditCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valueSetter = function (value, row) { return (__assign(__assign({}, row), { currencyPair: value.trim() })); };
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase columnProps={{ valueSetter: valueSetter, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(renderEditCell.lastCall.args[0].row).to.deep.equal(defaultData.rows[0]);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: ' usdgbp ' }); })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell.lastCall.args[0].row).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: 'usdgbp' }));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass the new value through the value parser if defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var valueParser, renderEditCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valueParser = (0, sinon_1.spy)(function (value) { return value.toLowerCase(); });
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase columnProps={{ valueParser: valueParser, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(valueParser.callCount).to.equal(0);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            expect(valueParser.callCount).to.equal(1);
                            expect(renderEditCell.lastCall.args[0].value).to.equal('usd gbp');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return true if no preProcessEditCellProps is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            render(<TestCase />);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            _a = expect;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should set isProcessingProps to true before calling preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, renderEditCell, promise;
                return __generator(this, function (_a) {
                    preProcessEditCellProps = (0, sinon_1.spy)(function (_a) {
                        var props = _a.props;
                        return props;
                    });
                    renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                    render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps, renderEditCell: renderEditCell }}/>);
                    (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                    promise = null;
                    // We want to flush updates before preProcessEditCellProps resolves
                    (0, internal_test_utils_1.act)(function () {
                        var _a;
                        promise = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                            id: 0,
                            field: 'currencyPair',
                            value: 'USD GBP',
                        });
                    });
                    expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(true);
                    return [2 /*return*/, (0, internal_test_utils_1.act)(function () { return promise; })];
                });
            }); });
            it('should call preProcessEditCellProps with the correct params', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, args;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = (0, sinon_1.spy)(function (_a) {
                                var props = _a.props;
                                return props;
                            });
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    var _a;
                                    return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                        id: 0,
                                        field: 'currencyPair',
                                        value: 'USD GBP',
                                    });
                                })];
                        case 1:
                            _a.sent();
                            args = preProcessEditCellProps.lastCall.args[0];
                            expect(args.id).to.equal(0);
                            expect(args.row).to.deep.equal(defaultData.rows[0]);
                            expect(args.hasChanged).to.equal(true);
                            expect(args.props).to.deep.equal({
                                value: 'USD GBP',
                                error: false,
                                isProcessingProps: true,
                                changeReason: 'setEditCellValue',
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not publish onCellEditStop if field has error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, handleEditCellStop, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = (0, sinon_1.spy)(function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            });
                            handleEditCellStop = (0, sinon_1.spy)();
                            render(<TestCase onCellEditStop={handleEditCellStop} columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    var _a;
                                    return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                        id: 0,
                                        field: 'currencyPair',
                                        value: 'USD GBP',
                                    });
                                })];
                        case 1:
                            _a.sent();
                            cell = (0, helperFn_1.getCell)(0, 1);
                            cell.focus();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                            expect(handleEditCellStop.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass to renderEditCell the props returned by preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, renderEditCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { foo: 'bar' }));
                            };
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(renderEditCell.lastCall.args[0].foo).to.equal(undefined);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell.lastCall.args[0].foo).to.equal('bar');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not pass to renderEditCell the value returned by preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, renderEditCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { value: 'foobar' }));
                            };
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should set isProcessingProps to false after calling preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, renderEditCell, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return props;
                            };
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            promise = null;
                            // We want to flush updates before preProcessEditCellProps resolves
                            (0, internal_test_utils_1.act)(function () {
                                var _a;
                                promise = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                    id: 0,
                                    field: 'currencyPair',
                                    value: 'USD GBP',
                                });
                            });
                            expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(true);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return promise; })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return false if preProcessEditCellProps sets an error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            _a = expect;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    var _a;
                                    return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                        id: 0,
                                        field: 'currencyPair',
                                        value: 'USD GBP',
                                    });
                                })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return false if the cell left the edit mode while calling preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var resolveCallback, preProcessEditCellProps, promise, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return new Promise(function (resolve) {
                                    resolveCallback = function () { return resolve(props); };
                                });
                            };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            (0, internal_test_utils_1.act)(function () {
                                var _a;
                                promise = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                    id: 0,
                                    field: 'currencyPair',
                                    value: 'USD GBP',
                                });
                            });
                            (0, internal_test_utils_1.act)(function () {
                                var _a;
                                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({
                                    id: 0,
                                    field: 'currencyPair',
                                    ignoreModifications: true,
                                });
                            });
                            resolveCallback();
                            _a = expect;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, promise];
                                }); }); })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('with debounceMs > 0', function () {
                it('should debounce multiple changes if debounceMs > 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var renderEditCell;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                renderEditCell = (0, sinon_1.spy)((function () { return <input />; }));
                                render(<TestCase columnProps={{ renderEditCell: renderEditCell }}/>);
                                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                                expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
                                renderEditCell.resetHistory();
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                    id: 0,
                                    field: 'currencyPair',
                                    value: 'USD',
                                    debounceMs: 100,
                                });
                                expect(renderEditCell.callCount).to.equal(0);
                                (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.setEditCellValue({
                                    id: 0,
                                    field: 'currencyPair',
                                    value: 'USD GBP',
                                    debounceMs: 100,
                                });
                                expect(renderEditCell.callCount).to.equal(0);
                                return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                        expect(renderEditCell.callCount).not.to.equal(0);
                                    })];
                            case 1:
                                _c.sent();
                                expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('stopCellEditMode', function () {
            function CustomEditComponent(_a) {
                var hasFocus = _a.hasFocus;
                var ref = React.useRef(null);
                React.useLayoutEffect(function () {
                    if (hasFocus) {
                        ref.current.focus();
                    }
                }, [hasFocus]);
                return <input ref={ref}/>;
            }
            it('should throw an error when the cell is not in edit mode', function () {
                render(<TestCase />);
                expect(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); }).to.throw('MUI X: The cell with id=0 and field=currencyPair is not in edit mode.');
            });
            it('should update the row with the new value stored', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' })];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' })];
                                }); }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' })];
                                }); }); })];
                        case 3:
                            _a.sent();
                            expect((0, helperFn_1.getCell)(0, 1).textContent).to.equal('USD GBP');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not update the row if ignoreModifications=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () {
                                var _a;
                                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({
                                    id: 0,
                                    field: 'currencyPair',
                                    ignoreModifications: true,
                                });
                            });
                            expect((0, helperFn_1.getCell)(0, 1).textContent).to.equal('USDGBP');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if props are still being processed and ignoreModifications=false', function () { return __awaiter(void 0, void 0, void 0, function () {
                var resolveCallback, preProcessEditCellProps, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return new Promise(function (resolve) {
                                    resolveCallback = function () { return resolve(props); };
                                });
                            };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            (0, internal_test_utils_1.act)(function () {
                                var _a;
                                promise = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                    id: 0,
                                    field: 'currencyPair',
                                    value: 'USD GBP',
                                });
                            });
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            resolveCallback();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return promise; })];
                        case 1:
                            _a.sent(); // Run all updates scheduled for when preProcessEditCellProps resolves
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if props contain error=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should keep mode=edit if props of any column contains error=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, onCellModesModelChange;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            onCellModesModelChange = (0, sinon_1.spy)();
                            render(<TestCase onCellModesModelChange={onCellModesModelChange} columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
                                0: { currencyPair: { mode: 'edit' } },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should allow a 2nd call if the first call was when error=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: props.value.length === 0 }));
                            };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: '' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 2:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should update the CSS class of the cell', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call processRowUpdate before updating the row', function () { return __awaiter(void 0, void 0, void 0, function () {
                var processRowUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            processRowUpdate = (0, sinon_1.spy)(function (row) { return (__assign(__assign({}, row), { currencyPair: 'USD-GBP' })); });
                            render(<TestCase processRowUpdate={processRowUpdate}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 2:
                            _a.sent();
                            expect(processRowUpdate.callCount).to.equal(1);
                            expect((0, helperFn_1.getCell)(0, 1).textContent).to.equal('USD-GBP');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call processRowUpdate with the new and old row', function () { return __awaiter(void 0, void 0, void 0, function () {
                var processRowUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            processRowUpdate = (0, sinon_1.spy)(function (newRow, oldRow) { return (__assign(__assign({}, oldRow), newRow)); });
                            render(<TestCase processRowUpdate={processRowUpdate}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 2:
                            _a.sent();
                            expect(processRowUpdate.lastCall.args[0]).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: 'USD GBP' }));
                            expect(processRowUpdate.lastCall.args[1]).to.deep.equal(defaultData.rows[0]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should stay in edit mode if processRowUpdate throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var consoleMock, processRowUpdate;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            consoleMock = vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { return undefined; });
                            (0, vitest_1.onTestFinished)(function () {
                                consoleMock.mockRestore();
                            });
                            processRowUpdate = function () {
                                throw new Error('Something went wrong');
                            };
                            render(<TestCase processRowUpdate={processRowUpdate}/>);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' })];
                                }); }); })];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' })];
                                }); }); })];
                        case 2:
                            _b.sent();
                            expect((_a = consoleMock.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0]).to.include('MUI X: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.');
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call onProcessRowUpdateError if processRowUpdate throws an error', function () {
                var error = new Error('Something went wrong');
                var processRowUpdate = function () {
                    throw error;
                };
                var onProcessRowUpdateError = (0, sinon_1.spy)();
                render(<TestCase processRowUpdate={processRowUpdate} onProcessRowUpdateError={onProcessRowUpdateError}/>);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                expect(onProcessRowUpdateError.lastCall.args[0]).to.equal(error);
            });
            it('should call onProcessRowUpdateError if processRowUpdate rejects', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error, processRowUpdate, onProcessRowUpdateError;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = new Error('Something went wrong');
                            processRowUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    throw error;
                                });
                            }); };
                            onProcessRowUpdateError = (0, sinon_1.spy)();
                            render(<TestCase processRowUpdate={processRowUpdate} onProcessRowUpdateError={onProcessRowUpdateError}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 1:
                            _a.sent();
                            expect(onProcessRowUpdateError.lastCall.args[0]).to.equal(error);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should keep mode=edit if processRowUpdate rejects', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error, processRowUpdate, onProcessRowUpdateError, onCellModesModelChange;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = new Error('Something went wrong');
                            processRowUpdate = function () {
                                throw error;
                            };
                            onProcessRowUpdateError = (0, sinon_1.spy)();
                            onCellModesModelChange = (0, sinon_1.spy)();
                            render(<TestCase onCellModesModelChange={onCellModesModelChange} processRowUpdate={processRowUpdate} onProcessRowUpdateError={onProcessRowUpdateError}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
                                0: { currencyPair: { mode: 'edit' } },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass the new value through the value setter before calling processRowUpdate', function () { return __awaiter(void 0, void 0, void 0, function () {
                var valueSetter, processRowUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valueSetter = (0, sinon_1.spy)(function (value, row) { return (__assign(__assign({}, row), { _currencyPair: value })); });
                            processRowUpdate = (0, sinon_1.spy)(function () { return new Promise(function () { }); });
                            render(<TestCase processRowUpdate={processRowUpdate} columnProps={{ valueSetter: valueSetter }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(processRowUpdate.lastCall.args[0]).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: 'USDGBP', _currencyPair: 'USD GBP' }));
                            expect(valueSetter.lastCall.args[0]).to.equal('USD GBP');
                            expect(valueSetter.lastCall.args[1]).to.deep.equal(defaultData.rows[0]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should move focus to the cell below when cellToFocusAfter=below', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderEditCellProp;
                return __generator(this, function (_a) {
                    renderEditCellProp = function (props) { return (<CustomEditComponent {...props}/>); };
                    render(<TestCase columnProps={{ renderEditCell: renderEditCellProp }}/>);
                    (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                    expect((0, helperFn_1.getCell)(0, 1).querySelector('input')).toHaveFocus();
                    (0, internal_test_utils_1.act)(function () {
                        var _a;
                        return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({
                            id: 0,
                            field: 'currencyPair',
                            cellToFocusAfter: 'below',
                        });
                    });
                    expect((0, helperFn_1.getCell)(1, 1)).toHaveFocus();
                    return [2 /*return*/];
                });
            }); });
            it('should move focus to the cell on the right when cellToFocusAfter=right', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderEditCellProp;
                return __generator(this, function (_a) {
                    renderEditCellProp = function (props) { return (<CustomEditComponent {...props}/>); };
                    render(<TestCase {...(0, x_data_grid_generator_1.getBasicGridData)(1, 3)} columns={[
                            { field: 'id' },
                            { field: 'currencyPair', editable: true },
                            { field: 'price1M', editable: true },
                        ]} columnProps={{ renderEditCell: renderEditCellProp }}/>);
                    (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                    expect((0, helperFn_1.getCell)(0, 1).querySelector('input')).toHaveFocus();
                    (0, internal_test_utils_1.act)(function () {
                        var _a;
                        return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({
                            id: 0,
                            field: 'currencyPair',
                            cellToFocusAfter: 'right',
                        });
                    });
                    expect((0, helperFn_1.getCell)(0, 2)).toHaveFocus();
                    return [2 /*return*/];
                });
            }); });
            it('should move focus to the cell on the left when cellToFocusAfter=left', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderEditCellProp;
                return __generator(this, function (_a) {
                    renderEditCellProp = function (props) { return (<CustomEditComponent {...props}/>); };
                    render(<TestCase {...(0, x_data_grid_generator_1.getBasicGridData)(1, 3)} columns={[
                            { field: 'id' },
                            { field: 'currencyPair', editable: true },
                            { field: 'price1M', editable: true },
                        ]} columnProps={{ renderEditCell: renderEditCellProp }}/>);
                    (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'price1M' }); });
                    expect((0, helperFn_1.getCell)(0, 2).querySelector('input')).toHaveFocus();
                    (0, internal_test_utils_1.act)(function () {
                        var _a;
                        return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({
                            id: 0,
                            field: 'price1M',
                            cellToFocusAfter: 'left',
                        });
                    });
                    expect((0, helperFn_1.getCell)(0, 1)).toHaveFocus();
                    return [2 /*return*/];
                });
            }); });
            it('should run all pending value mutations before calling processRowUpdate', function () { return __awaiter(void 0, void 0, void 0, function () {
                var processRowUpdate, renderEditCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            processRowUpdate = (0, sinon_1.spy)(function () { return new Promise(function () { }); });
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase processRowUpdate={processRowUpdate} columnProps={{ renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    return new Promise(function (resolve) {
                                        var _a;
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                            id: 0,
                                            field: 'currencyPair',
                                            value: 'USD GBP',
                                            debounceMs: 100,
                                        });
                                        resolve();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
                            expect(processRowUpdate.lastCall.args[0].currencyPair).to.equal('USD GBP');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should keep in edit mode the cells that entered edit mode while processRowUpdate is called', function () { return __awaiter(void 0, void 0, void 0, function () {
                var onCellModesModelChange, resolveCallback, processRowUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onCellModesModelChange = (0, sinon_1.spy)();
                            processRowUpdate = function (newRow) {
                                return new Promise(function (resolve) {
                                    resolveCallback = function () { return resolve(newRow); };
                                });
                            };
                            render(<TestCase processRowUpdate={processRowUpdate} onCellModesModelChange={onCellModesModelChange}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
                            expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
                                0: { currencyPair: { mode: 'view' } },
                            });
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 1, field: 'currencyPair' }); });
                            expect(onCellModesModelChange.lastCall.args[0]).to.have.keys('0', '1');
                            expect(onCellModesModelChange.lastCall.args[0][1]).to.deep.equal({
                                currencyPair: { mode: 'edit' },
                            });
                            resolveCallback();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 2:
                            _a.sent();
                            expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
                                1: { currencyPair: { mode: 'edit' } },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('start edit mode', function () {
        describe('by double-click', function () {
            it("should publish 'cellEditStart' with reason=cellDoubleClick", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.lastCall.args[0].reason).to.equal('cellDoubleClick');
            });
            it("should not publish 'cellEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
            });
            it('should call startCellEditMode', function () {
                render(<TestCase />);
                var spiedStartCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(spiedStartCellEditMode.callCount).to.equal(1);
            });
        });
        describe('by pressing a special character', function () {
            it("should publish 'cellEditStart' with reason=printableKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: '$' });
                expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
            });
            it("should not publish 'cellEditStart' if space is pressed", function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, listener, cell;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            user = render(<TestCase autoHeight/>).user;
                            listener = (0, sinon_1.spy)();
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, user.click(cell)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, user.keyboard('[Space]')];
                        case 2:
                            _b.sent();
                            expect(listener.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('by pressing a number', function () {
            it("should publish 'cellEditStart' with reason=printableKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: '1' });
                expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
            });
        });
        describe('by pressing Enter', function () {
            it("should publish 'cellEditStart' with reason=enterKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
            it("should not publish 'cellEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(listener.callCount).to.equal(0);
            });
            it('should call startCellEditMode', function () {
                render(<TestCase />);
                var spiedStartCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(spiedStartCellEditMode.callCount).to.equal(1);
            });
        });
        describe('by pressing Delete', function () {
            it("should publish 'cellEditStart' with reason=deleteKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Delete' });
                expect(listener.lastCall.args[0].reason).to.equal('deleteKeyDown');
            });
            it("should not publish 'cellEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Delete' });
                expect(listener.callCount).to.equal(0);
            });
            it('should call startCellEditMode', function () {
                render(<TestCase />);
                var spiedStartCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Delete' });
                expect(spiedStartCellEditMode.callCount).to.equal(1);
            });
            it('should empty the cell', function () {
                render(<TestCase />);
                var spiedStartCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Delete' });
                expect(spiedStartCellEditMode.callCount).to.equal(1);
                expect(spiedStartCellEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    field: 'currencyPair',
                    deleteValue: true,
                });
            });
            it('should call preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, user, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = (0, sinon_1.spy)(function (_a) {
                                var props = _a.props;
                                return props;
                            });
                            user = render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>).user;
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, user.click(cell)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard('{Delete}')];
                        case 2:
                            _a.sent();
                            expect(preProcessEditCellProps.callCount).to.equal(1);
                            expect(preProcessEditCellProps.lastCall.args[0].props).to.deep.equal({
                                value: '',
                                error: false,
                                isProcessingProps: true,
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('by pressing a printable character', function () {
            it('should call startCellEditMode', function () {
                render(<TestCase />);
                var spiedStartCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a' }); // A
                expect(spiedStartCellEditMode.callCount).to.equal(1);
            });
            it("should publish 'cellEditStart' with reason=printableKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a' }); // A
                expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
            });
            it("should not publish 'cellEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a', keyCode: 65 }); // A
                expect(listener.callCount).to.equal(0);
            });
            ['ctrlKey', 'metaKey'].forEach(function (key) {
                it("should not publish 'cellEditStart' if ".concat(key, " is pressed"), function () {
                    var _a;
                    var _b;
                    render(<TestCase />);
                    var listener = (0, sinon_1.spy)();
                    (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.subscribeEvent('cellEditStart', listener);
                    var cell = (0, helperFn_1.getCell)(0, 1);
                    fireUserEvent_1.fireUserEvent.mousePress(cell);
                    internal_test_utils_1.fireEvent.keyDown(cell, (_a = { key: 'a', keyCode: 65 }, _a[key] = true, _a)); // for example Ctrl + A, copy
                    expect(listener.callCount).to.equal(0);
                });
            });
            it("should call startCellEditMode if shiftKey is pressed with a letter", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a', keyCode: 65, shiftKey: true }); // Print A in uppercase
                expect(listener.callCount).to.equal(1);
            });
            it("should call startCellEditMode if the paste shortcut is pressed", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V
                expect(listener.callCount).to.equal(1);
            });
            it("should call startCellEditMode if a special character on macOS is pressed", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'π', altKey: true }); // ⌥ Option + P
                expect(listener.callCount).to.equal(1);
            });
            it('should empty the cell', function () {
                render(<TestCase />);
                var spiedStartCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a' });
                expect(spiedStartCellEditMode.callCount).to.equal(1);
                expect(spiedStartCellEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    field: 'currencyPair',
                    deleteValue: true,
                });
            });
            it("should ignore keydown event until the IME is confirmed with a letter", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                var input = cell.querySelector('input');
                internal_test_utils_1.fireEvent.change(input, { target: { value: 'あ' } });
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter', keyCode: 229 });
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter', keyCode: 13 });
                expect(listener.callCount).to.equal(1);
                expect(input.value).to.equal('あ');
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
            it("should ignore keydown event until the IME is confirmed with multiple letters", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                var input = cell.querySelector('input');
                internal_test_utils_1.fireEvent.change(input, { target: { value: 'ありがとう' } });
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter', keyCode: 229 });
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter', keyCode: 13 });
                expect(listener.callCount).to.equal(1);
                expect(input.value).to.equal('ありがとう');
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
        });
    });
    describe('stop edit mode', function () {
        describe('by clicking outside the cell', function () {
            it("should publish 'cellEditStop' with reason=cellFocusOut", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStop', listener);
                internal_test_utils_1.fireEvent.doubleClick((0, helperFn_1.getCell)(0, 1));
                expect(listener.callCount).to.equal(0);
                fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 1));
                expect(listener.lastCall.args[0].reason).to.equal('cellFocusOut');
            });
            it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=undefined', function () {
                render(<TestCase />);
                var spiedStopCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopCellEditMode');
                internal_test_utils_1.fireEvent.doubleClick((0, helperFn_1.getCell)(0, 1));
                fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 1));
                expect(spiedStopCellEditMode.callCount).to.equal(1);
                expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    field: 'currencyPair',
                    cellToFocusAfter: undefined,
                    ignoreModifications: false,
                });
            });
            it('should call stopCellEditMode with ignoreModifications=false if the props are being processed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, spiedStopCellEditMode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function () { return new Promise(function () { }); };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            spiedStopCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopCellEditMode');
                            internal_test_utils_1.fireEvent.doubleClick((0, helperFn_1.getCell)(0, 1));
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    return new Promise(function (resolve) {
                                        var _a;
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
                                        resolve();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 1));
                            expect(spiedStopCellEditMode.callCount).to.equal(1);
                            expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('by pressing Escape', function () {
            it("should publish 'cellEditStop' with reason=escapeKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Escape' });
                expect(listener.lastCall.args[0].reason).to.equal('escapeKeyDown');
            });
            it('should call stopCellEditMode with ignoreModifications=true and cellToFocusAfter=undefined', function () {
                render(<TestCase />);
                var spiedStopCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Escape' });
                expect(spiedStopCellEditMode.callCount).to.equal(1);
                expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    field: 'currencyPair',
                    cellToFocusAfter: undefined,
                    ignoreModifications: true,
                });
            });
        });
        describe('by pressing Enter', function () {
            it("should publish 'cellEditStop' with reason=enterKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
            it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=below', function () {
                render(<TestCase />);
                var spiedStopCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(spiedStopCellEditMode.callCount).to.equal(1);
                expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    field: 'currencyPair',
                    cellToFocusAfter: 'below',
                    ignoreModifications: false,
                });
            });
            it('should call stopCellEditMode with ignoreModifications=false if the props are being processed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, spiedStopCellEditMode, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function () { return new Promise(function () { }); };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            spiedStopCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopCellEditMode');
                            cell = (0, helperFn_1.getCell)(0, 1);
                            fireUserEvent_1.fireUserEvent.mousePress(cell);
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    return new Promise(function (resolve) {
                                        var _a;
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
                                        resolve();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                            expect(spiedStopCellEditMode.callCount).to.equal(1);
                            expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('by pressing Tab', function () {
            it("should publish 'cellEditStop' with reason=tabKeyDown", function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, listener, cell;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            user = render(<TestCase />).user;
                            listener = (0, sinon_1.spy)();
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellEditStop', listener);
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, user.click(cell)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, user.dblClick(cell)];
                        case 2:
                            _b.sent();
                            expect(listener.callCount).to.equal(0);
                            return [4 /*yield*/, user.keyboard('{Tab}')];
                        case 3:
                            _b.sent();
                            expect(listener.lastCall.args[0].reason).to.equal('tabKeyDown');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=right', function () {
                render(<TestCase />);
                var spiedStopCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopCellEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Tab' });
                expect(spiedStopCellEditMode.callCount).to.equal(1);
                expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    field: 'currencyPair',
                    cellToFocusAfter: 'right',
                    ignoreModifications: false,
                });
            });
            it('should call stopCellEditMode with ignoreModifications=false if the props are being processed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, spiedStopCellEditMode, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function () { return new Promise(function () { }); };
                            render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            spiedStopCellEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopCellEditMode');
                            cell = (0, helperFn_1.getCell)(0, 1);
                            fireUserEvent_1.fireUserEvent.mousePress(cell);
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    return new Promise(function (resolve) {
                                        var _a;
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
                                        resolve();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Tab' });
                            expect(spiedStopCellEditMode.callCount).to.equal(1);
                            expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('prop: cellModesModel', function () {
        describe('mode=view to mode=edit', function () {
            it('should start edit mode', function () {
                var setProps = render(<TestCase />).setProps;
                expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
                setProps({ cellModesModel: { 0: { currencyPair: { mode: x_data_grid_pro_1.GridCellModes.Edit } } } });
                expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
            });
        });
        describe('mode=edit to mode=view', function () {
            it('should stop edit mode', function () {
                var setProps = render(<TestCase cellModesModel={{ 0: { currencyPair: { mode: x_data_grid_pro_1.GridCellModes.Edit } } }}/>).setProps;
                expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                setProps({ cellModesModel: { 0: { currencyPair: { mode: x_data_grid_pro_1.GridCellModes.View } } } });
                expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
            });
            it('should ignode modifications if ignoreModifications=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setProps = render(<TestCase cellModesModel={{ 0: { currencyPair: { mode: x_data_grid_pro_1.GridCellModes.Edit } } }}/>).setProps;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            setProps({
                                cellModesModel: {
                                    0: { currencyPair: { mode: x_data_grid_pro_1.GridCellModes.View, ignoreModifications: true } },
                                },
                            });
                            expect((0, helperFn_1.getCell)(0, 1).textContent).to.equal('USDGBP');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should move focus to the cell that is set in cellToFocusAfter', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setProps = render(<TestCase cellModesModel={{ 0: { currencyPair: { mode: x_data_grid_pro_1.GridCellModes.Edit } } }}/>).setProps;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    var _a;
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
                                })];
                        case 1:
                            _a.sent();
                            setProps({
                                cellModesModel: {
                                    0: { currencyPair: { mode: x_data_grid_pro_1.GridCellModes.View, cellToFocusAfter: 'below' } },
                                },
                            });
                            expect((0, helperFn_1.getCell)(1, 1)).toHaveFocus();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("should publish 'cellModesModelChange' when the model changes", function () {
            var _a;
            render(<TestCase />);
            var listener = (0, sinon_1.spy)();
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellModesModelChange', listener);
            var cell = (0, helperFn_1.getCell)(0, 1);
            internal_test_utils_1.fireEvent.doubleClick(cell);
            expect(listener.lastCall.args[0]).to.deep.equal({
                0: { currencyPair: { mode: 'edit' } },
            });
        });
        it("should publish 'cellModesModelChange' when the prop changes", function () {
            var _a;
            var setProps = render(<TestCase cellModesModel={{}}/>).setProps;
            var listener = (0, sinon_1.spy)();
            expect(listener.callCount).to.equal(0);
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellModesModelChange', listener);
            setProps({ cellModesModel: { 0: { currencyPair: { mode: 'edit' } } } });
            expect(listener.lastCall.args[0]).to.deep.equal({
                0: { currencyPair: { mode: 'edit' } },
            });
        });
        it("should not publish 'cellModesModelChange' when the model changes and cellModesModel is set", function () {
            var _a;
            render(<TestCase cellModesModel={{}}/>);
            var listener = (0, sinon_1.spy)();
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellModesModelChange', listener);
            var cell = (0, helperFn_1.getCell)(0, 1);
            internal_test_utils_1.fireEvent.doubleClick(cell);
            expect(listener.callCount).to.equal(0);
        });
        it('should not mutate the cellModesModel prop if props of any column contains error=true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var preProcessEditCellProps, setProps, cell, cellModesModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preProcessEditCellProps = function (_a) {
                            var props = _a.props;
                            return (__assign(__assign({}, props), { error: true }));
                        };
                        setProps = render(<TestCase columnProps={{ preProcessEditCellProps: preProcessEditCellProps }}/>).setProps;
                        cell = (0, helperFn_1.getCell)(0, 1);
                        internal_test_utils_1.fireEvent.mouseUp(cell);
                        internal_test_utils_1.fireEvent.click(cell);
                        internal_test_utils_1.fireEvent.doubleClick(cell);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                    case 1:
                        _a.sent();
                        cellModesModel = { 0: { currencyPair: { mode: 'view' } } };
                        setProps({ cellModesModel: cellModesModel });
                        expect(cellModesModel).to.deep.equal({ 0: { currencyPair: { mode: 'view' } } });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: onCellModesModelChange', function () {
        it('should call with mode=edit when startEditMode is called', function () {
            var onCellModesModelChange = (0, sinon_1.spy)();
            render(<TestCase onCellModesModelChange={onCellModesModelChange}/>);
            expect(onCellModesModelChange.callCount).to.equal(0);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
            expect(onCellModesModelChange.callCount).to.equal(1);
            expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
                0: { currencyPair: { mode: 'edit' } },
            });
        });
        it('should call with mode=view when stopEditMode is called', function () {
            var onCellModesModelChange = (0, sinon_1.spy)();
            render(<TestCase onCellModesModelChange={onCellModesModelChange}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startCellEditMode({ id: 0, field: 'currencyPair' }); });
            onCellModesModelChange.resetHistory();
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopCellEditMode({ id: 0, field: 'currencyPair' }); });
            expect(onCellModesModelChange.args[0][0]).to.deep.equal({
                0: { currencyPair: { mode: 'view' } },
            });
            expect(onCellModesModelChange.args[1][0]).to.deep.equal({});
        });
        it("should not be called when changing the cellModesModel prop", function () {
            var onCellModesModelChange = (0, sinon_1.spy)();
            var setProps = render(<TestCase cellModesModel={{}} onCellModesModelChange={onCellModesModelChange}/>).setProps;
            expect(onCellModesModelChange.callCount).to.equal(0);
            setProps({ cellModesModel: { 0: { currencyPair: { mode: 'edit' } } } });
            expect(onCellModesModelChange.callCount).to.equal(0);
        });
    });
});

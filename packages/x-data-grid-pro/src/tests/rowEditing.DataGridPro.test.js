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
var sinon_1 = require("sinon");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var Portal_1 = require("@mui/material/Portal");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var vitest_1 = require("vitest");
describe('<DataGridPro /> - Row editing', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var defaultData = (0, x_data_grid_generator_1.getBasicGridData)(4, 4);
    function CustomEditComponent(_a) {
        var hasFocus = _a.hasFocus;
        var ref = React.useRef(null);
        React.useLayoutEffect(function () {
            if (hasFocus) {
                ref.current.focus({ preventScroll: true });
            }
        }, [hasFocus]);
        return <input ref={ref}/>;
    }
    var defaultRenderEditCell = function (props) { return (<CustomEditComponent {...props}/>); };
    function TestCase(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        var _a = props.column1Props, column1Props = _a === void 0 ? {} : _a, _b = props.column2Props, column2Props = _b === void 0 ? {} : _b, rest = __rest(props, ["column1Props", "column2Props"]);
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} editMode="row" disableVirtualization {...defaultData} columns={defaultData.columns.map(function (column) {
                if (column.field === 'currencyPair') {
                    return __assign(__assign(__assign({}, column), { renderEditCell: defaultRenderEditCell, editable: true }), column1Props);
                }
                if (column.field === 'price1M') {
                    return __assign(__assign(__assign({}, column), { renderEditCell: defaultRenderEditCell, editable: true }), column2Props);
                }
                return column;
            })} {...rest}/>
      </div>);
    }
    describe('apiRef', function () {
        describe('startRowEditMode', function () {
            it('should throw when the row is already in edit mode', function () {
                render(<TestCase />);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                expect(function () { return (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); }); }).to.throw('MUI X: The row with id=0 is not in view mode.');
            });
            it('should update the CSS class of all editable cells', function () {
                render(<TestCase />);
                expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                expect((0, helperFn_1.getCell)(0, 2)).to.have.class('MuiDataGrid-cell--editing');
                expect((0, helperFn_1.getCell)(0, 3)).not.to.have.class('MuiDataGrid-cell--editing');
            });
            it('should update the CSS class of the row', function () {
                render(<TestCase />);
                expect((0, helperFn_1.getRow)(0)).not.to.have.class('MuiDataGrid-row--editing');
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                expect((0, helperFn_1.getRow)(0)).to.have.class('MuiDataGrid-row--editing');
            });
            it('should render the components given in renderEditCell', function () {
                var renderEditCell1 = (0, sinon_1.spy)(defaultRenderEditCell);
                var renderEditCell2 = (0, sinon_1.spy)(defaultRenderEditCell);
                render(<TestCase column1Props={{ renderEditCell: renderEditCell1 }} column2Props={{ renderEditCell: renderEditCell2 }}/>);
                expect(renderEditCell1.callCount).to.equal(0);
                expect(renderEditCell2.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                expect(renderEditCell1.callCount).not.to.equal(0);
                expect(renderEditCell2.callCount).not.to.equal(0);
            });
            it('should pass props to renderEditCell', function () {
                var renderEditCell1 = (0, sinon_1.spy)(defaultRenderEditCell);
                var renderEditCell2 = (0, sinon_1.spy)(defaultRenderEditCell);
                render(<TestCase column1Props={{ renderEditCell: renderEditCell1 }} column2Props={{ renderEditCell: renderEditCell2 }}/>);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                expect(renderEditCell1.lastCall.args[0].value).to.equal('USDGBP');
                expect(renderEditCell1.lastCall.args[0].error).to.equal(false);
                expect(renderEditCell1.lastCall.args[0].isProcessingProps).to.equal(false);
                expect(renderEditCell2.lastCall.args[0].value).to.equal(1);
                expect(renderEditCell2.lastCall.args[0].error).to.equal(false);
                expect(renderEditCell2.lastCall.args[0].isProcessingProps).to.equal(false);
            });
            it('should empty the value if deleteValue is true', function () {
                var renderEditCell1 = (0, sinon_1.spy)(defaultRenderEditCell);
                var renderEditCell2 = (0, sinon_1.spy)(defaultRenderEditCell);
                render(<TestCase column1Props={{ renderEditCell: renderEditCell1 }} column2Props={{ renderEditCell: renderEditCell2 }}/>);
                (0, internal_test_utils_1.act)(function () {
                    var _a;
                    return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({
                        id: 0,
                        fieldToFocus: 'currencyPair',
                        deleteValue: true,
                    });
                });
                expect(renderEditCell1.lastCall.args[0].value).to.equal('');
                expect(renderEditCell2.lastCall.args[0].value).to.equal(1);
            });
        });
        describe('setEditCellValue', function () {
            it('should update the value prop given to renderEditCell', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderEditCell1, renderEditCell2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            renderEditCell1 = (0, sinon_1.spy)(defaultRenderEditCell);
                            renderEditCell2 = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase column1Props={{ renderEditCell: renderEditCell1 }} column2Props={{ renderEditCell: renderEditCell2 }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            expect(renderEditCell1.lastCall.args[0].value).to.equal('USDGBP');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'usdgbp' }); })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell1.lastCall.args[0].value).to.equal('usdgbp');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass to renderEditCell the row with the values updated', function () { return __awaiter(void 0, void 0, void 0, function () {
                var valueSetter, renderEditCell1, renderEditCell2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valueSetter = function (value, row) { return (__assign(__assign({}, row), { currencyPair: value.trim() })); };
                            renderEditCell1 = (0, sinon_1.spy)(defaultRenderEditCell);
                            renderEditCell2 = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase column1Props={{ renderEditCell: renderEditCell1, valueSetter: valueSetter }} column2Props={{ renderEditCell: renderEditCell2 }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            expect(renderEditCell1.lastCall.args[0].row).to.deep.equal(defaultData.rows[0]);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: ' usdgbp ' }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'price1M', value: 100 }); })];
                        case 2:
                            _a.sent();
                            expect(renderEditCell2.lastCall.args[0].row).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: 'usdgbp', price1M: 100 }));
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
                            render(<TestCase column1Props={{ renderEditCell: renderEditCell, valueParser: valueParser }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
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
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            _a = expect;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should set isProcessingProps to true before calling preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, renderEditCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function () { return new Promise(function () { }); };
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    return new Promise(function (resolve) {
                                        var _a;
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
                                        resolve();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call all preProcessEditCellProps with the correct params', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps1, preProcessEditCellProps2, args1, args2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps1 = (0, sinon_1.spy)(function (_a) {
                                var props = _a.props;
                                return props;
                            });
                            preProcessEditCellProps2 = (0, sinon_1.spy)(function (_a) {
                                var props = _a.props;
                                return props;
                            });
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps1 }} column2Props={{ preProcessEditCellProps: preProcessEditCellProps2 }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            args1 = preProcessEditCellProps1.lastCall.args[0];
                            expect(args1.id).to.equal(0);
                            expect(args1.row).to.deep.equal(defaultData.rows[0]);
                            expect(args1.hasChanged).to.equal(true);
                            expect(args1.props).to.deep.equal({
                                value: 'USD GBP',
                                error: false,
                                isProcessingProps: true,
                                changeReason: 'setEditCellValue',
                            });
                            args2 = preProcessEditCellProps2.lastCall.args[0];
                            expect(args2.id).to.equal(0);
                            expect(args2.row).to.deep.equal(defaultData.rows[0]);
                            expect(args2.hasChanged).to.equal(false);
                            expect(args2.props).to.deep.equal({
                                value: 1,
                                error: false,
                                isProcessingProps: true,
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass to renderEditCell the props returned by preProcessEditCellProps', function () { return __awaiter(void 0, void 0, void 0, function () {
                var renderEditCell, preProcessEditCellProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { foo: 'bar' }));
                            };
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
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
                var renderEditCell, preProcessEditCellProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { value: 'foobar' }));
                            };
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps, renderEditCell: renderEditCell }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
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
                var resolve1, resolve2, renderEditCell1, renderEditCell2, preProcessEditCellProps1, preProcessEditCellProps2, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            renderEditCell1 = (0, sinon_1.spy)(defaultRenderEditCell);
                            renderEditCell2 = (0, sinon_1.spy)(defaultRenderEditCell);
                            preProcessEditCellProps1 = function (_a) {
                                var props = _a.props;
                                return new Promise(function (resolve) {
                                    resolve1 = function () { return resolve(props); };
                                });
                            };
                            preProcessEditCellProps2 = function (_a) {
                                var props = _a.props;
                                return new Promise(function (resolve) {
                                    resolve2 = function () { return resolve(props); };
                                });
                            };
                            render(<TestCase column1Props={{
                                    preProcessEditCellProps: preProcessEditCellProps1,
                                    renderEditCell: renderEditCell1,
                                }} column2Props={{
                                    preProcessEditCellProps: preProcessEditCellProps2,
                                    renderEditCell: renderEditCell2,
                                }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    return new Promise(function (resolve) {
                                        var _a;
                                        promise = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                            id: 0,
                                            field: 'currencyPair',
                                            value: 'USD GBP',
                                        });
                                        resolve();
                                    });
                                })];
                        case 1:
                            _a.sent();
                            expect(renderEditCell1.lastCall.args[0].isProcessingProps).to.equal(true);
                            expect(renderEditCell2.lastCall.args[0].isProcessingProps).to.equal(true);
                            resolve1();
                            resolve2();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return promise; })];
                        case 2:
                            _a.sent();
                            expect(renderEditCell1.lastCall.args[0].isProcessingProps).to.equal(false);
                            expect(renderEditCell2.lastCall.args[0].isProcessingProps).to.equal(false);
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
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
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
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
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
                                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({
                                    id: 0,
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
                beforeEach(function () {
                    vitest_1.vi.useFakeTimers();
                });
                afterEach(function () {
                    vitest_1.vi.useRealTimers();
                });
                it('should debounce multiple changes if debounceMs > 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var renderEditCell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                                render(<TestCase column1Props={{ renderEditCell: renderEditCell }}/>);
                                return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                        return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 })];
                                    }); }); })];
                            case 1:
                                _a.sent();
                                expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
                                renderEditCell.resetHistory();
                                return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                                id: 0,
                                                field: 'currencyPair',
                                                value: 'USD',
                                                debounceMs: 100,
                                            });
                                            return [2 /*return*/];
                                        });
                                    }); })];
                            case 2:
                                _a.sent();
                                expect(renderEditCell.callCount).to.equal(0);
                                return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                                id: 0,
                                                field: 'currencyPair',
                                                value: 'USD GBP',
                                                debounceMs: 100,
                                            });
                                            return [2 /*return*/];
                                        });
                                    }); })];
                            case 3:
                                _a.sent();
                                expect(renderEditCell.callCount).to.equal(0);
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
                            case 4:
                                _a.sent();
                                expect(renderEditCell.callCount).not.to.equal(0);
                                expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('stopRowEditMode', function () {
            it('should reject when the cell is not in edit mode', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    render(<TestCase />);
                    expect(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); }).to.throw('MUI X: The row with id=0 is not in edit mode.');
                    return [2 /*return*/];
                });
            }); });
            it('should update the row with the new value stored', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase />);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 })];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' })];
                                }); }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 })];
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
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0, ignoreModifications: true }); });
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
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            (0, internal_test_utils_1.act)(function () {
                                var _a;
                                promise = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                    id: 0,
                                    field: 'currencyPair',
                                    value: 'USD GBP',
                                });
                            });
                            // Simulates the user stopping the editing while processing the props
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            resolveCallback();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return promise; })];
                        case 1:
                            _a.sent(); // Run all updates scheduled for when preProcessEditCellProps resolves
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should do nothing if props of any column contains error=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should keep mode=edit if props of any column contains error=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, onRowModesModelChange;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            onRowModesModelChange = (0, sinon_1.spy)();
                            render(<TestCase onRowModesModelChange={onRowModesModelChange} column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            expect(onRowModesModelChange.lastCall.args[0]).to.deep.equal({ 0: { mode: 'edit' } });
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
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: '' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 2:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
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
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
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
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
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
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 2:
                            _a.sent();
                            expect(processRowUpdate.lastCall.args[0]).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: 'USD GBP' }));
                            expect(processRowUpdate.lastCall.args[1]).to.deep.equal(defaultData.rows[0]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call processRowUpdate with the old row even if the row is not there anymore', function () { return __awaiter(void 0, void 0, void 0, function () {
                var testRow, otherRows, allRows, testValue, processRowUpdate, setProps;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            testRow = defaultData.rows[0];
                            otherRows = defaultData.rows.slice(1);
                            allRows = __spreadArray([testRow], otherRows, true);
                            testValue = 'testing';
                            processRowUpdate = (0, sinon_1.spy)(function (newRow, oldRow) { return (__assign(__assign({}, oldRow), newRow)); });
                            setProps = render(<TestCase rows={allRows} processRowUpdate={processRowUpdate}/>).setProps;
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: testRow.id }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: testValue }); })];
                        case 1:
                            _c.sent();
                            // remove row that is being edited
                            setProps({ rows: otherRows });
                            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowsCount()).to.equal(otherRows.length);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: testRow.id }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 2:
                            _c.sent();
                            // deleted row data is still passed to `processRowUpdate` as `oldRow` parameter
                            expect(processRowUpdate.lastCall.args[0]).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: testValue }));
                            expect(processRowUpdate.lastCall.args[1]).to.deep.equal(testRow);
                            // all rows are there after `processRowUpdate` returns deleted row data
                            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowsCount()).to.equal(allRows.length);
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
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                expect(onProcessRowUpdateError.lastCall.args[0]).to.equal(error);
            });
            it('should call onProcessRowUpdateError if processRowUpdate rejects', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error, processRowUpdate, onProcessRowUpdateError;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = new Error('Something went wrong');
                            processRowUpdate = function () {
                                throw error;
                            };
                            onProcessRowUpdateError = (0, sinon_1.spy)();
                            render(<TestCase processRowUpdate={processRowUpdate} onProcessRowUpdateError={onProcessRowUpdateError}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, Promise.resolve()];
                        case 1:
                            _a.sent();
                            expect(onProcessRowUpdateError.lastCall.args[0]).to.equal(error);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should keep mode=edit if processRowUpdate rejects', function () { return __awaiter(void 0, void 0, void 0, function () {
                var error, processRowUpdate, onProcessRowUpdateError, onRowModesModelChange;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = new Error('Something went wrong');
                            processRowUpdate = function () {
                                throw error;
                            };
                            onProcessRowUpdateError = (0, sinon_1.spy)();
                            onRowModesModelChange = (0, sinon_1.spy)();
                            render(<TestCase onRowModesModelChange={onRowModesModelChange} processRowUpdate={processRowUpdate} onProcessRowUpdateError={onProcessRowUpdateError}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            expect(onRowModesModelChange.lastCall.args[0]).to.deep.equal({ 0: { mode: 'edit' } });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should pass the new value through all value setters before calling processRowUpdate', function () { return __awaiter(void 0, void 0, void 0, function () {
                var valueSetter1, valueSetter2, processRowUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valueSetter1 = (0, sinon_1.spy)(function (value, row) { return (__assign(__assign({}, row), { _currencyPair: value })); });
                            valueSetter2 = (0, sinon_1.spy)(function (value, row) { return (__assign(__assign({}, row), { _price1M: value })); });
                            processRowUpdate = (0, sinon_1.spy)(function (newRow) { return newRow; });
                            render(<TestCase processRowUpdate={processRowUpdate} column1Props={{ valueSetter: valueSetter1 }} column2Props={{ valueSetter: valueSetter2 }}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 2:
                            _a.sent();
                            expect(processRowUpdate.lastCall.args[0]).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: 'USDGBP', _currencyPair: 'USD GBP', price1M: 1, _price1M: 1 }));
                            expect(valueSetter1.lastCall.args[0]).to.equal('USD GBP');
                            expect(valueSetter1.lastCall.args[1]).to.deep.equal(defaultData.rows[0]);
                            expect(valueSetter2.lastCall.args[0]).to.equal(1);
                            expect(valueSetter2.lastCall.args[1]).to.deep.equal(__assign(__assign({}, defaultData.rows[0]), { currencyPair: 'USDGBP', _currencyPair: 'USD GBP' }));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should move focus to the cell below when cellToFocusAfter=below', function () {
                render(<TestCase />);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0, fieldToFocus: 'currencyPair' }); });
                expect((0, helperFn_1.getCell)(0, 1).querySelector('input')).toHaveFocus();
                (0, internal_test_utils_1.act)(function () {
                    var _a;
                    return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({
                        id: 0,
                        field: 'currencyPair',
                        cellToFocusAfter: 'below',
                    });
                });
                expect((0, helperFn_1.getCell)(1, 1)).toHaveFocus();
            });
            it('should move focus to the cell below when cellToFocusAfter=right', function () {
                render(<TestCase />);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0, fieldToFocus: 'currencyPair' }); });
                expect((0, helperFn_1.getCell)(0, 1).querySelector('input')).toHaveFocus();
                (0, internal_test_utils_1.act)(function () {
                    var _a;
                    return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({
                        id: 0,
                        field: 'currencyPair',
                        cellToFocusAfter: 'right',
                    });
                });
                expect((0, helperFn_1.getCell)(0, 2)).toHaveFocus();
            });
            it('should move focus to the cell below when cellToFocusAfter=left', function () {
                render(<TestCase />);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0, fieldToFocus: 'price1M' }); });
                expect((0, helperFn_1.getCell)(0, 2).querySelector('input')).toHaveFocus();
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0, field: 'price1M', cellToFocusAfter: 'left' }); });
                expect((0, helperFn_1.getCell)(0, 1)).toHaveFocus();
            });
            it('should keep in edit mode the cells that entered edit mode while processRowUpdate is called', function () { return __awaiter(void 0, void 0, void 0, function () {
                var onRowModesModelChange, resolveCallback, processRowUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onRowModesModelChange = (0, sinon_1.spy)();
                            processRowUpdate = function (newRow) {
                                return new Promise(function (resolve) {
                                    resolveCallback = function () { return resolve(newRow); };
                                });
                            };
                            render(<TestCase processRowUpdate={processRowUpdate} onRowModesModelChange={onRowModesModelChange}/>);
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0, fieldToFocus: 'price1M' }); });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0, field: 'price1M' }); });
                            expect(onRowModesModelChange.lastCall.args[0]).to.deep.equal({
                                0: { mode: 'view', field: 'price1M' },
                            });
                            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 1, fieldToFocus: 'price1M' }); });
                            expect(onRowModesModelChange.lastCall.args[0]).to.have.keys('0', '1');
                            expect(onRowModesModelChange.lastCall.args[0][1]).to.deep.equal({
                                mode: 'edit',
                                fieldToFocus: 'price1M',
                            });
                            resolveCallback();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                        case 2:
                            _a.sent();
                            expect(onRowModesModelChange.lastCall.args[0]).to.deep.equal({
                                1: { mode: 'edit', fieldToFocus: 'price1M' },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('with pending value mutation', function () {
                it('should run all pending value mutations before calling processRowUpdate', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var processRowUpdate, renderEditCell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                processRowUpdate = (0, sinon_1.spy)(function (newRow) { return newRow; });
                                renderEditCell = (0, sinon_1.spy)(defaultRenderEditCell);
                                render(<TestCase processRowUpdate={processRowUpdate} column1Props={{ renderEditCell: renderEditCell }}/>);
                                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0 }); });
                                return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                                id: 0,
                                                field: 'currencyPair',
                                                value: 'USD GBP',
                                                debounceMs: 100,
                                            });
                                            return [2 /*return*/];
                                        });
                                    }); })];
                            case 1:
                                _a.sent();
                                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
                                return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                            case 2:
                                _a.sent();
                                expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
                                expect(processRowUpdate.lastCall.args[0].currencyPair).to.equal('USD GBP');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('start edit mode', function () {
        describe('by double-click', function () {
            it("should publish 'rowEditStart' with reason=cellDoubleClick", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.lastCall.args[0].reason).to.equal('cellDoubleClick');
            });
            it("should not publish 'rowEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
            });
            it('should call startRowEditMode', function () {
                render(<TestCase />);
                var spiedStartRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startRowEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(spiedStartRowEditMode.callCount).to.equal(1);
            });
        });
        describe('by pressing Enter', function () {
            it("should publish 'rowEditStart' with reason=enterKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
            it("should not publish 'rowEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(listener.callCount).to.equal(0);
            });
            it('should call startRowEditMode passing fieldToFocus', function () {
                render(<TestCase />);
                var spiedStartRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startRowEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Enter' });
                expect(spiedStartRowEditMode.callCount).to.equal(1);
                expect(spiedStartRowEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    fieldToFocus: 'currencyPair',
                });
            });
        });
        describe('by pressing Delete', function () {
            it("should publish 'rowEditStart' with reason=deleteKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Delete' });
                expect(listener.lastCall.args[0].reason).to.equal('deleteKeyDown');
            });
            it("should not publish 'rowEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Delete' });
                expect(listener.callCount).to.equal(0);
            });
            it('should call startRowEditMode passing fieldToFocus and deleteValue', function () {
                render(<TestCase />);
                var spiedStartRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startRowEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Delete' });
                expect(spiedStartRowEditMode.callCount).to.equal(1);
                expect(spiedStartRowEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    fieldToFocus: 'currencyPair',
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
                            user = render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>).user;
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
            it("should publish 'rowEditStart' with reason=printableKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a' });
                expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
            });
            it("should not publish 'rowEditStart' if the cell is not editable", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 0);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a' });
                expect(listener.callCount).to.equal(0);
            });
            it('should call preProcessEditCellProps for editable columns only', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps1, preProcessEditCellProps2, user, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps1 = (0, sinon_1.spy)(function (_a) {
                                var props = _a.props;
                                return props;
                            });
                            preProcessEditCellProps2 = (0, sinon_1.spy)(function (_a) {
                                var props = _a.props;
                                return props;
                            });
                            user = render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps1 }} column2Props={{ preProcessEditCellProps: preProcessEditCellProps2, editable: false }}/>).user;
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, user.click(cell)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard('a')];
                        case 2:
                            _a.sent();
                            expect(preProcessEditCellProps1.callCount).to.equal(1);
                            expect(preProcessEditCellProps2.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            ['ctrlKey', 'metaKey'].forEach(function (key) {
                it("should not publish 'rowEditStart' if ".concat(key, " is pressed"), function () {
                    var _a;
                    var _b;
                    render(<TestCase />);
                    var listener = (0, sinon_1.spy)();
                    (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.subscribeEvent('rowEditStart', listener);
                    var cell = (0, helperFn_1.getCell)(0, 1);
                    fireUserEvent_1.fireUserEvent.mousePress(cell);
                    internal_test_utils_1.fireEvent.keyDown(cell, (_a = { key: 'a', keyCode: 65 }, _a[key] = true, _a));
                    expect(listener.callCount).to.equal(0);
                });
            });
            it("should call startRowEditMode if shiftKey is pressed with a letter", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a', keyCode: 65, shiftKey: true });
                expect(listener.callCount).to.equal(1);
            });
            it('should not call startRowEditMode if space is pressed', function () {
                var _a;
                render(<TestCase autoHeight/>);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: ' ' });
                expect(listener.callCount).to.equal(0);
            });
            it("should call startRowEditMode if ctrl+V is pressed", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStart', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
                expect(listener.callCount).to.equal(1);
            });
            it('should call startRowEditMode passing fieldToFocus and deleteValue', function () {
                render(<TestCase />);
                var spiedStartRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'startRowEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'a' });
                expect(spiedStartRowEditMode.callCount).to.equal(1);
                expect(spiedStartRowEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    fieldToFocus: 'currencyPair',
                    deleteValue: true,
                });
            });
            it("should ignore keydown event until the IME is confirmed with a letter", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                var input = cell.querySelector('input');
                internal_test_utils_1.fireEvent.change(input, { target: { value: 'あ' } });
                internal_test_utils_1.fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
                expect(listener.callCount).to.equal(1);
                expect(input.value).to.equal('あ');
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
            it("should ignore keydown event until the IME is confirmed with multiple letters", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                var input = cell.querySelector('input');
                internal_test_utils_1.fireEvent.change(input, { target: { value: 'ありがとう' } });
                internal_test_utils_1.fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
                expect(listener.callCount).to.equal(1);
                expect(input.value).to.equal('ありがとう');
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
        });
    });
    describe('stop edit mode', function () {
        describe('by clicking outside the cell', function () {
            it("should publish 'rowEditStop' with reason=rowFocusOut", function () { return __awaiter(void 0, void 0, void 0, function () {
                var listener;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            render(<TestCase />);
                            listener = (0, sinon_1.spy)();
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                            internal_test_utils_1.fireEvent.doubleClick((0, helperFn_1.getCell)(0, 1));
                            expect(listener.callCount).to.equal(0);
                            fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 1));
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(listener.lastCall.args[0].reason).to.equal('rowFocusOut');
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should not publish 'rowEditStop' if field has error", function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, listener, cell;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            listener = (0, sinon_1.spy)();
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                            cell = (0, helperFn_1.getCell)(0, 1);
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _b.sent();
                            expect(listener.callCount).to.equal(0);
                            fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 1));
                            expect(listener.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call stopRowEditMode with ignoreModifications=false and no cellToFocusAfter', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, spiedStopRowEditMode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<TestCase />).user;
                            spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                            return [4 /*yield*/, user.dblClick((0, helperFn_1.getCell)(0, 1))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                        case 2:
                            _a.sent();
                            expect(spiedStopRowEditMode.callCount).to.equal(1);
                            expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
                                id: 0,
                                ignoreModifications: false,
                                field: 'currencyPair',
                                cellToFocusAfter: undefined,
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call stopRowEditMode with ignoreModifications=false if the props are being processed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, user, spiedStopRowEditMode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function () { return new Promise(function () { }); };
                            user = render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>).user;
                            spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                            return [4 /*yield*/, user.dblClick((0, helperFn_1.getCell)(0, 1))];
                        case 1:
                            _a.sent();
                            (0, internal_test_utils_1.act)(function () {
                                var _a;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
                            });
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(spiedStopRowEditMode.callCount).to.equal(1);
                                })];
                        case 3:
                            _a.sent();
                            expect(spiedStopRowEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('by pressing Escape', function () {
            it("should publish 'rowEditStop' with reason=escapeKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Escape' });
                expect(listener.lastCall.args[0].reason).to.equal('escapeKeyDown');
            });
            it("should publish 'rowEditStop' even if field has error", function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, listener, cell;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            listener = (0, sinon_1.spy)();
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                            cell = (0, helperFn_1.getCell)(0, 1);
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _b.sent();
                            expect(listener.callCount).to.equal(0);
                            internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Escape' });
                            expect(listener.lastCall.args[0].reason).to.equal('escapeKeyDown');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call stopRowEditMode with ignoreModifications=true', function () {
                render(<TestCase />);
                var spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Escape' });
                expect(spiedStopRowEditMode.callCount).to.equal(1);
                expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    ignoreModifications: true,
                    field: 'currencyPair',
                    cellToFocusAfter: undefined,
                });
            });
        });
        describe('by pressing Enter', function () {
            it("should publish 'rowEditStop' with reason=enterKeyDown", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Enter' });
                expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
            });
            it("should not publish 'rowEditStop' if field has error", function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, listener, cell;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return (__assign(__assign({}, props), { error: true }));
                            };
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            listener = (0, sinon_1.spy)();
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                            cell = (0, helperFn_1.getCell)(0, 1);
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _b.sent();
                            expect(listener.callCount).to.equal(0);
                            internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Enter' });
                            expect(listener.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call stopRowEditMode with ignoreModifications=false and cellToFocusAfter=below', function () {
                render(<TestCase />);
                var spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Enter' });
                expect(spiedStopRowEditMode.callCount).to.equal(1);
                expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    ignoreModifications: false,
                    field: 'currencyPair',
                    cellToFocusAfter: 'below',
                });
            });
            it('should call stopRowEditMode with ignoreModifications=false if the props are being processed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, spiedStopRowEditMode, cell;
                return __generator(this, function (_a) {
                    preProcessEditCellProps = function () { return new Promise(function () { }); };
                    render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                    spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                    cell = (0, helperFn_1.getCell)(0, 1);
                    fireUserEvent_1.fireUserEvent.mousePress(cell);
                    internal_test_utils_1.fireEvent.doubleClick(cell);
                    (0, internal_test_utils_1.act)(function () {
                        var _a;
                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
                    });
                    internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Enter' });
                    expect(spiedStopRowEditMode.callCount).to.equal(1);
                    expect(spiedStopRowEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
                    return [2 /*return*/];
                });
            }); });
        });
        describe('by pressing Tab', function () {
            it("should publish 'rowEditStop' with reason=tabKeyDown if on the last column", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 2);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Tab' });
                expect(listener.lastCall.args[0].reason).to.equal('tabKeyDown');
            });
            it("should publish 'rowEditStop' with reason=shiftTabKeyDown if on the first column and Shift is pressed", function () {
                var _a;
                render(<TestCase />);
                var listener = (0, sinon_1.spy)();
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowEditStop', listener);
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(listener.callCount).to.equal(0);
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Tab', shiftKey: true });
                expect(listener.lastCall.args[0].reason).to.equal('shiftTabKeyDown');
            });
            it('should call stopRowEditMode with ignoreModifications=false and cellToFocusAfter=right', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, spiedStopRowEditMode, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<TestCase />).user;
                            spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                            cell = (0, helperFn_1.getCell)(0, 2);
                            return [4 /*yield*/, user.click(cell)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.dblClick(cell)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard('{Tab}')];
                        case 3:
                            _a.sent();
                            expect(spiedStopRowEditMode.callCount).to.equal(1);
                            expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
                                id: 0,
                                ignoreModifications: false,
                                field: 'price1M',
                                cellToFocusAfter: 'right',
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should call stopRowEditMode with ignoreModifications=false and cellToFocusAfter=left if Shift is pressed', function () {
                render(<TestCase />);
                var spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                var cell = (0, helperFn_1.getCell)(0, 1);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Tab', shiftKey: true });
                expect(spiedStopRowEditMode.callCount).to.equal(1);
                expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
                    id: 0,
                    ignoreModifications: false,
                    field: 'currencyPair',
                    cellToFocusAfter: 'left',
                });
            });
            it('should call stopRowEditMode with ignoreModifications=false if the props are being processed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var preProcessEditCellProps, spiedStopRowEditMode, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            preProcessEditCellProps = function () { return new Promise(function () { }); };
                            render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>);
                            spiedStopRowEditMode = (0, helperFn_1.spyApi)(apiRef.current, 'stopRowEditMode');
                            cell = (0, helperFn_1.getCell)(0, 2);
                            fireUserEvent_1.fireUserEvent.mousePress(cell);
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'price1M', value: 'USD GBP' });
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Tab' });
                            expect(spiedStopRowEditMode.callCount).to.equal(1);
                            expect(spiedStopRowEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should keep focus on the first column when editing the first column of the first row of the 2nd page', function () {
                render(<TestCase pageSizeOptions={[2]} initialState={{ pagination: { paginationModel: { pageSize: 2, page: 1 } } }} columnVisibilityModel={{ id: false }} pagination/>);
                var cell = (0, helperFn_1.getCell)(2, 0);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(cell.querySelector('input')).toHaveFocus();
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Tab', shiftKey: true });
                expect((0, helperFn_1.getCell)(2, 0)).toHaveFocus();
            });
            it('should keep focus on the last column when editing the last column of the last row of the 2nd page', function () {
                render(<TestCase pageSizeOptions={[2]} initialState={{ pagination: { paginationModel: { pageSize: 2, page: 1 } } }} columnVisibilityModel={{ price2M: false, price3M: false }} pagination/>);
                var cell = (0, helperFn_1.getCell)(3, 2);
                internal_test_utils_1.fireEvent.doubleClick(cell);
                expect(cell.querySelector('input')).toHaveFocus();
                internal_test_utils_1.fireEvent.keyDown(cell.querySelector('input'), { key: 'Tab' });
                expect((0, helperFn_1.getCell)(3, 2)).toHaveFocus();
            });
        });
    });
    describe('prop: rowModesModel', function () {
        describe('mode=view to mode=edit', function () {
            it('should start edit mode', function () {
                var setProps = render(<TestCase />).setProps;
                expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
                setProps({ rowModesModel: { 0: { mode: x_data_grid_pro_1.GridRowModes.Edit } } });
                expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
            });
        });
        describe('mode=edit to mode=view', function () {
            it('should stop edit mode', function () {
                var setProps = render(<TestCase rowModesModel={{ 0: { mode: x_data_grid_pro_1.GridRowModes.Edit } }}/>).setProps;
                expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                setProps({ rowModesModel: { 0: { mode: x_data_grid_pro_1.GridRowModes.View } } });
                expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
            });
            it('should stop edit mode when rowModesModel empty', function () {
                var setProps = render(<TestCase rowModesModel={{ 0: { mode: x_data_grid_pro_1.GridRowModes.Edit } }}/>).setProps;
                expect((0, helperFn_1.getCell)(0, 1)).to.have.class('MuiDataGrid-cell--editing');
                setProps({ rowModesModel: {} });
                expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
            });
            it('should ignode modifications if ignoreModifications=true', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setProps = render(<TestCase rowModesModel={{ 0: { mode: x_data_grid_pro_1.GridRowModes.Edit } }}/>).setProps;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            setProps({ rowModesModel: { 0: { mode: x_data_grid_pro_1.GridRowModes.View, ignoreModifications: true } } });
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
                            setProps = render(<TestCase rowModesModel={{ 0: { mode: x_data_grid_pro_1.GridRowModes.Edit } }}/>).setProps;
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                        case 1:
                            _a.sent();
                            setProps({
                                rowModesModel: {
                                    0: { mode: x_data_grid_pro_1.GridRowModes.View, cellToFocusAfter: 'below', field: 'currencyPair' },
                                },
                            });
                            expect((0, helperFn_1.getCell)(1, 1)).toHaveFocus();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("should publish 'rowModesModelChange' when the model changes", function () {
            render(<TestCase />);
            var listener = (0, sinon_1.spy)();
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowModesModelChange', listener); });
            var cell = (0, helperFn_1.getCell)(0, 1);
            internal_test_utils_1.fireEvent.doubleClick(cell);
            expect(listener.lastCall.args[0]).to.deep.equal({
                0: { mode: 'edit', fieldToFocus: 'currencyPair' },
            });
        });
        it("should publish 'rowModesModelChange' when the prop changes", function () {
            var setProps = render(<TestCase rowModesModel={{}}/>).setProps;
            var listener = (0, sinon_1.spy)();
            expect(listener.callCount).to.equal(0);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowModesModelChange', listener); });
            setProps({ rowModesModel: { 0: { currencyPair: { mode: 'edit' } } } });
            expect(listener.lastCall.args[0]).to.deep.equal({
                0: { currencyPair: { mode: 'edit' } },
            });
        });
        it("should not publish 'rowModesModelChange' when the model changes and rowModesModel is set", function () {
            render(<TestCase rowModesModel={{}}/>);
            var listener = (0, sinon_1.spy)();
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowModesModelChange', listener); });
            var cell = (0, helperFn_1.getCell)(0, 1);
            internal_test_utils_1.fireEvent.doubleClick(cell);
            expect(listener.callCount).to.equal(0);
        });
        it('should not mutate the rowModesModel prop if props of any column contains error=true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var preProcessEditCellProps, setProps, cell, rowModesModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preProcessEditCellProps = function (_a) {
                            var props = _a.props;
                            return (__assign(__assign({}, props), { error: true }));
                        };
                        setProps = render(<TestCase column1Props={{ preProcessEditCellProps: preProcessEditCellProps }}/>).setProps;
                        cell = (0, helperFn_1.getCell)(0, 1);
                        internal_test_utils_1.fireEvent.mouseUp(cell);
                        internal_test_utils_1.fireEvent.click(cell);
                        internal_test_utils_1.fireEvent.doubleClick(cell);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }); })];
                    case 1:
                        _a.sent();
                        rowModesModel = { 0: { mode: 'view' } };
                        setProps({ rowModesModel: rowModesModel });
                        expect(rowModesModel).to.deep.equal({ 0: { mode: 'view' } });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: onRowModesModelChange', function () {
        it('should call with mode=edit when startEditMode is called', function () {
            var onRowModesModelChange = (0, sinon_1.spy)();
            render(<TestCase onRowModesModelChange={onRowModesModelChange}/>);
            expect(onRowModesModelChange.callCount).to.equal(0);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0, fieldToFocus: 'currencyPair' }); });
            expect(onRowModesModelChange.callCount).to.equal(1);
            expect(onRowModesModelChange.lastCall.args[0]).to.deep.equal({
                0: { mode: 'edit', fieldToFocus: 'currencyPair' },
            });
        });
        it('should call with mode=view when stopEditMode is called', function () {
            var onRowModesModelChange = (0, sinon_1.spy)();
            render(<TestCase onRowModesModelChange={onRowModesModelChange}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.startRowEditMode({ id: 0, fieldToFocus: 'currencyPair' }); });
            onRowModesModelChange.resetHistory();
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.stopRowEditMode({ id: 0 }); });
            expect(onRowModesModelChange.args[0][0]).to.deep.equal({
                0: { mode: 'view' },
            });
            expect(onRowModesModelChange.args[1][0]).to.deep.equal({});
        });
        it("should not be called when changing the rowModesModel prop", function () {
            var onRowModesModelChange = (0, sinon_1.spy)();
            var setProps = render(<TestCase rowModesModel={{}} onRowModesModelChange={onRowModesModelChange}/>).setProps;
            expect(onRowModesModelChange.callCount).to.equal(0);
            setProps({ rowModesModel: { 0: { mode: 'edit' } } });
            expect(onRowModesModelChange.callCount).to.equal(0);
        });
    });
    it('should correctly handle Portals when pressing Tab to go to the next column', function () {
        function PortaledEditComponent(_a) {
            var hasFocus = _a.hasFocus;
            var _b = React.useState(null), inputRef = _b[0], setInputRef = _b[1];
            React.useLayoutEffect(function () {
                if (hasFocus && inputRef) {
                    inputRef.focus();
                }
            }, [hasFocus, inputRef]);
            return (<Portal_1.default>
          <input ref={setInputRef} data-testid="input"/>
        </Portal_1.default>);
        }
        var renderEditCell = function (props) { return (<PortaledEditComponent {...props}/>); };
        render(<TestCase column1Props={{ renderEditCell: renderEditCell }}/>);
        internal_test_utils_1.fireEvent.doubleClick((0, helperFn_1.getCell)(0, 1));
        var input = internal_test_utils_1.screen.getByTestId('input');
        expect(input).toHaveFocus();
        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Tab' });
        expect((0, helperFn_1.getCell)(0, 2).querySelector('input')).toHaveFocus();
    });
    it('should correctly handle Portals when pressing Shift+Tab to go to the previous column', function () {
        function PortaledEditComponent(_a) {
            var hasFocus = _a.hasFocus;
            var _b = React.useState(null), inputRef = _b[0], setInputRef = _b[1];
            React.useLayoutEffect(function () {
                if (hasFocus && inputRef) {
                    inputRef.focus();
                }
            }, [hasFocus, inputRef]);
            return (<Portal_1.default>
          <input ref={function (ref) {
                    setInputRef(ref);
                }} data-testid="input"/>
        </Portal_1.default>);
        }
        var renderEditCell = function (props) { return (<PortaledEditComponent {...props}/>); };
        render(<TestCase column2Props={{ renderEditCell: renderEditCell }}/>);
        internal_test_utils_1.fireEvent.doubleClick((0, helperFn_1.getCell)(0, 2));
        var input = internal_test_utils_1.screen.getByTestId('input');
        expect(input).toHaveFocus();
        internal_test_utils_1.fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });
        expect((0, helperFn_1.getCell)(0, 1).querySelector('input')).toHaveFocus();
    });
});

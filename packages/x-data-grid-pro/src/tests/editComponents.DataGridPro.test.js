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
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var sinon_1 = require("sinon");
/**
 * Creates a date that is compatible with years before 1901
 * `new Date(0001)` creates a date for 1901, not 0001
 */
var generateDate = function (year, month, date, hours, minutes) {
    var rawDate = new Date();
    rawDate.setFullYear(year);
    rawDate.setMonth(month);
    rawDate.setDate(date !== null && date !== void 0 ? date : 0);
    rawDate.setHours(hours !== null && hours !== void 0 ? hours : 0);
    rawDate.setMinutes(minutes !== null && minutes !== void 0 ? minutes : 0);
    rawDate.setSeconds(0);
    rawDate.setMilliseconds(0);
    return rawDate.getTime();
};
describe('<DataGridPro /> - Edit components', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var defaultData = { columns: [], rows: [] };
    function TestCase(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...defaultData} {...props}/>
      </div>);
    }
    describe('column type: string', function () {
        beforeEach(function () {
            defaultData.rows = [{ id: 0, brand: 'Nike' }];
            defaultData.columns = [{ field: 'brand', type: 'string', editable: true }];
        });
        it('should call setEditCellValue with debounce', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('textbox');
                        expect(input.value).to.equal('Nike');
                        return [4 /*yield*/, user.type(input, '[Backspace>4]Puma')];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
                            id: 0,
                            field: 'brand',
                            value: 'Puma',
                            debounceMs: 200,
                            unstable_skipValueParser: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pass the value prop to the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultData.columns[0].valueParser = function (value) { return value.toUpperCase(); };
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('textbox');
                        expect(input.value).to.equal('Nike');
                        return [4 /*yield*/, user.type(input, '[Backspace>4]Puma')];
                    case 2:
                        _a.sent();
                        expect(input.value).to.equal('PUMA');
                        return [2 /*return*/];
                }
            });
        }); });
        describe('with fake timers', function () {
            it('should display a indicator while processing the props', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            defaultData.columns[0].preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return new Promise(function (resolve) {
                                    setTimeout(function () { return resolve(props); }, 500);
                                });
                            };
                            user = render(<TestCase />).user;
                            cell = (0, helperFn_1.getCell)(0, 0);
                            return [4 /*yield*/, user.dblClick(cell)];
                        case 1:
                            _a.sent();
                            input = (0, internal_test_utils_1.within)(cell).getByRole('textbox');
                            expect(input.value).to.equal('Nike');
                            expect(internal_test_utils_1.screen.queryByTestId('LoadIcon')).to.equal(null);
                            return [4 /*yield*/, user.type(input, '[Backspace>4]Puma')];
                        case 2:
                            _a.sent();
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
                        case 3:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByTestId('LoadIcon')).not.to.equal(null);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, helperFn_1.sleep)(500)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 4:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByTestId('LoadIcon')).to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should call onValueChange if defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onValueChange, user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onValueChange = (0, sinon_1.spy)();
                        defaultData.columns[0].renderEditCell = function (params) {
                            return (0, x_data_grid_pro_1.renderEditInputCell)(__assign(__assign({}, params), { onValueChange: onValueChange }));
                        };
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('textbox');
                        return [4 /*yield*/, user.type(input, '[Backspace>4]Puma')];
                    case 2:
                        _a.sent();
                        expect(onValueChange.callCount).to.equal(8);
                        expect(onValueChange.lastCall.args[1]).to.equal('Puma');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('column type: number', function () {
        beforeEach(function () {
            defaultData.rows = [{ id: 0, quantity: 100 }];
            defaultData.columns = [{ field: 'quantity', type: 'number', editable: true }];
        });
        it('should call setEditCellValue with debounce', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('spinbutton');
                        expect(input.value).to.equal('100');
                        return [4 /*yield*/, user.type(input, '[Backspace>2]10')];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
                            id: 0,
                            field: 'quantity',
                            value: 110,
                            debounceMs: 200,
                            unstable_skipValueParser: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should the value prop to the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('spinbutton');
                        expect(input.value).to.equal('100');
                        return [4 /*yield*/, user.type(input, '[Backspace>2]10')];
                    case 2:
                        _a.sent();
                        expect(input.value).to.equal('110');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should keep values as numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var preProcessEditCellPropsSpy, user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preProcessEditCellPropsSpy = (0, sinon_1.spy)(function (_a) {
                            var props = _a.props;
                            return props;
                        });
                        defaultData.columns[0].preProcessEditCellProps = preProcessEditCellPropsSpy;
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('spinbutton');
                        expect(input.value).to.equal('100');
                        return [4 /*yield*/, user.type(input, '[Backspace>2]10')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                return expect(preProcessEditCellPropsSpy.lastCall.args[0].props.value).to.equal(110);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('with fake timers', function () {
            it('should display a indicator while processing the props', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            defaultData.columns[0].preProcessEditCellProps = function (_a) {
                                var props = _a.props;
                                return new Promise(function (resolve) {
                                    setTimeout(function () { return resolve(props); }, 500);
                                });
                            };
                            user = render(<TestCase />).user;
                            cell = (0, helperFn_1.getCell)(0, 0);
                            return [4 /*yield*/, user.dblClick(cell)];
                        case 1:
                            _a.sent();
                            input = (0, internal_test_utils_1.within)(cell).getByRole('spinbutton');
                            expect(input.value).to.equal('100');
                            expect(internal_test_utils_1.screen.queryByTestId('LoadIcon')).to.equal(null);
                            return [4 /*yield*/, user.type(input, '110')];
                        case 2:
                            _a.sent();
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
                        case 3:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByTestId('LoadIcon')).not.to.equal(null);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, helperFn_1.sleep)(500)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 4:
                            _a.sent();
                            expect(internal_test_utils_1.screen.queryByTestId('LoadIcon')).to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('column type: date', function () {
        beforeEach(function () {
            defaultData.rows = [{ id: 0, createdAt: new Date(2022, 1, 18) }];
            defaultData.columns = [{ field: 'createdAt', type: 'date', editable: true }];
        });
        it('should call setEditCellValue with the value converted to Date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _b.sent();
                        input = cell.querySelector('input');
                        expect(input.value).to.equal('2022-02-18');
                        return [4 /*yield*/, user.type(input, '2022-02-10', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: Infinity,
                            })];
                    case 2:
                        _b.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].id).to.equal(0);
                        expect(spiedSetEditCellValue.lastCall.args[0].field).to.equal('createdAt');
                        expect(spiedSetEditCellValue.lastCall.args[0].debounceMs).to.equal(undefined);
                        expect((_a = spiedSetEditCellValue.lastCall.args[0].value) === null || _a === void 0 ? void 0 : _a.toISOString()).to.equal(new Date(2022, 1, 10).toISOString());
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call setEditCellValue with null when entered an empty value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        return [4 /*yield*/, user.type(input, '[Backspace]', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: Infinity,
                            })];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pass the value prop to the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        expect(input.value).to.equal('2022-02-18');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                        id: 0,
                                        field: 'createdAt',
                                        value: new Date(2022, 1, 10),
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(input.value).to.equal('2022-02-10');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle correctly dates with partial years', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        expect(input.value).to.equal('2022-02-18');
                        // 2021-01-05T14:30
                        return [4 /*yield*/, user.type(input, '2021-01-05', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 10,
                            })];
                    case 2:
                        // 2021-01-05T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(2021, 0, 5));
                        // 2021-01-01T14:30
                        return [4 /*yield*/, user.type(input, '01', {
                                initialSelectionStart: 8,
                                initialSelectionEnd: 10,
                            })];
                    case 3:
                        // 2021-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(2021, 0, 1));
                        // 0001-01-01T14:30
                        return [4 /*yield*/, user.type(input, '0001', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 4:
                        // 0001-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(1, 0, 1));
                        // 0019-01-01T14:30
                        return [4 /*yield*/, user.type(input, '0019', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 5:
                        // 0019-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(19, 0, 1));
                        // 0199-01-01T14:30
                        return [4 /*yield*/, user.type(input, '0199', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 6:
                        // 0199-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(199, 0, 1));
                        // 1999-01-01T14:30
                        return [4 /*yield*/, user.type(input, '1999', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 7:
                        // 1999-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(1999, 0, 1));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onValueChange if defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onValueChange, user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onValueChange = (0, sinon_1.spy)();
                        defaultData.columns[0].renderEditCell = function (params) {
                            return (0, x_data_grid_pro_1.renderEditDateCell)(__assign(__assign({}, params), { onValueChange: onValueChange }));
                        };
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        return [4 /*yield*/, user.type(input, '2022-02-10', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 10,
                            })];
                    case 2:
                        _a.sent();
                        expect(onValueChange.callCount).to.equal(1);
                        expect(onValueChange.lastCall.args[1].toISOString()).to.equal(new Date(2022, 1, 10).toISOString());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('column type: dateTime', function () {
        beforeEach(function () {
            defaultData.rows = [{ id: 0, createdAt: new Date(2022, 1, 18, 14, 30) }];
            defaultData.columns = [{ field: 'createdAt', type: 'dateTime', editable: true }];
        });
        it('should call setEditCellValue with the value converted to Date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        expect(input.value).to.equal('2022-02-18T14:30');
                        return [4 /*yield*/, user.type(input, '2022-02-10T15:30:00', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 16,
                            })];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].id).to.equal(0);
                        expect(spiedSetEditCellValue.lastCall.args[0].field).to.equal('createdAt');
                        expect(spiedSetEditCellValue.lastCall.args[0].debounceMs).to.equal(undefined);
                        expect(spiedSetEditCellValue.lastCall.args[0].value.toISOString()).to.equal(new Date(2022, 1, 10, 15, 30, 0).toISOString());
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call setEditCellValue with null when entered an empty value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        return [4 /*yield*/, user.type(input, '[Backspace]')];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pass the value prop to the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        expect(input.value).to.equal('2022-02-18T14:30');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({
                                        id: 0,
                                        field: 'createdAt',
                                        value: new Date(2022, 1, 10, 15, 10, 0),
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(input.value).to.equal('2022-02-10T15:10');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle correctly dates with partial years', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = cell.querySelector('input');
                        expect(input.value).to.equal('2022-02-18T14:30');
                        // 2021-01-05T14:30
                        return [4 /*yield*/, user.type(input, '2021-01-05', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 10,
                            })];
                    case 2:
                        // 2021-01-05T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(2021, 0, 5, 14, 30));
                        // 2021-01-01T14:30
                        return [4 /*yield*/, user.type(input, '01', {
                                initialSelectionStart: 8,
                                initialSelectionEnd: 10,
                            })];
                    case 3:
                        // 2021-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(2021, 0, 1, 14, 30));
                        // 0001-01-01T14:30
                        return [4 /*yield*/, user.type(input, '0001', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 4:
                        // 0001-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(1, 0, 1, 14, 30));
                        // 0019-01-01T14:30
                        return [4 /*yield*/, user.type(input, '0019', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 5:
                        // 0019-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(19, 0, 1, 14, 30));
                        // 0199-01-01T14:30
                        return [4 /*yield*/, user.type(input, '0199', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 6:
                        // 0199-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(199, 0, 1, 14, 30));
                        // 1999-01-01T14:30
                        return [4 /*yield*/, user.type(input, '1999', {
                                initialSelectionStart: 0,
                                initialSelectionEnd: 4,
                            })];
                    case 7:
                        // 1999-01-01T14:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(1999, 0, 1, 14, 30));
                        // 1999-01-01T20:30
                        return [4 /*yield*/, user.type(input, '20:30', {
                                initialSelectionStart: 11,
                                initialSelectionEnd: 16,
                            })];
                    case 8:
                        // 1999-01-01T20:30
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(1999, 0, 1, 20, 30));
                        // 1999-01-01T20:02
                        return [4 /*yield*/, user.type(input, '02', {
                                initialSelectionStart: 14,
                                initialSelectionEnd: 16,
                            })];
                    case 9:
                        // 1999-01-01T20:02
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(1999, 0, 1, 20, 2));
                        // 1999-01-01T20:25
                        return [4 /*yield*/, user.type(input, '25', {
                                initialSelectionStart: 14,
                                initialSelectionEnd: 16,
                            })];
                    case 10:
                        // 1999-01-01T20:25
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(generateDate(1999, 0, 1, 20, 25));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('column type: singleSelect', function () {
        beforeEach(function () {
            defaultData.rows = [{ id: 0, brand: 'Nike' }];
            defaultData.columns = [
                { field: 'brand', type: 'singleSelect', valueOptions: ['Nike', 'Adidas'], editable: true },
            ];
        });
        it('should call setEditCellValue with the correct value when valueOptions is an array of strings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.queryAllByRole('option')[1])];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
                            id: 0,
                            field: 'brand',
                            value: 'Adidas',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call setEditCellValue with the correct value when valueOptions is an array of objects', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultData.rows = [{ id: 0, brand: 0 }];
                        defaultData.columns = [
                            {
                                field: 'brand',
                                type: 'singleSelect',
                                valueOptions: [
                                    { value: 0, label: 'Nike' },
                                    { value: 1, label: 'Adidas' },
                                ],
                                editable: true,
                            },
                        ];
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.queryAllByRole('option')[1])];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
                            id: 0,
                            field: 'brand',
                            value: 1,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call setEditCellValue with the correct value when valueOptions is a function', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultData.columns = [
                            {
                                field: 'brand',
                                type: 'singleSelect',
                                valueOptions: function () { return ['Nike', 'Adidas']; },
                                editable: true,
                            },
                        ];
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.queryAllByRole('option')[1])];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
                            id: 0,
                            field: 'brand',
                            value: 'Adidas',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pass the value prop to the select', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        expect(cell.textContent.replace(/[\W]+/, '')).to.equal('Nike'); // We use .replace to remove &ZeroWidthSpace;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setEditCellValue({ id: 0, field: 'brand', value: 'Adidas' });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(cell.textContent.replace(/[\W]+/, '')).to.equal('Adidas');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onValueChange if defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onValueChange, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onValueChange = (0, sinon_1.spy)();
                        defaultData.columns[0].renderEditCell = function (params) {
                            return (0, x_data_grid_pro_1.renderEditSingleSelectCell)(__assign(__assign({}, params), { onValueChange: onValueChange }));
                        };
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.queryAllByRole('option')[1])];
                    case 2:
                        _a.sent();
                        expect(onValueChange.callCount).to.equal(1);
                        expect(onValueChange.lastCall.args[1]).to.equal('Adidas');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onCellEditStop', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onCellEditStop, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onCellEditStop = (0, sinon_1.spy)();
                        user = render(<div>
          <TestCase onCellEditStop={onCellEditStop}/>
          <div id="outside-grid"/>
        </div>).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(document.getElementById('outside-grid'))];
                    case 2:
                        _a.sent();
                        expect(onCellEditStop.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not open the suggestions when Enter is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultData.columns[0].renderEditCell = function (params) { return (0, x_data_grid_pro_1.renderEditSingleSelectCell)(params); };
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.queryAllByRole('option')[1])];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('listbox')).to.equal(null);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    internal_test_utils_1.screen.getByRole('combobox').focus();
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Enter}')];
                    case 4:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('listbox')).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('column type: boolean', function () {
        beforeEach(function () {
            defaultData.rows = [{ id: 0, isAdmin: false }];
            defaultData.columns = [{ field: 'isAdmin', type: 'boolean', editable: true }];
        });
        it('should call setEditCellValue', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSetEditCellValue, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        spiedSetEditCellValue = (0, helperFn_1.spyApi)(apiRef.current, 'setEditCellValue');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('checkbox');
                        expect(input.checked).to.equal(false);
                        return [4 /*yield*/, user.click(input)];
                    case 2:
                        _a.sent();
                        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
                            id: 0,
                            field: 'isAdmin',
                            value: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onValueChange if defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onValueChange, user, cell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onValueChange = (0, sinon_1.spy)();
                        defaultData.columns[0].renderEditCell = function (params) {
                            return (0, x_data_grid_pro_1.renderEditBooleanCell)(__assign(__assign({}, params), { onValueChange: onValueChange }));
                        };
                        user = render(<TestCase />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.dblClick(cell)];
                    case 1:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(cell).getByRole('checkbox');
                        return [4 /*yield*/, user.click(input)];
                    case 2:
                        _a.sent();
                        expect(onValueChange.callCount).to.equal(1);
                        expect(onValueChange.lastCall.args[1]).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});

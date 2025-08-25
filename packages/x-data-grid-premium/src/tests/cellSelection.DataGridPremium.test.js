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
var helperFn_1 = require("test/utils/helperFn");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPremium /> - Cell selection', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestDataGridSelection(_a) {
        var _b = _a.rowLength, rowLength = _b === void 0 ? 4 : _b, _c = _a.width, width = _c === void 0 ? 400 : _c, _d = _a.height, height = _d === void 0 ? 300 : _d, other = __rest(_a, ["rowLength", "width", "height"]);
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        var data = React.useMemo(function () { return (0, x_data_grid_generator_1.getBasicGridData)(rowLength, 3); }, [rowLength]);
        return (<div style={{ width: width, height: height }}>
        <x_data_grid_premium_1.DataGridPremium {...data} apiRef={apiRef} rowSelection={false} cellSelection disableVirtualization hideFooter {...other}/>
      </div>);
    }
    it('should select the cell clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGridSelection />).user;
                    expect(document.querySelector('.Mui-selected')).to.equal(null);
                    cell = (0, helperFn_1.getCell)(0, 1);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _a.sent();
                    expect(document.querySelector('.Mui-selected')).to.equal(cell);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should unselect already selected cells when selecting a cell', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell01, cell11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGridSelection />).user;
                    cell01 = (0, helperFn_1.getCell)(0, 1);
                    return [4 /*yield*/, user.click(cell01)];
                case 1:
                    _a.sent();
                    expect(cell01).to.have.class('Mui-selected');
                    cell11 = (0, helperFn_1.getCell)(1, 1);
                    return [4 /*yield*/, user.click(cell11)];
                case 2:
                    _a.sent();
                    expect(cell01).not.to.have.class('Mui-selected');
                    expect(cell11).to.have.class('Mui-selected');
                    return [2 /*return*/];
            }
        });
    }); });
    // https://github.com/mui/mui-x/issues/10777
    it('should work with the paginated grid', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell01, cell02;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGridSelection initialState={{ pagination: { paginationModel: { page: 0, pageSize: 3 }, rowCount: 4 } }} rowLength={30} pagination pageSizeOptions={[3]} hideFooter={false}/>).user;
                    cell01 = (0, helperFn_1.getCell)(2, 0);
                    return [4 /*yield*/, user.click(cell01)];
                case 1:
                    _a.sent();
                    expect(cell01).to.have.class('Mui-selected');
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 2:
                    _a.sent();
                    cell02 = (0, helperFn_1.getCell)(5, 0);
                    return [4 /*yield*/, user.click(cell02)];
                case 3:
                    _a.sent();
                    expect(cell02).to.have.class('Mui-selected');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Ctrl + click', function () {
        it('should add the clicked cells to the selection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell11, cell21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        expect(document.querySelector('.Mui-selected')).to.equal(null);
                        cell11 = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell11)];
                    case 1:
                        _a.sent();
                        expect(cell11).to.have.class('Mui-selected');
                        cell21 = (0, helperFn_1.getCell)(2, 1);
                        return [4 /*yield*/, user.keyboard('{Control>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell21)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Control}')];
                    case 4:
                        _a.sent();
                        expect(cell21).to.have.class('Mui-selected');
                        expect(cell11).to.have.class('Mui-selected');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should unselect the cell if the cell is already selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        expect(document.querySelector('.Mui-selected')).to.equal(null);
                        cell = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect(cell).to.have.class('Mui-selected');
                        return [4 /*yield*/, user.keyboard('{Control>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Control}')];
                    case 4:
                        _a.sent();
                        expect(cell).not.to.have.class('Mui-selected');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Shift + click', function () {
        it('should select all cells between two cells', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        expect(document.querySelector('.Mui-selected')).to.equal(null);
                        cell = (0, helperFn_1.getCell)(0, 0);
                        cell.focus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(document.querySelectorAll('.Mui-selected')).to.have.length(3 * 2); // 3 rows with 2 cells each
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call selectCellRange', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSelectCellsBetweenRange, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        spiedSelectCellsBetweenRange = (0, helperFn_1.spyApi)(apiRef.current, 'selectCellRange');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        cell.focus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 0, field: 'id' });
                        expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({
                            id: 2,
                            field: 'currencyPair',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add classes to the cells that are at the corners of a range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        cell.focus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 2))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getCell)(0, 0)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeTop']);
                        expect((0, helperFn_1.getCell)(0, 0)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeLeft']);
                        expect((0, helperFn_1.getCell)(0, 1)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeTop']);
                        expect((0, helperFn_1.getCell)(0, 2)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeRight']);
                        expect((0, helperFn_1.getCell)(0, 2)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeTop']);
                        expect((0, helperFn_1.getCell)(1, 0)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeLeft']);
                        expect((0, helperFn_1.getCell)(1, 2)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeRight']);
                        expect((0, helperFn_1.getCell)(2, 0)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeBottom']);
                        expect((0, helperFn_1.getCell)(2, 0)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeLeft']);
                        expect((0, helperFn_1.getCell)(2, 1)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeBottom']);
                        expect((0, helperFn_1.getCell)(2, 2)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeRight']);
                        expect((0, helperFn_1.getCell)(2, 2)).to.have.class(x_data_grid_premium_1.gridClasses['cell--rangeBottom']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should keep the focus on first clicked cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        cell.focus();
                        expect(cell).toHaveFocus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(cell).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Shift + arrow keys', function () {
        it('should call selectCellRange when ArrowDown is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSelectCellsBetweenRange, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        spiedSelectCellsBetweenRange = (0, helperFn_1.spyApi)(apiRef.current, 'selectCellRange');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        cell.focus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}{ArrowDown}{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 0, field: 'id' });
                        expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({ id: 1, field: 'id' });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call selectCellRange when ArrowUp is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSelectCellsBetweenRange, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        spiedSelectCellsBetweenRange = (0, helperFn_1.spyApi)(apiRef.current, 'selectCellRange');
                        cell = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                cell.focus();
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}{ArrowUp}{/Shift}')];
                    case 3:
                        _a.sent();
                        expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 1, field: 'id' });
                        expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({ id: 0, field: 'id' });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call selectCellRange when ArrowLeft is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSelectCellsBetweenRange, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        spiedSelectCellsBetweenRange = (0, helperFn_1.spyApi)(apiRef.current, 'selectCellRange');
                        cell = (0, helperFn_1.getCell)(0, 1);
                        cell.focus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}{ArrowLeft}{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({
                            id: 0,
                            field: 'currencyPair',
                        });
                        expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({ id: 0, field: 'id' });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call selectCellRange when ArrowRight is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, spiedSelectCellsBetweenRange, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        spiedSelectCellsBetweenRange = (0, helperFn_1.spyApi)(apiRef.current, 'selectCellRange');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        cell.focus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}{ArrowRight}{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 0, field: 'id' });
                        expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({
                            id: 0,
                            field: 'currencyPair',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should keep the focus on first clicked cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        cell.focus();
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}{ArrowDown}{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(cell).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('onCellSelectionModelChange', function () {
        it('should update the selection state when a cell is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onCellSelectionModelChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onCellSelectionModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGridSelection cellSelectionModel={{}} onCellSelectionModelChange={onCellSelectionModelChange}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(onCellSelectionModelChange.callCount).to.equal(1);
                        expect(onCellSelectionModelChange.lastCall.args[0]).to.deep.equal({ '0': { id: true } });
                        return [2 /*return*/];
                }
            });
        }); });
        // Context: https://github.com/mui/mui-x/issues/14184
        it('should add the new cell selection range to the existing state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onCellSelectionModelChange, user, isMac;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onCellSelectionModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGridSelection cellSelectionModel={{ '0': { id: true } }} onCellSelectionModelChange={onCellSelectionModelChange}/>).user;
                        isMac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                        return [4 /*yield*/, user.keyboard(isMac ? '{Meta>}' : '{Control>}')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.pointer([
                                // touch the screen at element1
                                { keys: '[MouseLeft>]', target: (0, helperFn_1.getCell)(2, 0) },
                                // move the touch pointer to element2
                                { target: (0, helperFn_1.getCell)(3, 0) },
                                // release the touch pointer at the last position (element2)
                                { keys: '[/MouseLeft]' },
                            ])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard(isMac ? '{/Meta}' : '{/Control}')];
                    case 3:
                        _a.sent();
                        expect(onCellSelectionModelChange.lastCall.args[0]).to.deep.equal({
                            '0': { id: true },
                            '2': { id: true },
                            '3': { id: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiRef', function () {
        describe('selectCellRange', function () {
            it('should select all cells within the given arguments if end > start', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    render(<TestDataGridSelection />);
                    (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectCellRange({ id: 0, field: 'id' }, { id: 2, field: 'price1M' }); });
                    expect((0, helperFn_1.getCell)(0, 0)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(0, 1)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(0, 2)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(1, 0)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(1, 1)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(1, 2)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(2, 0)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(2, 1)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(2, 2)).to.have.class('Mui-selected');
                    return [2 /*return*/];
                });
            }); });
            it('should select all cells within the given arguments if start > end', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestDataGridSelection />);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectCellRange({ id: 0, field: 'id' }, { id: 2, field: 'price1M' }); })];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.getCell)(0, 0)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(0, 1)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(0, 2)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(1, 0)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(1, 1)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(1, 2)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(2, 0)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(2, 1)).to.have.class('Mui-selected');
                            expect((0, helperFn_1.getCell)(2, 2)).to.have.class('Mui-selected');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should discard previously selected cells and keep only the ones inside the range', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    render(<TestDataGridSelection initialState={{ cellSelection: { 0: { id: true, currencyPair: true, price1M: true } } }}/>);
                    expect((0, helperFn_1.getCell)(0, 0)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(0, 1)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(0, 2)).to.have.class('Mui-selected');
                    (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectCellRange({ id: 1, field: 'id' }, { id: 2, field: 'price1M' }); });
                    expect((0, helperFn_1.getCell)(0, 0)).not.to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(0, 1)).not.to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(0, 2)).not.to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(1, 0)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(1, 1)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(1, 2)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(2, 0)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(2, 1)).to.have.class('Mui-selected');
                    expect((0, helperFn_1.getCell)(2, 2)).to.have.class('Mui-selected');
                    return [2 /*return*/];
                });
            }); });
        });
        describe('getSelectedCellsAsArray', function () {
            it('should return the selected cells as an array', function () {
                var _a;
                render(<TestDataGridSelection cellSelectionModel={{ 0: { id: true, currencyPair: true, price1M: false } }}/>);
                expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedCellsAsArray()).to.deep.equal([
                    { id: 0, field: 'id' },
                    { id: 0, field: 'currencyPair' },
                ]);
            });
        });
    });
    // JSDOM doesn't support scroll events
    describe.skipIf(skipIf_1.isJSDOM)('Auto-scroll', function () {
        beforeEach(function () {
            (0, sinon_1.stub)(window, 'requestAnimationFrame').callsFake(function () { return 0; });
        });
        afterEach(function () {
            window.requestAnimationFrame.restore();
        });
        it('should auto-scroll when the mouse approaches the bottom edge', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rowHeight, columnHeaderHeight, border, user, cell11, cell71, virtualScroller, rect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowHeight = 30;
                        columnHeaderHeight = 50;
                        border = 1;
                        user = render(<TestDataGridSelection rowLength={20} rowHeight={30} columnHeaderHeight={50} height={rowHeight * 8 + columnHeaderHeight + 2 * border} width={400}/>).user;
                        cell11 = (0, helperFn_1.getCell)(1, 1);
                        cell71 = (0, helperFn_1.getCell)(7, 1);
                        virtualScroller = document.querySelector(".".concat(x_data_grid_premium_1.gridClasses.virtualScroller));
                        rect = virtualScroller.getBoundingClientRect();
                        expect(virtualScroller.scrollTop).to.equal(0);
                        return [4 /*yield*/, user.pointer([
                                { keys: '[MouseLeft>]', target: cell11 },
                                // 25=half speed
                                { target: cell71, coords: { x: rect.x, y: rect.y + rect.height - 25 } },
                                { keys: '[/MouseLeft]' },
                            ])];
                    case 1:
                        _a.sent();
                        expect(virtualScroller.scrollTop).to.equal(10);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    virtualScroller.scrollTop = 0;
                                    virtualScroller.dispatchEvent(new Event('scroll'));
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(virtualScroller.scrollTop).to.equal(0);
                        // Test is a bit flaky, so we wrap the pointer in a waitFor to retry
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, user.pointer([
                                                { keys: '[MouseLeft>]', target: cell11 },
                                                // 0=full speed
                                                { target: cell71, coords: { x: rect.x, y: rect.y + rect.height + 0 } },
                                                { keys: '[/MouseLeft]' },
                                            ])];
                                        case 1:
                                            _a.sent();
                                            expect(virtualScroller.scrollTop).to.equal(20);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        // Test is a bit flaky, so we wrap the pointer in a waitFor to retry
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should auto-scroll when the mouse approaches the top edge', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rowHeight, columnHeaderHeight, border, user, cell11, cell71, virtualScroller, gridRect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowHeight = 30;
                        columnHeaderHeight = 50;
                        border = 1;
                        user = render(<TestDataGridSelection rowLength={20} rowHeight={30} columnHeaderHeight={50} height={rowHeight * 8 + columnHeaderHeight + 2 * border} width={400}/>).user;
                        cell11 = (0, helperFn_1.getCell)(1, 1);
                        cell71 = (0, helperFn_1.getCell)(7, 1);
                        virtualScroller = document.querySelector(".".concat(x_data_grid_premium_1.gridClasses.virtualScroller));
                        gridRect = (0, helperFn_1.grid)('root').getBoundingClientRect();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    virtualScroller.scrollTo({ top: 30 });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(virtualScroller.scrollTop).to.equal(30);
                        return [4 /*yield*/, user.pointer([
                                { keys: '[MouseLeft>]', target: cell71 },
                                {
                                    target: cell11,
                                    coords: {
                                        x: gridRect.x,
                                        // 25=half speed
                                        y: gridRect.y + border + columnHeaderHeight + 25,
                                    },
                                },
                                { keys: '[/MouseLeft]' },
                            ])];
                    case 2:
                        _a.sent();
                        expect(virtualScroller.scrollTop).to.equal(20);
                        return [4 /*yield*/, user.pointer([
                                { keys: '[MouseLeft>]', target: cell71 },
                                {
                                    target: cell11,
                                    coords: {
                                        x: gridRect.x,
                                        // 0=full speed
                                        y: gridRect.y + border + columnHeaderHeight + 0,
                                    },
                                },
                                { keys: '[/MouseLeft]' },
                            ])];
                    case 3:
                        _a.sent();
                        expect(virtualScroller.scrollTop).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});

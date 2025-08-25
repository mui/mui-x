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
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var Restore_1 = require("@mui/icons-material/Restore");
var skipIf_1 = require("test/utils/skipIf");
var PAGE_SIZE = 10;
var ROW_HEIGHT = 52;
var HEADER_HEIGHT = 56;
var HEIGHT = 360;
var expectAriaCoordinate = function (element, _a) {
    var colIndex = _a.colIndex, rowIndex = _a.rowIndex;
    expect(element).to.have.attribute('aria-colindex', colIndex.toString());
    expect(element === null || element === void 0 ? void 0 : element.closest('[role="row"]')).to.have.attribute('aria-rowindex', rowIndex.toString());
};
describe('<DataGrid /> - Keyboard', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function NavigationTestCaseNoScrollX(props) {
        var data = (0, x_data_grid_generator_1.useBasicDemoData)(100, 3);
        var transformColSizes = function (columns) {
            return columns.map(function (column) { return (__assign(__assign({}, column), { width: 60 })); });
        };
        return (<div style={{ width: 300, height: HEIGHT }}>
        <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} rows={data.rows} columns={transformColSizes(data.columns)} initialState={{ pagination: { paginationModel: { pageSize: PAGE_SIZE } } }} pageSizeOptions={[PAGE_SIZE]} rowBufferPx={PAGE_SIZE * ROW_HEIGHT} rowHeight={ROW_HEIGHT} columnHeaderHeight={HEADER_HEIGHT} hideFooter filterModel={{ items: [{ field: 'id', operator: '>', value: 10 }] }} 
        // This had to be disabled again, `user.click` is not working with it
        experimentalFeatures={{ warnIfFocusStateIsNotSynced: false }} {...props}/>
      </div>);
    }
    /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
    describe('cell navigation', function () {
        it('should move to cell below when pressing "ArrowDown" on a cell on the 1st page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(8, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('9-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('9-1'); // Already on the last row
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to cell below when pressing "ArrowDown" on a cell on the 2nd page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX paginationModel={{ page: 1, pageSize: PAGE_SIZE }}/>).user;
                        cell = (0, helperFn_1.getCell)(18, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('18-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('19-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('19-1'); // Already on the last row
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell below when pressing "ArrowDown" on the checkbox selection cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX checkboxSelection/>).user;
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-0');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('2-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell above when pressing "ArrowUp" on a cell on the 1st page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell above when pressing "ArrowUp" on a cell on the 2nd page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX paginationModel={{ page: 1, pageSize: PAGE_SIZE }}/>).user;
                        cell = (0, helperFn_1.getCell)(11, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('11-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('10-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell right when pressing "ArrowRight" on a cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-2');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-2'); // Already on the last cell
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell right when pressing "ArrowRight" on the checkbox selection cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX checkboxSelection/>).user;
                        cell = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-0');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell left when pressing "ArrowLeft" on a cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-0');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-0'); // Already on the 1st cell
                        return [2 /*return*/];
                }
            });
        }); });
        // This test is not relevant if we can't choose the actual height
        it.skipIf(skipIf_1.isJSDOM)('should move down by the amount of rows visible on screen when pressing "PageDown"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        return [4 /*yield*/, user.keyboard('{PageDown}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal("6-1");
                        return [4 /*yield*/, user.keyboard('{PageDown}')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal("9-1");
                        return [2 /*return*/];
                }
            });
        }); });
        // This test is not relevant if we can't choose the actual height
        it.skipIf(skipIf_1.isJSDOM)('should move down by the amount of rows visible on screen when pressing Space key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal("6-1");
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal("9-1");
                        return [2 /*return*/];
                }
            });
        }); });
        // This test is not relevant if we can't choose the actual height
        it.skipIf(skipIf_1.isJSDOM)('should move up by the amount of rows visible on screen when pressing "PageUp"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(8, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal("3-1");
                        return [2 /*return*/];
                }
            });
        }); });
        // This test is not relevant if we can't choose the actual height
        it.skipIf(skipIf_1.isJSDOM)('should move to the first row before moving to column header when pressing "PageUp"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(3, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('3-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal("0-1", 'should focus first row');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal(null);
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal("1");
                        return [2 /*return*/];
                }
            });
        }); });
        // This test is not relevant if we can't choose the actual height
        it.skipIf(skipIf_1.isJSDOM)('should move to the first row before moving to column header when pressing "PageUp" on page > 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX hideFooter={false}/>).user;
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
                        cell = (0, helperFn_1.getCell)(13, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('13-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal("10-1", 'should focus first row');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'PageUp' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal(null);
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal("1");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should navigate to the 1st cell of the current row when pressing "Home"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(8, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Home' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-0');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Home' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-0'); // Already on the 1st cell
                        return [2 /*return*/];
                }
            });
        }); });
        it('should navigate to the 1st cell of the 1st row when pressing "Home" + ctrlKey of metaKey of shiftKey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(8, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Home', ctrlKey: true });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        if (!!skipIf_1.isJSDOM) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, cell.scrollIntoView()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, user.click(cell)];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Home', metaKey: true });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        if (!!skipIf_1.isJSDOM) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, cell.scrollIntoView()];
                            }); }); })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, user.click(cell)];
                    case 7:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Home', shiftKey: true });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should navigate to the last cell of the current row when pressing "End"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(8, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'End' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-2');
                        internal_test_utils_1.fireEvent.keyDown((0, helperFn_1.getCell)(8, 2), { key: 'End' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-2'); // Already on the last cell
                        return [2 /*return*/];
                }
            });
        }); });
        it('should navigate to the last cell of the last row when pressing "End" + ctrlKey of metaKey of shiftKey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        cell = (0, helperFn_1.getCell)(8, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'End', ctrlKey: true });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('9-2');
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'End', metaKey: true });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('9-2');
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('8-1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'End', shiftKey: true });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('9-2');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('column header navigation', function () {
        // Need layout for column virtualization
        it.skipIf(skipIf_1.isJSDOM)('should scroll horizontally when navigating between column headers with arrows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 60, height: 300 }}>
            <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} {...(0, x_data_grid_generator_1.getBasicGridData)(10, 10)}/>
          </div>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(0).focus()];
                            }); }); })];
                    case 1: return [4 /*yield*/, _a.sent()];
                    case 2:
                        _a.sent();
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        expect(virtualScroller.scrollLeft).to.equal(0);
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        expect(virtualScroller.scrollLeft).not.to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        // Need layout for column virtualization
        it.skipIf(skipIf_1.isJSDOM)('should scroll horizontally when navigating between column headers with arrows even if rows are empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 60, height: 300 }}>
            <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} {...(0, x_data_grid_generator_1.getBasicGridData)(10, 10)} rows={[]}/>
          </div>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(0).focus()];
                            }); }); })];
                    case 1: return [4 /*yield*/, _a.sent()];
                    case 2:
                        _a.sent();
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        expect(virtualScroller.scrollLeft).to.equal(0);
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        expect(virtualScroller.scrollLeft).not.to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the first row when pressing "ArrowDown" on a column header on the 1st page', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<NavigationTestCaseNoScrollX />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(1).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the first row when pressing "ArrowDown" on a column header on the 2nd page', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<NavigationTestCaseNoScrollX paginationModel={{ page: 1, pageSize: PAGE_SIZE }}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(1).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
                        expect((0, helperFn_1.getActiveCell)()).to.equal('10-1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the column header right when pressing "ArrowRight" on a column header', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<NavigationTestCaseNoScrollX />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(1).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('2');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('2');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the column header left when pressing "ArrowLeft" on a column header', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<NavigationTestCaseNoScrollX />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(1).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('0');
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('0');
                        return [2 /*return*/];
                }
            });
        }); });
        // This test is not relevant if we can't choose the actual height
        it.skipIf(skipIf_1.isJSDOM)('should move down by the amount of rows visible on screen when pressing "PageDown"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(1).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('1');
                        return [4 /*yield*/, user.keyboard('{PageDown}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal("5-1");
                        return [2 /*return*/];
                }
            });
        }); });
        // This test is not relevant if we can't choose the actual height
        it.skipIf(skipIf_1.isJSDOM)('should move focus when the focus is on a column header button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, columnMenuButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestCaseNoScrollX />).user;
                        columnMenuButton = (0, helperFn_1.getColumnHeaderCell)(1).querySelector("button[title=\"Sort\"]");
                        // Simulate click on this button
                        return [4 /*yield*/, user.click(columnMenuButton)];
                    case 1:
                        // Simulate click on this button
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, columnMenuButton.focus()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal("0-1");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be able to use keyboard in a columnHeader child input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columns, rows, user, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [
                            {
                                field: 'name',
                                headerName: 'Name',
                                width: 200,
                                renderHeader: function () { return <input type="text" data-testid="custom-input"/>; },
                            },
                        ];
                        rows = [
                            {
                                id: 1,
                                name: 'John',
                            },
                        ];
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
        </div>).user;
                        input = internal_test_utils_1.screen.getByTestId('custom-input');
                        return [4 /*yield*/, user.click(input)];
                    case 1:
                        _a.sent();
                        input.focus();
                        // Verify that the event is not prevented during the bubbling.
                        // fireEvent.keyDown return false if it is the case
                        // For more info, see the related discussion: https://github.com/mui/mui-x/pull/3624#discussion_r787767632
                        expect(internal_test_utils_1.fireEvent.keyDown(input, { key: 'a' })).to.equal(true);
                        expect(internal_test_utils_1.fireEvent.keyDown(input, { key: ' ' })).to.equal(true);
                        expect(internal_test_utils_1.fireEvent.keyDown(input, { key: 'ArrowLeft' })).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('column group header navigation', function () {
        /**
         * Grouping structure
         *
         *                    | prices                                |
         *                    |         | prices234                   |
         * id | currencyPair  | price1M | price2M | price3M | price4M | price5M
         */
        var columnGroupingModel = [
            {
                groupId: 'prices',
                children: [
                    { field: 'price1M' },
                    {
                        groupId: 'prices234',
                        children: [{ field: 'price2M' }, { field: 'price3M' }, { field: 'price4M' }],
                    },
                ],
            },
        ];
        function NavigationTestGroupingCaseNoScrollX(props) {
            var data = (0, x_data_grid_generator_1.getBasicGridData)(10, 10);
            var transformColSizes = function (columns) {
                return columns.map(function (column) { return (__assign(__assign({}, column), { width: 60 })); });
            };
            return (<div style={{ width: 300, height: HEIGHT }}>
          <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} rows={data.rows} columns={transformColSizes(data.columns)} paginationModel={{ pageSize: PAGE_SIZE, page: 0 }} pageSizeOptions={[PAGE_SIZE]} rowBufferPx={PAGE_SIZE * ROW_HEIGHT} rowHeight={ROW_HEIGHT} columnHeaderHeight={HEADER_HEIGHT} hideFooter disableVirtualization columnGroupingModel={columnGroupingModel} experimentalFeatures={{ warnIfFocusStateIsNotSynced: true }} {...props}/>
        </div>);
        }
        // Need layouting for column virtualization
        it.skipIf(skipIf_1.isJSDOM)('should scroll horizontally when navigating between column group headers with arrows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 100, height: 300 }}>
            <x_data_grid_1.DataGrid columnGroupingModel={columnGroupingModel} {...(0, x_data_grid_generator_1.getBasicGridData)(10, 10)}/>
          </div>).user;
                        // Tab to the first column header
                        return [4 /*yield*/, user.keyboard('{Tab}')];
                    case 1:
                        // Tab to the first column header
                        _a.sent();
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        expect(virtualScroller.scrollLeft).to.equal(0);
                        // We then need to move up to the group header, then right to the first named column
                        return [4 /*yield*/, user.keyboard('{ArrowUp}{ArrowUp}{ArrowRight}')];
                    case 2:
                        // We then need to move up to the group header, then right to the first named column
                        _a.sent();
                        expect(virtualScroller.scrollLeft).not.to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        // Need layouting for column virtualization
        it.skipIf(skipIf_1.isJSDOM)('should scroll horizontally when navigating between column headers with arrows even if rows are empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 100, height: 300 }}>
            <x_data_grid_1.DataGrid columnGroupingModel={columnGroupingModel} {...(0, x_data_grid_generator_1.getBasicGridData)(10, 10)} rows={[]}/>
          </div>).user;
                        // Tab to the first column header
                        return [4 /*yield*/, user.keyboard('{Tab}')];
                    case 1:
                        // Tab to the first column header
                        _a.sent();
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        expect(virtualScroller.scrollLeft).to.equal(0);
                        // We then need to move up to the group header, then right to the first named column
                        return [4 /*yield*/, user.keyboard('{ArrowUp}{ArrowUp}{ArrowRight}')];
                    case 2:
                        // We then need to move up to the group header, then right to the first named column
                        _a.sent();
                        expect(virtualScroller.scrollLeft).not.to.equal(0);
                        expect(document.activeElement).toHaveAccessibleName('prices');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the group header below when pressing "ArrowDown" on a column group header', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestGroupingCaseNoScrollX />).user;
                        // Tab to the first column header then move to the first group header on the third column
                        return [4 /*yield*/, user.keyboard('{Tab}{ArrowUp}{ArrowUp}{ArrowRight}')];
                    case 1:
                        // Tab to the first column header then move to the first group header on the third column
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });
                        // Move down to the group header below
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 2:
                        // Move down to the group header below
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 3 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go back to the same group header when pressing "ArrowUp" and "ArrowDown"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestGroupingCaseNoScrollX />).user;
                        // Tab to the first column header then move to the testing group header
                        return [4 /*yield*/, user.keyboard('{Tab}{ArrowUp}{ArrowRight}{ArrowRight}')];
                    case 1:
                        // Tab to the first column header then move to the testing group header
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });
                        return [4 /*yield*/, user.keyboard('{ArrowUp}')];
                    case 2:
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 3:
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to next group header when pressing "ArrowRight"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestGroupingCaseNoScrollX />).user;
                        // Tab to the first column header then move to the testing group header
                        return [4 /*yield*/, user.keyboard('{Tab}{ArrowUp}{ArrowUp}')];
                    case 1:
                        // Tab to the first column header then move to the testing group header
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 1 });
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 7 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to previous group header when pressing "ArrowLeft"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<NavigationTestGroupingCaseNoScrollX />).user;
                        // Tab to the first column header then move to the testing group header
                        return [4 /*yield*/, user.keyboard('{Tab}{ArrowUp}{ArrowUp}{ArrowRight}{ArrowRight}{ArrowRight}')];
                    case 1:
                        // Tab to the first column header then move to the testing group header
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 7 });
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 2:
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 3 });
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 3:
                        _a.sent();
                        expectAriaCoordinate(document.activeElement, { rowIndex: 1, colIndex: 1 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to group header when pressing "ArrowUp" from column header', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<NavigationTestGroupingCaseNoScrollX />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(4, 2).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        // column with field "price3M"
                        expectAriaCoordinate(document.activeElement, { rowIndex: 3, colIndex: 5 });
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
                        // group "prices 234"
                        expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go back to same header when pressing "ArrowUp" and "ArrowDown" from column header', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<NavigationTestGroupingCaseNoScrollX />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (0, helperFn_1.getColumnHeaderCell)(4, 2).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        // column with field "price3M"
                        expectAriaCoordinate(document.activeElement, { rowIndex: 3, colIndex: 5 });
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
                        // group "prices 234"
                        expectAriaCoordinate(document.activeElement, { rowIndex: 2, colIndex: 4 });
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
                        // column with field "price3M"
                        expectAriaCoordinate(document.activeElement, { rowIndex: 3, colIndex: 5 });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should call preventDefault when using keyboard navigation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handleKeyDown, columns, rows, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleKeyDown = (0, sinon_1.spy)(function (event) { return event.defaultPrevented; });
                    columns = [{ field: 'id' }, { field: 'name' }];
                    rows = [{ id: 1, name: 'John' }];
                    user = render(<div style={{ width: 300, height: 300 }} onKeyDown={handleKeyDown}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>).user;
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                case 2:
                    _a.sent();
                    expect(handleKeyDown.returnValues).to.deep.equal([true]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should sort column when pressing enter and column header is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columns, rows, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    columns = [
                        {
                            field: 'id',
                        },
                        {
                            field: 'name',
                        },
                    ];
                    rows = [
                        {
                            id: 1,
                            name: 'John',
                        },
                        {
                            id: 2,
                            name: 'Doe',
                        },
                    ];
                    user = render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>).user;
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                (0, helperFn_1.getColumnHeaderCell)(0).focus();
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getActiveColumnHeader)()).to.equal('0');
                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['John', 'Doe']);
                    return [4 /*yield*/, user.keyboard('{Enter}')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('{Enter}')];
                case 3:
                    _a.sent();
                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Doe', 'John']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should select a row when pressing Space key + shiftKey', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<NavigationTestCaseNoScrollX disableRowSelectionOnClick/>).user;
                    cell = (0, helperFn_1.getCell)(0, 0);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                    internal_test_utils_1.fireEvent.keyDown(cell, { key: ' ', shiftKey: true });
                    row = (0, helperFn_1.getRow)(0);
                    expect(row).to.have.class('Mui-selected');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not rerender when pressing a key inside an already focused cell', function () {
        var renderCell = (0, sinon_1.spy)(function () { return <input type="text" data-testid="custom-input"/>; });
        var columns = [{ field: 'name', renderCell: renderCell }];
        var rows = [{ id: 1, name: 'John' }];
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>);
        expect(renderCell.callCount).to.equal(2);
        var input = internal_test_utils_1.screen.getByTestId('custom-input');
        input.focus();
        internal_test_utils_1.fireEvent.keyDown(input, { key: 'a' });
        expect(renderCell.callCount).to.equal(4);
        internal_test_utils_1.fireEvent.keyDown(input, { key: 'b' });
        expect(renderCell.callCount).to.equal(4);
    });
    it('should not scroll horizontally when cell is wider than viewport', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columns, rows, user, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    columns = [{ field: 'id', width: 400 }, { field: 'name' }];
                    rows = [
                        { id: 1, name: 'John' },
                        { id: 2, name: 'Doe' },
                    ];
                    user = render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>).user;
                    virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                case 1:
                    _a.sent();
                    expect(virtualScroller.scrollLeft).to.equal(0);
                    return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                case 2:
                    _a.sent();
                    expect(virtualScroller.scrollLeft).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should focus actions cell with one disabled item', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columns, rows, user, cell;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    columns = [
                        {
                            field: 'actions',
                            type: 'actions',
                            getActions: function () { return [
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_1'} disabled/>,
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_2'}/>,
                            ]; },
                        },
                        { field: 'id', width: 400 },
                        { field: 'name' },
                    ];
                    rows = [
                        { id: 1, name: 'John' },
                        { id: 2, name: 'Doe' },
                    ];
                    user = render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>).user;
                    cell = (0, helperFn_1.getCell)(0, 1);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                case 2:
                    _b.sent();
                    expect((0, helperFn_1.getActiveCell)()).to.equal("0-0");
                    // expect the only focusable button to be the active element
                    expect((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.id).to.equal('action_2');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should focus actions cell with all items disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columns, rows, user, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    columns = [
                        {
                            field: 'actions',
                            type: 'actions',
                            getActions: function () { return [
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_1'} disabled/>,
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_2'} disabled/>,
                            ]; },
                        },
                        { field: 'id', width: 400 },
                        { field: 'name' },
                    ];
                    rows = [
                        { id: 1, name: 'John' },
                        { id: 2, name: 'Doe' },
                    ];
                    user = render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>).user;
                    cell = (0, helperFn_1.getCell)(0, 1);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _a.sent();
                    internal_test_utils_1.fireEvent.keyDown(cell, { key: 'ArrowLeft' });
                    expect((0, helperFn_1.getActiveCell)()).to.equal("0-0");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to navigate the actions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columns, rows, user, cell;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    columns = [
                        {
                            field: 'actions',
                            type: 'actions',
                            getActions: function () { return [
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_1'} disabled/>,
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_2'}/>,
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_3'} disabled/>,
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_4'} disabled/>,
                                <x_data_grid_1.GridActionsCellItem label="Test" icon={<Restore_1.default />} id={'action_5'}/>,
                            ]; },
                        },
                        { field: 'id', width: 400 },
                        { field: 'name' },
                    ];
                    rows = [
                        { id: 1, name: 'John' },
                        { id: 2, name: 'Doe' },
                    ];
                    user = render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>).user;
                    cell = (0, helperFn_1.getCell)(0, 1);
                    // Parent element is used to avoid the ripple effect triggering act warnings.
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    // Parent element is used to avoid the ripple effect triggering act warnings.
                    _c.sent();
                    return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                case 2:
                    _c.sent();
                    expect((0, helperFn_1.getActiveCell)()).to.equal("0-0");
                    // expect the only focusable button to be the active element
                    expect((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.id).to.equal('action_2');
                    return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                case 3:
                    _c.sent();
                    // expect the only focusable button to be the active element
                    expect((_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.id).to.equal('action_5');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not throw when moving into an empty grid', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columns, rows, user, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    columns = [{ field: 'id', width: 400 }, { field: 'name' }];
                    rows = [];
                    user = render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>).user;
                    cell = (0, helperFn_1.getColumnHeaderCell)(0);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, cell.focus()];
                        }); }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('After pressing the backspace/delete key, the reset value type should match the column type', function () {
        function setupTest(rows, columns, editMode) {
            var valueSetterMock = (0, sinon_1.spy)(function (value, row, column) {
                var _a;
                return __assign(__assign({}, row), (_a = {}, _a[column.field] = value, _a));
            });
            columns.forEach(function (column) {
                column.valueSetter = valueSetterMock;
            });
            var view = render(<x_data_grid_1.DataGrid rows={rows} columns={columns} editMode={editMode} autoHeight/>);
            return __assign({ valueSetterMock: valueSetterMock }, view);
        }
        function testResetValue(_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var columns, rows, _c, valueSetterMock, user, cell;
                var _d;
                var _this = this;
                var editMode = _b.editMode, keyType = _b.keyType, field = _b.field, type = _b.type, value = _b.value;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            columns = [
                                { field: 'id', editable: true },
                                { field: field, editable: true, type: type },
                            ];
                            rows = [(_d = { id: 1 }, _d[field] = value, _d)];
                            _c = setupTest(rows, columns, editMode), valueSetterMock = _c.valueSetterMock, user = _c.user;
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, cell.focus()];
                                }); }); })];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, user.keyboard("{".concat(keyType, "}"))];
                        case 2:
                            _e.sent();
                            return [2 /*return*/, {
                                    cell: cell.textContent,
                                    deletedValue: valueSetterMock.lastCall.args[0],
                                }];
                    }
                });
            });
        }
        var testWithEditmodeAndKeytype = function (_a) {
            var editMode = _a.editMode, keyType = _a.keyType;
            describe("editMode=\"".concat(editMode, "\" and ").concat(keyType, " key"), function () {
                var defaultParams = {
                    editMode: editMode,
                    keyType: keyType,
                    field: 'name',
                    type: 'string',
                    value: 'John Doe',
                };
                it("should reset value for string type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, cell, deletedValue;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, testResetValue(__assign(__assign({}, defaultParams), { keyType: 'Delete', field: 'name', type: 'string', value: 'John Doe' }))];
                            case 1:
                                _a = _b.sent(), cell = _a.cell, deletedValue = _a.deletedValue;
                                expect(cell).to.equal('');
                                expect(deletedValue).to.equal('');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should reset value for number type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, cell, deletedValue;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, testResetValue(__assign(__assign({}, defaultParams), { field: 'age', type: 'number', value: 24 }))];
                            case 1:
                                _a = _b.sent(), cell = _a.cell, deletedValue = _a.deletedValue;
                                expect(cell).to.equal('');
                                expect(deletedValue).to.equal(undefined);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should reset value for date type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, cell, deletedValue;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, testResetValue(__assign(__assign({}, defaultParams), { field: 'birthdate', type: 'date', value: new Date() }))];
                            case 1:
                                _a = _b.sent(), cell = _a.cell, deletedValue = _a.deletedValue;
                                expect(cell).to.equal('');
                                expect(deletedValue).to.equal(undefined);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should reset value dateTime type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, cell, deletedValue;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, testResetValue(__assign(__assign({}, defaultParams), { field: 'appointment', type: 'dateTime', value: new Date() }))];
                            case 1:
                                _a = _b.sent(), cell = _a.cell, deletedValue = _a.deletedValue;
                                expect(cell).to.equal('');
                                expect(deletedValue).to.equal(undefined);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should reset value boolean type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, cell, deletedValue;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, testResetValue(__assign(__assign({}, defaultParams), { field: 'isVerified', type: 'boolean', value: true }))];
                            case 1:
                                _a = _b.sent(), cell = _a.cell, deletedValue = _a.deletedValue;
                                expect(cell).to.equal('');
                                expect(deletedValue).to.equal(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should reset value singleSelect type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, cell, deletedValue;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, testResetValue(__assign(__assign({}, defaultParams), { field: 'status', type: 'singleSelect', value: 'active' }))];
                            case 1:
                                _a = _b.sent(), cell = _a.cell, deletedValue = _a.deletedValue;
                                expect(cell).to.equal('');
                                expect(deletedValue).to.equal(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        };
        testWithEditmodeAndKeytype({ editMode: 'cell', keyType: 'Delete' });
        testWithEditmodeAndKeytype({ editMode: 'cell', keyType: 'Backspace' });
        testWithEditmodeAndKeytype({ editMode: 'row', keyType: 'Delete' });
        testWithEditmodeAndKeytype({ editMode: 'row', keyType: 'Backspace' });
    });
});

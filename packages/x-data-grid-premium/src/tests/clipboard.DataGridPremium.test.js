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
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPremium /> - Clipboard', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function Test(_a) {
        var _b = _a.rowLength, rowLength = _b === void 0 ? 4 : _b, _c = _a.colLength, colLength = _c === void 0 ? 3 : _c, other = __rest(_a, ["rowLength", "colLength"]);
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        var data = React.useMemo(function () {
            var basicData = (0, x_data_grid_generator_1.getBasicGridData)(rowLength, colLength);
            return __assign(__assign({}, basicData), { columns: basicData.columns.map(function (column) {
                    return (__assign(__assign({}, column), { type: 'string', editable: true }));
                }) });
        }, [rowLength, colLength]);
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...data} {...other} apiRef={apiRef} disableRowSelectionOnClick cellSelection disableVirtualization/>
      </div>);
    }
    describe('copy', function () {
        var writeText;
        afterEach(function afterEachHook() {
            writeText === null || writeText === void 0 ? void 0 : writeText.restore();
        });
        ['ctrlKey', 'metaKey'].forEach(function (key) {
            it("should copy the selected cells to the clipboard when ".concat(key, " + C is pressed"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            user = render(<Test />).user;
                            writeText = (0, sinon_1.spy)(navigator.clipboard, 'writeText');
                            cell = (0, helperFn_1.getCell)(0, 0);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _b.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 2), { shiftKey: true });
                            internal_test_utils_1.fireEvent.keyDown(cell, (_a = { key: 'c', keyCode: 67 }, _a[key] = true, _a));
                            expect(writeText.firstCall.args[0]).to.equal([
                                ['0', 'USDGBP', '1'].join('\t'),
                                ['1', 'USDEUR', '11'].join('\t'),
                                ['2', 'GBPEUR', '21'].join('\t'),
                            ].join('\r\n'));
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("should copy cells range selected in one row", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test />).user;
                        writeText = (0, sinon_1.spy)(navigator.clipboard, 'writeText');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 2), { shiftKey: true });
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
                        expect(writeText.firstCall.args[0]).to.equal([['0', 'USDGBP', '1'].join('\t')].join('\r\n'));
                        return [2 /*return*/];
                }
            });
        }); });
        it("should copy cells range selected based on their sorted order", function () { return __awaiter(void 0, void 0, void 0, function () {
            var columns, rows, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [{ field: 'brand' }];
                        rows = [
                            { id: 0, brand: 'Nike' },
                            { id: 1, brand: 'Adidas' },
                            { id: 2, brand: 'Puma' },
                        ];
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_premium_1.DataGridPremium columns={columns} rows={rows} cellSelection sortModel={[{ field: 'brand', sort: 'asc' }]}/>
        </div>).user;
                        writeText = (0, sinon_1.spy)(navigator.clipboard, 'writeText');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Ctrl' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0), { ctrlKey: true });
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Ctrl' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 0), { ctrlKey: true });
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
                        expect(writeText.lastCall.firstArg).to.equal(['Adidas', 'Nike', 'Puma'].join('\r\n'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not escape double quotes when copying multiple cells to clipboard', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_premium_1.DataGridPremium columns={[{ field: 'value' }]} rows={[
                                { id: 0, value: '1 " 1' },
                                { id: 1, value: '2' },
                            ]} cellSelection disableRowSelectionOnClick/>
        </div>).user;
                        writeText = (0, sinon_1.spy)(navigator.clipboard, 'writeText');
                        cell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Ctrl' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0), { ctrlKey: true });
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
                        expect(writeText.lastCall.firstArg).to.equal(['1 " 1', '2'].join('\r\n'));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // These test are flaky in JSDOM
    describe.skipIf(skipIf_1.isJSDOM)('paste', function () {
        function paste(cell, pasteText) {
            var pasteEvent = new Event('paste');
            // @ts-ignore
            pasteEvent.clipboardData = {
                getData: function () { return pasteText; },
            };
            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V
            (0, internal_test_utils_1.act)(function () { return document.activeElement.dispatchEvent(pasteEvent); });
        }
        ['ctrlKey', 'metaKey'].forEach(function (key) {
            it("should not enter cell edit mode when ".concat(key, " + V is pressed"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, listener, cell;
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            user = render(<Test />).user;
                            listener = (0, sinon_1.spy)();
                            (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.subscribeEvent('cellEditStart', listener);
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, user.click(cell)];
                        case 1:
                            _c.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, (_a = { key: 'v', keyCode: 86 }, _a[key] = true, _a)); // Ctrl+V
                            expect(listener.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        ['ctrlKey', 'metaKey'].forEach(function (key) {
            it("should not enter row edit mode when ".concat(key, " + V is pressed"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, listener, cell;
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            user = render(<Test editMode="row"/>).user;
                            listener = (0, sinon_1.spy)();
                            (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.subscribeEvent('rowEditStart', listener);
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, user.click(cell)];
                        case 1:
                            _c.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, (_a = { key: 'v', keyCode: 86 }, _a[key] = true, _a)); // Ctrl+V
                            expect(listener.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('cell selection', function () {
            it('should paste into each cell of the range when single value is pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, clipboardData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test />).user;
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 2), { shiftKey: true });
                            clipboardData = '12';
                            paste(cell, clipboardData);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getCell)(0, 1)).to.have.text(clipboardData);
                                })];
                        case 3:
                            _a.sent();
                            expect((0, helperFn_1.getCell)(0, 2)).to.have.text(clipboardData);
                            expect((0, helperFn_1.getCell)(1, 1)).to.have.text(clipboardData);
                            expect((0, helperFn_1.getCell)(1, 2)).to.have.text(clipboardData);
                            expect((0, helperFn_1.getCell)(2, 1)).to.have.text(clipboardData);
                            expect((0, helperFn_1.getCell)(2, 2)).to.have.text(clipboardData);
                            return [2 /*return*/];
                    }
                });
            }); });
            // Context: https://github.com/mui/mui-x/issues/14233
            it('should paste into cells on the current page when `paginationMode="server"`', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rowLength, _a, setProps, user, clipboardData, cell;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            rowLength = 4;
                            _a = render(<Test rowLength={rowLength} pagination paginationModel={{ pageSize: 2, page: 0 }} paginationMode="server" pageSizeOptions={[2]} rowCount={rowLength} editMode="cell"/>), setProps = _a.setProps, user = _a.user;
                            clipboardData = '12';
                            cell = (0, helperFn_1.getCell)(3, 1);
                            expect(cell).not.to.have.text(clipboardData);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _b.sent();
                            paste(cell, clipboardData);
                            // no update
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getCell)(3, 1)).not.to.have.text(clipboardData);
                                })];
                        case 3:
                            // no update
                            _b.sent();
                            // go to the next page
                            setProps({ paginationModel: { pageSize: 2, page: 1 } });
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 5:
                            _b.sent();
                            paste(cell, clipboardData);
                            // updated
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getCell)(3, 1)).to.have.text(clipboardData);
                                })];
                        case 6:
                            // updated
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not paste values outside of the selected cells range', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, clipboardData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test rowLength={5} colLength={5}/>).user;
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 2), { shiftKey: true });
                            clipboardData = [
                                ['01', '02', '03'],
                                ['11', '12', '13'],
                                ['21', '22', '23'],
                                ['31', '32', '33'],
                                ['41', '42', '43'],
                                ['51', '52', '53'],
                            ]
                                .map(function (row) { return row.join('\t'); })
                                .join('\n');
                            paste(cell, clipboardData);
                            // selected cells should be updated
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getCell)(0, 1)).to.have.text('01');
                                })];
                        case 3:
                            // selected cells should be updated
                            _a.sent();
                            expect((0, helperFn_1.getCell)(0, 2)).to.have.text('02');
                            expect((0, helperFn_1.getCell)(1, 1)).to.have.text('11');
                            expect((0, helperFn_1.getCell)(1, 2)).to.have.text('12');
                            expect((0, helperFn_1.getCell)(2, 1)).to.have.text('21');
                            expect((0, helperFn_1.getCell)(2, 2)).to.have.text('22');
                            // cells out of selection range should not be updated
                            expect((0, helperFn_1.getCell)(0, 3)).not.to.have.text('03');
                            expect((0, helperFn_1.getCell)(3, 1)).not.to.have.text('31');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not paste empty values into cells within selected range when there are no corresponding values in the clipboard', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, clipboardData, secondColumnValuesBeforePaste;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test rowLength={5} colLength={5}/>).user;
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 2), { shiftKey: true });
                            clipboardData = [
                                ['01'], // first row
                                ['11'], // second row
                                ['21'], // third row
                            ]
                                .map(function (row) { return row.join('\t'); })
                                .join('\n');
                            paste(cell, clipboardData);
                            secondColumnValuesBeforePaste = [
                                (0, helperFn_1.getCell)(0, 2).textContent,
                                (0, helperFn_1.getCell)(1, 2).textContent,
                                (0, helperFn_1.getCell)(2, 2).textContent,
                            ];
                            // selected cells should be updated if there's data in the clipboard
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getCell)(0, 1)).to.have.text('01');
                                })];
                        case 3:
                            // selected cells should be updated if there's data in the clipboard
                            _a.sent();
                            expect((0, helperFn_1.getCell)(1, 1)).to.have.text('11');
                            expect((0, helperFn_1.getCell)(2, 1)).to.have.text('21');
                            // selected cells should be updated if there's no data for them in the clipboard
                            expect((0, helperFn_1.getCell)(0, 2)).to.have.text(secondColumnValuesBeforePaste[0]);
                            expect((0, helperFn_1.getCell)(1, 2)).to.have.text(secondColumnValuesBeforePaste[1]);
                            expect((0, helperFn_1.getCell)(2, 2)).to.have.text(secondColumnValuesBeforePaste[2]);
                            return [2 /*return*/];
                    }
                });
            }); });
            // https://github.com/mui/mui-x/issues/9732
            it('should ignore the `pageSize` when pagination is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, clipboardData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test rowLength={8} colLength={4} paginationModel={{ page: 0, pageSize: 5 }} pagination={false}/>).user;
                            cell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            clipboardData = [
                                ['p11', 'p12', 'p13'],
                                ['p21', 'p22', 'p23'],
                                ['p31', 'p32', 'p33'],
                                ['p41', 'p42', 'p43'],
                                ['p51', 'p52', 'p53'],
                                ['p61', 'p62', 'p63'],
                                ['p71', 'p72', 'p73'],
                            ]
                                .map(function (row) { return row.join('\t'); })
                                .join('\n');
                            paste(cell, clipboardData);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getCell)(3, 3).textContent).to.equal('p33');
                                })];
                        case 3:
                            _a.sent();
                            expect((0, helperFn_1.getCell)(6, 2).textContent).to.equal('p62');
                            expect((0, helperFn_1.getCell)(7, 1).textContent).to.equal('p71');
                            expect((0, helperFn_1.getCell)(7, 3).textContent).to.equal('p73');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('row selection', function () {
            it('should paste into each selected row if single row of data is pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, clipboardData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1, 2])}/>).user;
                            cell = (0, helperFn_1.getCell)(2, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            clipboardData = ['p01', 'p02', 'p03'].join('\t');
                            paste(cell, clipboardData);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    // the last row is not selected and should not be updated
                                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['p02', 'p02', 'p02', 'JPYUSD']);
                                })];
                        case 3:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(2)).to.deep.equal(['p03', 'p03', 'p03', '31']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should paste into selected rows if multiple rows of data are pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, clipboardData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1, 2])}/>).user;
                            cell = (0, helperFn_1.getCell)(2, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            clipboardData = [
                                ['p01', 'p02', 'p03'].join('\t'),
                                ['p11', 'p12', 'p13'].join('\t'),
                                ['p21', 'p22', 'p23'].join('\t'),
                                ['p31', 'p32', 'p33'].join('\t'),
                            ].join('\n');
                            paste(cell, clipboardData);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    // the last row is not selected and should not be updated
                                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['p02', 'p12', 'p22', 'JPYUSD']);
                                })];
                        case 3:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(2)).to.deep.equal(['p03', 'p13', 'p23', '31']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ignore row selection when single cell value is pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1, 2])}/>).user;
                            cell = (0, helperFn_1.getCell)(2, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            paste(cell, 'pasted');
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    // should ignore selected rows and paste into selected cell
                                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['USDGBP', 'USDEUR', 'pasted', 'JPYUSD']);
                                })];
                        case 3:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(2)).to.deep.equal(['1', '11', '21', '31']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should paste into selected rows when checkbox selection cell is focused', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, checkboxInput, clipboardData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test checkboxSelection/>).user;
                            checkboxInput = (0, helperFn_1.getCell)(0, 0).querySelector('input');
                            return [4 /*yield*/, user.click(checkboxInput)];
                        case 1:
                            _a.sent();
                            clipboardData = ['p01', 'p02', 'p03'].join('\t');
                            paste(checkboxInput, clipboardData);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    // the first column (id) is not editable and won't be updated
                                    expect((0, helperFn_1.getCell)(0, 2).textContent).to.equal('p02');
                                })];
                        case 2:
                            _a.sent();
                            expect((0, helperFn_1.getCell)(0, 3).textContent).to.equal('p03');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should work well with `getRowId` prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Component() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={columns} rows={rows} getRowId={function (row) { return row.customIdField; }} rowSelection={false} cellSelection/>
          </div>);
            }
            var columns, rows, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [{ field: 'brand', editable: true }];
                        rows = [
                            { customIdField: 0, brand: 'Nike' },
                            { customIdField: 1, brand: 'Adidas' },
                            { customIdField: 2, brand: 'Puma' },
                        ];
                        user = render(<Component />).user;
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        cell = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        paste(cell, 'Nike');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Nike', 'Puma']);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        [
            { key: '\\n', value: '\n' },
            { key: '\\r\\n', value: '\r\n' },
        ].forEach(function (newLine) {
            it("should support ".concat(newLine.key, " new line character"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var user, cell, clipboardData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test />).user;
                            cell = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click(cell)];
                        case 2:
                            _a.sent();
                            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 2), { shiftKey: true });
                            clipboardData = [['p01', 'p02'].join('\t'), ['p11', 'p12'].join('\t')].join(newLine.value);
                            paste(cell, clipboardData);
                            // selected cells should be updated
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getCell)(0, 1)).to.have.text('p01');
                                })];
                        case 3:
                            // selected cells should be updated
                            _a.sent();
                            expect((0, helperFn_1.getCell)(0, 2)).to.have.text('p02');
                            expect((0, helperFn_1.getCell)(1, 1)).to.have.text('p11');
                            expect((0, helperFn_1.getCell)(1, 2)).to.have.text('p12');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should not change row id value', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Component() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={columns} rows={rows} getRowId={function (row) { return row.customIdField; }} rowSelection={false} cellSelection/>
          </div>);
            }
            var columns, rows, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [{ field: 'customIdField' }, { field: 'brand' }];
                        rows = [
                            { customIdField: 0, brand: 'Nike' },
                            { customIdField: 1, brand: 'Adidas' },
                            { customIdField: 2, brand: 'Puma' },
                        ];
                        user = render(<Component />).user;
                        cell = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        paste(cell, '0');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2']);
                            })];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use valueSetter if the column has one', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Component() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={columns} rows={rows} rowSelection={false} processRowUpdate={processRowUpdateSpy}/>
          </div>);
            }
            var processRowUpdateSpy, columns, rows, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        processRowUpdateSpy = (0, sinon_1.spy)(function (newRow) { return newRow; });
                        columns = [
                            { field: 'firstName' },
                            { field: 'lastName' },
                            {
                                field: 'fullName',
                                valueGetter: function (value, row) {
                                    return "".concat(row.firstName, " ").concat(row.lastName);
                                },
                                valueSetter: function (value, row) {
                                    var _a = value.toString().split(' '), firstName = _a[0], lastName = _a[1];
                                    return __assign(__assign({}, row), { firstName: firstName, lastName: lastName });
                                },
                                editable: true,
                            },
                        ];
                        rows = [
                            { id: 0, firstName: 'Jon', lastName: 'Snow' },
                            { id: 1, firstName: 'Cersei', lastName: 'Lannister' },
                        ];
                        user = render(<Component />).user;
                        cell = (0, helperFn_1.getCell)(1, 2);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        paste(cell, 'John Doe');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Jon', 'John']); })];
                    case 3:
                        _a.sent();
                        expect(processRowUpdateSpy.callCount).to.equal(1);
                        expect(processRowUpdateSpy.args[0]).to.deep.equal([
                            { id: 1, firstName: 'John', lastName: 'Doe' },
                            { id: 1, firstName: 'Cersei', lastName: 'Lannister' },
                            { rowId: '1' },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use valueParser if the column has one', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Component() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={columns} rows={rows} rowSelection={false}/>
          </div>);
            }
            var columns, rows, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [
                            {
                                field: 'name',
                                editable: true,
                                valueParser: function (value) {
                                    return String(value)
                                        .split(' ')
                                        .map(function (str) { return (str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''); })
                                        .join(' ');
                                },
                            },
                        ];
                        rows = [
                            { id: 0, name: 'Jon Snow' },
                            { id: 1, name: 'Cersei Lannister' },
                        ];
                        user = render(<Component />).user;
                        cell = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        paste(cell, 'john doe');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Jon Snow', 'John Doe']); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should only paste if the cell is editable', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Component() {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={columns} rows={rows} rowSelection={false} cellSelection disableVirtualization/>
          </div>);
            }
            var rows, columns, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = [
                            { id: 0, brand: 'Nike', category: 'Shoes', price: '$120', rating: '4.0' },
                            { id: 1, brand: 'Adidas', category: 'Sneakers', price: '$100', rating: '4.2' },
                            { id: 2, brand: 'Puma', category: 'Shoes', price: '$90', rating: '4.9' },
                        ];
                        columns = [
                            { field: 'id' },
                            { field: 'brand', editable: true },
                            { field: 'category', editable: true },
                            { field: 'price', editable: false },
                            { field: 'rating', editable: true },
                        ];
                        user = render(<Component />).user;
                        cell = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 4), { shiftKey: true });
                        paste(cell, ['0', 'Nike', 'Shoes', '$120', '4.0'].join('\t'));
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Nike', 'Nike', 'Puma']);
                            })];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(2)).to.deep.equal(['Shoes', 'Shoes', 'Shoes']);
                        expect((0, helperFn_1.getColumnValues)(3)).to.deep.equal(['$120', '$100', '$90']);
                        expect((0, helperFn_1.getColumnValues)(4)).to.deep.equal(['4.0', '4.0', '4.9']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call `processRowUpdate` with each row impacted by the paste', function () { return __awaiter(void 0, void 0, void 0, function () {
            var processRowUpdateSpy, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        processRowUpdateSpy = (0, sinon_1.spy)(function (newRow) {
                            return newRow;
                        });
                        user = render(<Test processRowUpdate={processRowUpdateSpy}/>).user;
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 2), { shiftKey: true });
                        paste(cell, '12');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getCell)(2, 2).textContent).to.equal('12');
                            })];
                    case 3:
                        _a.sent();
                        expect(processRowUpdateSpy.callCount).to.equal(3);
                        expect(processRowUpdateSpy.args).to.deep.equal([
                            [
                                { id: 0, currencyPair: '12', price1M: '12' }, // new row
                                { id: 0, currencyPair: 'USDGBP', price1M: 1 }, // old row
                                { rowId: '0' }, // row id
                            ],
                            [
                                { id: 1, currencyPair: '12', price1M: '12' }, // new row
                                { id: 1, currencyPair: 'USDEUR', price1M: 11 }, // old row
                                { rowId: '1' }, // row id
                            ],
                            [
                                { id: 2, currencyPair: '12', price1M: '12' }, // new row
                                { id: 2, currencyPair: 'GBPEUR', price1M: 21 }, // old row
                                { rowId: '2' }, // row id
                            ],
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use the returned value from `processRowUpdate`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test processRowUpdate={function (newRow) {
                                return __assign(__assign({}, newRow), { currencyPair: '123' });
                            }}/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
                            })];
                    case 1:
                        _a.sent();
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        paste(cell, '12');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['123', 'USDEUR', 'GBPEUR', 'JPYUSD']);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update the row if `processRowUpdate` throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test processRowUpdate={function () {
                                throw new Error();
                            }} onProcessRowUpdateError={function () { }} // suppress error
                        />).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
                            })];
                    case 1:
                        _a.sent();
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        paste(cell, '12');
                        // wait to make sure that the row is not updated
                        return [4 /*yield*/, (0, helperFn_1.sleep)(200)];
                    case 4:
                        // wait to make sure that the row is not updated
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update the row if `processRowUpdate` returns a rejected promise', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test processRowUpdate={function () {
                                return Promise.reject();
                            }} onProcessRowUpdateError={function () { }} // suppress error
                        />).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
                            })];
                    case 1:
                        _a.sent();
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        paste(cell, '12');
                        // wait to make sure that the row is not updated
                        return [4 /*yield*/, (0, helperFn_1.sleep)(200)];
                    case 4:
                        // wait to make sure that the row is not updated
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call `onProcessRowUpdateError` if `processRowUpdate` fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onProcessRowUpdateError, error, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onProcessRowUpdateError = (0, sinon_1.spy)();
                        error = new Error('Something went wrong');
                        user = render(<Test processRowUpdate={function () {
                                throw error;
                            }} onProcessRowUpdateError={onProcessRowUpdateError}/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
                            })];
                    case 1:
                        _a.sent();
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        paste(cell, '12');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(onProcessRowUpdateError.callCount).to.equal(1);
                            })];
                    case 4:
                        _a.sent();
                        expect(onProcessRowUpdateError.args[0][0]).to.equal(error);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should emit clipboard paste events', function () { return __awaiter(void 0, void 0, void 0, function () {
            var calls, onClipboardPasteStartSpy, onClipboardPasteEndSpy, processRowUpdateSpy, user, cell, clipboardData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        calls = [];
                        onClipboardPasteStartSpy = (0, sinon_1.spy)(function () {
                            calls.push('onClipboardPasteStart');
                        });
                        onClipboardPasteEndSpy = (0, sinon_1.spy)(function () {
                            calls.push('onClipboardPasteEnd');
                        });
                        processRowUpdateSpy = (0, sinon_1.spy)(function (newRow) {
                            calls.push('processRowUpdate');
                            return newRow;
                        });
                        user = render(<Test onClipboardPasteStart={onClipboardPasteStartSpy} onClipboardPasteEnd={onClipboardPasteEndSpy} processRowUpdate={processRowUpdateSpy}/>).user;
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 2), { shiftKey: true });
                        clipboardData = '12';
                        paste(cell, clipboardData);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getCell)(0, 2).textContent).to.equal('12');
                            })];
                    case 3:
                        _a.sent();
                        expect(calls).to.deep.equal([
                            'onClipboardPasteStart',
                            'processRowUpdate',
                            'onClipboardPasteEnd',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('should copy and paste cell value', function () {
            var clipboardData = '';
            var writeText = function (data) {
                clipboardData = data;
                return Promise.resolve();
            };
            var writeTextStub;
            var stubClipboard = function () {
                writeTextStub = (0, sinon_1.stub)(navigator.clipboard, 'writeText').callsFake(writeText);
            };
            afterEach(function afterEachHook() {
                writeTextStub.restore();
                clipboardData = '';
            });
            function CopyPasteTest(props) {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium rowSelection={false} ignoreValueFormatterDuringExport {...props}/>
          </div>);
            }
            function copyCell(cell, userEvent) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, userEvent.click(cell)];
                            case 1:
                                _a.sent();
                                internal_test_utils_1.fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function pasteIntoCell(cell, userEvent) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, userEvent.click(cell)];
                            case 2:
                                _a.sent();
                                paste(cell, clipboardData);
                                return [2 /*return*/];
                        }
                    });
                });
            }
            it('column type: string', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rows, columns, user, sourceCell, targetCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rows = [
                                { id: 0, brand: 'Nike' },
                                { id: 1, brand: 'Adidas' },
                            ];
                            columns = [
                                { field: 'id' },
                                { field: 'brand', type: 'string', editable: true },
                            ];
                            user = render(<CopyPasteTest columns={columns} rows={rows}/>).user;
                            // Call after render to override the `@testing-library/user-event` stub
                            stubClipboard();
                            sourceCell = (0, helperFn_1.getCell)(0, 1);
                            targetCell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).not.to.equal(sourceCell.textContent); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, copyCell(sourceCell, user)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, pasteIntoCell(targetCell, user)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).to.equal(sourceCell.textContent); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('column type: number', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rows, columns, user, sourceCell, targetCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rows = [
                                { id: 0, price: 100000 },
                                { id: 1, price: 120000 },
                            ];
                            columns = [
                                { field: 'id' },
                                { field: 'price', type: 'number', editable: true },
                            ];
                            user = render(<CopyPasteTest columns={columns} rows={rows}/>).user;
                            // Call after render to override the `@testing-library/user-event` stub
                            stubClipboard();
                            sourceCell = (0, helperFn_1.getCell)(0, 1);
                            targetCell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).not.to.equal(sourceCell.textContent); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, copyCell(sourceCell, user)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, pasteIntoCell(targetCell, user)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).to.equal(sourceCell.textContent); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('column type: boolean', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rows, columns, user, sourceCell, targetCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rows = [
                                { id: 0, isAdmin: false },
                                { id: 1, isAdmin: true },
                            ];
                            columns = [
                                { field: 'id' },
                                { field: 'isAdmin', type: 'boolean', editable: true },
                            ];
                            user = render(<CopyPasteTest columns={columns} rows={rows}/>).user;
                            // Call after render to override the `@testing-library/user-event` stub
                            stubClipboard();
                            sourceCell = (0, helperFn_1.getCell)(0, 1);
                            targetCell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(targetCell.querySelector('svg').getAttribute('data-value')).not.to.equal(sourceCell.querySelector('svg').getAttribute('data-value'));
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, copyCell(sourceCell, user)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, pasteIntoCell(targetCell, user)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(targetCell.querySelector('svg').getAttribute('data-value')).to.equal(sourceCell.querySelector('svg').getAttribute('data-value'));
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('column type: date', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rows, columns, user, sourceCell, targetCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rows = [
                                { id: 0, date: new Date(2023, 3, 17) },
                                { id: 1, date: new Date(2022, 2, 26) },
                            ];
                            columns = [
                                { field: 'id' },
                                { field: 'date', type: 'date', editable: true },
                            ];
                            user = render(<CopyPasteTest columns={columns} rows={rows}/>).user;
                            // Call after render to override the `@testing-library/user-event` stub
                            stubClipboard();
                            sourceCell = (0, helperFn_1.getCell)(0, 1);
                            targetCell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).not.to.equal(sourceCell.textContent); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, copyCell(sourceCell, user)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, pasteIntoCell(targetCell, user)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).to.equal(sourceCell.textContent); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('column type: dateTime', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rows, columns, user, sourceCell, targetCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rows = [
                                { id: 0, dateTime: new Date(2023, 3, 17, 15, 45) },
                                { id: 1, dateTime: new Date(2022, 2, 26, 9, 12) },
                            ];
                            columns = [
                                { field: 'id' },
                                { field: 'dateTime', type: 'dateTime', editable: true },
                            ];
                            user = render(<CopyPasteTest columns={columns} rows={rows}/>).user;
                            // Call after render to override the `@testing-library/user-event` stub
                            stubClipboard();
                            sourceCell = (0, helperFn_1.getCell)(0, 1);
                            targetCell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).not.to.equal(sourceCell.textContent); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, copyCell(sourceCell, user)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, pasteIntoCell(targetCell, user)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).to.equal(sourceCell.textContent); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('column type: singleSelect', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rows, columns, user, sourceCell, targetCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rows = [
                                { id: 0, value: 'Three' },
                                { id: 1, value: 'One' },
                            ];
                            columns = [
                                { field: 'id' },
                                {
                                    field: 'value',
                                    type: 'singleSelect',
                                    valueOptions: ['One', 'Two', 'Three'],
                                    editable: true,
                                },
                            ];
                            user = render(<CopyPasteTest columns={columns} rows={rows}/>).user;
                            // Call after render to override the `@testing-library/user-event` stub
                            stubClipboard();
                            sourceCell = (0, helperFn_1.getCell)(0, 1);
                            targetCell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).not.to.equal(sourceCell.textContent); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, copyCell(sourceCell, user)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, pasteIntoCell(targetCell, user)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).to.equal(sourceCell.textContent); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('column type: singleSelect advanced', function () { return __awaiter(void 0, void 0, void 0, function () {
                var rows, sizes, columns, user, sourceCell, targetCell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            rows = [
                                { id: 0, size: { size: 'M', sizeNumber: 10 } },
                                { id: 1, size: { size: 'L', sizeNumber: 12 } },
                            ];
                            sizes = [
                                { size: 'S', sizeNumber: 8 },
                                { size: 'M', sizeNumber: 10 },
                                { size: 'L', sizeNumber: 12 },
                            ];
                            columns = [
                                { field: 'id' },
                                {
                                    field: 'size',
                                    type: 'singleSelect',
                                    valueOptions: sizes,
                                    valueGetter: function (value) { return value.size; },
                                    valueSetter: function (value, row) {
                                        var size = sizes.find(function (option) { return option.size === value; });
                                        return __assign(__assign({}, row), { size: size });
                                    },
                                    getOptionValue: function (option) { return option.size; },
                                    getOptionLabel: function (option) { return option.size; },
                                    editable: true,
                                },
                            ];
                            user = render(<CopyPasteTest columns={columns} rows={rows}/>).user;
                            // Call after render to override the `@testing-library/user-event` stub
                            stubClipboard();
                            sourceCell = (0, helperFn_1.getCell)(0, 1);
                            targetCell = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).not.to.equal(sourceCell.textContent); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, copyCell(sourceCell, user)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, pasteIntoCell(targetCell, user)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(targetCell.textContent).to.equal(sourceCell.textContent); })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should use `splitClipboardPastedText` prop to parse the clipboard string', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cellDelimiter, rowDelimiter, splitClipboardText, user, cell, clipboardData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cellDelimiter = ',';
                        rowDelimiter = ';\n';
                        splitClipboardText = function (text) {
                            return text.split(rowDelimiter).map(function (row) { return row.split(cellDelimiter); });
                        };
                        user = render(<Test rowLength={5} colLength={5} splitClipboardPastedText={splitClipboardText}/>).user;
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        internal_test_utils_1.fireEvent.keyDown(cell, { key: 'Shift' });
                        internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 2), { shiftKey: true });
                        clipboardData = [
                            ['01', '02'],
                            ['11', '12'],
                            ['21', '22'],
                        ]
                            .map(function (row) { return row.join(cellDelimiter); })
                            .join(rowDelimiter);
                        paste(cell, clipboardData);
                        // selected cells should be updated
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getCell)(0, 1)).to.have.text('01');
                            })];
                    case 3:
                        // selected cells should be updated
                        _a.sent();
                        expect((0, helperFn_1.getCell)(0, 2)).to.have.text('02');
                        expect((0, helperFn_1.getCell)(1, 1)).to.have.text('11');
                        expect((0, helperFn_1.getCell)(1, 2)).to.have.text('12');
                        expect((0, helperFn_1.getCell)(2, 1)).to.have.text('21');
                        expect((0, helperFn_1.getCell)(2, 2)).to.have.text('22');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove the last line break when pasting', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell, clipboardData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test rowLength={5} colLength={5}/>).user;
                        cell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return cell.focus(); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(cell)];
                    case 2:
                        _a.sent();
                        clipboardData = ['01', '11'].join('\n');
                        // Add newline at the end
                        clipboardData += '\n';
                        paste(cell, clipboardData);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getCell)(0, 1)).to.have.text('01');
                            })];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getCell)(1, 1)).to.have.text('11');
                        // Should not be empty
                        expect((0, helperFn_1.getCell)(2, 1)).to.have.text('GBPEUR');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});

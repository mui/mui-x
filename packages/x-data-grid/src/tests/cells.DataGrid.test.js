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
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Cells', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
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
    };
    describe('cellClassName', function () {
        it('should append the CSS class defined in cellClassName', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand', cellClassName: 'foobar' }]}/>
        </div>);
            expect((0, helperFn_1.getCell)(0, 0)).to.have.class('foobar');
        });
        it('should append the CSS class returned by cellClassName', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand', cellClassName: function () { return 'foobar'; } }]}/>
        </div>);
            expect((0, helperFn_1.getCell)(0, 0)).to.have.class('foobar');
        });
    });
    // Doesn't work with mocked window.getComputedStyle
    describe.skipIf(skipIf_1.isJSDOM)('prop: showCellVerticalBorder', function () {
        function expectRightBorder(element) {
            var computedStyle = window.getComputedStyle(element);
            var color = computedStyle.getPropertyValue('border-right-color');
            var width = computedStyle.getPropertyValue('border-right-width');
            expect(width).to.equal('1px');
            // should not be transparent
            expect(color).not.to.equal('rgba(0, 0, 0, 0)');
        }
        it('should add right border to cells', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'id' }, { field: 'brand' }]} showCellVerticalBorder/>
        </div>);
            expectRightBorder((0, helperFn_1.getCell)(0, 0));
            expectRightBorder((0, helperFn_1.getCell)(1, 0));
            expectRightBorder((0, helperFn_1.getCell)(2, 0));
        });
        // See https://github.com/mui/mui-x/issues/4122
        it('should add right border to cells in the last row', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} autoHeight columns={[{ field: 'id' }, { field: 'brand' }]} showCellVerticalBorder/>
        </div>);
            expectRightBorder((0, helperFn_1.getCell)(2, 0));
        });
    });
    it('should append the CSS class returned by cellClassName', function () {
        render(<div style={{ width: 300, height: 500 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand' }]} getCellClassName={function () { return 'foobar'; }}/>
      </div>);
        expect((0, helperFn_1.getCell)(0, 0)).to.have.class('foobar');
    });
    it('should allow renderCell to return a false-ish value', function () {
        render(<div style={{ width: 300, height: 500 }}>
        <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} columns={[{ field: 'brand', renderCell: function () { return 0; } }]} rows={[{ id: 1, brand: 'Nike' }]}/>
      </div>);
        expect((0, helperFn_1.getCell)(0, 0)).to.have.text('0');
    });
    it('should render nothing in cell when renderCell returns a `null` value', function () {
        render(<div style={{ width: 300, height: 500 }}>
        <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} columns={[{ field: 'brand', renderCell: function () { return null; } }]} rows={[{ id: 1, brand: 'Nike' }]}/>
      </div>);
        expect((0, helperFn_1.getCell)(0, 0)).to.have.text('');
    });
    it('should call the valueFormatter with the correct params', function () {
        var valueFormatter = (0, sinon_1.spy)(function (value) {
            return value ? 'Yes' : 'No';
        });
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid columns={[
                {
                    field: 'isActive',
                    valueFormatter: valueFormatter,
                    width: 200,
                },
            ]} rows={[{ id: 0, isActive: true }]}/>
      </div>);
        expect((0, helperFn_1.getCell)(0, 0)).to.have.text('Yes');
        // expect(valueFormatter.lastCall.args[0]).to.have.keys('id', 'field', 'value', 'api');
        expect(valueFormatter.lastCall.args[0]).to.equal(true);
        expect(valueFormatter.lastCall.args[1]).to.deep.equal({ id: 0, isActive: true });
        expect(valueFormatter.lastCall.args[2].field).to.equal('isActive');
    });
    it('should throw when focusing cell without updating the state', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            render(<div style={{ width: 300, height: 500 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand', cellClassName: 'foobar' }]} experimentalFeatures={{ warnIfFocusStateIsNotSynced: true }}/>
      </div>);
            expect(function () {
                (0, helperFn_1.getCell)(1, 0).focus();
            }).toWarnDev(['MUI X: The cell with id=1 and field=brand received focus.']);
            return [2 /*return*/];
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should keep the focused cell/row rendered in the DOM if it scrolls outside the viewport', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rowHeight, defaultData, user, virtualScroller, cell, activeElementTextContent, columnWidth, tenRows, tenColumns;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    rowHeight = 50;
                    defaultData = (0, x_data_grid_generator_1.getBasicGridData)(20, 20);
                    user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={defaultData.columns} rows={defaultData.rows} rowHeight={rowHeight}/>
        </div>).user;
                    virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                    cell = (0, helperFn_1.getCell)(1, 3);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _d.sent();
                    activeElementTextContent = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.textContent;
                    columnWidth = document.activeElement.clientWidth;
                    tenRows = 10 * rowHeight;
                    internal_test_utils_1.fireEvent.scroll(virtualScroller, { target: { scrollTop: tenRows } });
                    expect((_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.textContent).to.equal(activeElementTextContent);
                    tenColumns = 10 * columnWidth;
                    internal_test_utils_1.fireEvent.scroll(virtualScroller, { target: { scrollLeft: tenColumns } });
                    expect((_c = document.activeElement) === null || _c === void 0 ? void 0 : _c.textContent).to.equal(activeElementTextContent);
                    return [2 /*return*/];
            }
        });
    }); });
    // See https://github.com/mui/mui-x/issues/6378
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not cause scroll jump when focused cell mounts in the render zone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rowHeight, columns, rows, i, user, virtualScroller, thirdRowCell, sixRows, twoRows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowHeight = 50;
                    columns = [{ field: 'id' }];
                    rows = [];
                    for (i = 0; i < 20; i += 1) {
                        rows.push({ id: i });
                    }
                    user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={columns} rows={rows} rowHeight={rowHeight}/>
        </div>).user;
                    virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                    thirdRowCell = (0, helperFn_1.getCell)(2, 0);
                    return [4 /*yield*/, user.click(thirdRowCell)];
                case 1:
                    _a.sent();
                    sixRows = 6 * rowHeight;
                    internal_test_utils_1.fireEvent.scroll(virtualScroller, { target: { scrollTop: sixRows } });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(virtualScroller.scrollTop).to.equal(300);
                        })];
                case 2:
                    _a.sent();
                    twoRows = 2 * rowHeight;
                    internal_test_utils_1.fireEvent.scroll(virtualScroller, { target: { scrollTop: twoRows } });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(virtualScroller.scrollTop).to.equal(twoRows);
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});

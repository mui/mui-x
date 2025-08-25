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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Columns', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
        rows: [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
        ],
        columns: [{ field: 'brand' }],
    };
    function Test(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        var _a = props.width, width = _a === void 0 ? 300 : _a, _b = props.height, height = _b === void 0 ? 500 : _b, otherProps = __rest(props, ["width", "height"]);
        return (<div style={{ width: width, height: height }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} {...otherProps}/>
      </div>);
    }
    describe('showColumnMenu', function () {
        it('should open the column menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test />);
                        expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('brand'); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the correct id and aria-labelledby', function () { return __awaiter(void 0, void 0, void 0, function () {
            var menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test />);
                        expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('brand'); })];
                    case 1:
                        _a.sent();
                        menu = internal_test_utils_1.screen.getByRole('menu');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(menu.id).to.match(/[«|:]r[0-9a-z]+[»|:]/);
                            })];
                    case 2:
                        _a.sent();
                        expect(menu.getAttribute('aria-labelledby')).to.match(/[«|:]r[0-9a-z]+[»|:]/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('toggleColumnMenu', function () {
        it('should toggle the column menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test />);
                        expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.toggleColumnMenu('brand'); });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                            })];
                    case 1:
                        _a.sent();
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.toggleColumnMenu('brand'); });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Need layouting
    describe.skipIf(skipIf_1.isJSDOM)('resizing', function () {
        var columns = [{ field: 'brand', width: 100 }];
        it('should allow to resize columns with the mouse', function () {
            render(<Test columns={columns}/>);
            var separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
            internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
            internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
            internal_test_utils_1.fireEvent.mouseUp(separator);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '110px' });
            expect((0, helperFn_1.getCell)(1, 0).getBoundingClientRect().width).to.equal(110);
        });
        // Only run in supported browsers
        it.skipIf(typeof Touch === 'undefined')('should allow to resize columns with the touch', function () {
            render(<Test columns={columns}/>);
            var separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
            var now = Date.now();
            internal_test_utils_1.fireEvent.touchStart(separator, {
                changedTouches: [new Touch({ identifier: now, target: separator, clientX: 100 })],
            });
            internal_test_utils_1.fireEvent.touchMove(separator, {
                changedTouches: [new Touch({ identifier: now, target: separator, clientX: 110 })],
            });
            internal_test_utils_1.fireEvent.touchEnd(separator, {
                changedTouches: [new Touch({ identifier: now, target: separator, clientX: 110 })],
            });
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '110px' });
            expect((0, helperFn_1.getCell)(1, 0).getBoundingClientRect().width).to.equal(110);
        });
        it('should call onColumnResize during resizing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnResize, user, separator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnResize = (0, sinon_1.spy)();
                        user = render(<Test onColumnResize={onColumnResize} columns={columns}/>).user;
                        separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                        return [4 /*yield*/, user.pointer([
                                { keys: '[MouseLeft>]', target: separator, coords: { x: 100 } },
                                { target: separator, coords: { x: 110 } },
                                { target: separator, coords: { x: 120 } },
                                { keys: '[/MouseLeft]', target: separator, coords: { x: 120 } },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onColumnResize.callCount).to.equal(2);
                        expect(onColumnResize.args[0][0].width).to.equal(110);
                        expect(onColumnResize.args[1][0].width).to.equal(120);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onColumnWidthChange after resizing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnWidthChange, user, separator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnWidthChange = (0, sinon_1.spy)();
                        user = render(<Test onColumnWidthChange={onColumnWidthChange} columns={columns}/>).user;
                        separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                        expect(onColumnWidthChange.callCount).to.equal(0);
                        return [4 /*yield*/, user.pointer([
                                { keys: '[MouseLeft>]', target: separator, coords: { x: 100 } },
                                { target: separator, coords: { x: 120 } },
                                { keys: '[/MouseLeft]', target: separator, coords: { x: 120 } },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onColumnWidthChange.callCount).to.equal(1);
                        expect(onColumnWidthChange.args[0][0].width).to.equal(120);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onColumnWidthChange with correct width after resizing and then clicking the separator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnWidthChange, user, separator, widthArgs, isWidth120Present, colDefWidthArgs, isColDefWidth120Present;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnWidthChange = (0, sinon_1.spy)();
                        user = render(<Test onColumnWidthChange={onColumnWidthChange} columns={columns}/>).user;
                        separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                        expect(onColumnWidthChange.callCount).to.equal(0);
                        return [4 /*yield*/, user.pointer([
                                { keys: '[MouseLeft>]', target: separator, coords: { x: 100 } },
                                { target: separator, coords: { x: 120 } },
                                { keys: '[/MouseLeft]', target: separator, coords: { x: 120 } },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onColumnWidthChange.callCount).to.equal(1);
                        expect(onColumnWidthChange.args[0][0].width).to.equal(120);
                        return [4 /*yield*/, user.dblClick(separator)];
                    case 2:
                        _a.sent();
                        expect(onColumnWidthChange.callCount).to.be.at.least(2);
                        widthArgs = onColumnWidthChange.args.map(function (arg) { return arg[0].width; });
                        isWidth120Present = widthArgs.some(function (width) { return width === 120; });
                        expect(isWidth120Present).to.equal(true);
                        colDefWidthArgs = onColumnWidthChange.args.map(function (arg) { return arg[0].colDef.width; });
                        isColDefWidth120Present = colDefWidthArgs.some(function (width) { return width === 120; });
                        expect(isColDefWidth120Present).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not affect other cell elements that are not part of the main DataGrid instance', function () {
            render(<Test rows={baselineProps.rows.slice(0, 1)} columns={[
                    {
                        field: 'brand',
                        width: 100,
                        renderCell: function (_a) {
                            var id = _a.id;
                            return (<div className={x_data_grid_pro_1.gridClasses.row} data-id={id} data-testid="dummy-row">
                  <div data-colindex={0} style={{ width: 90 }}/>
                </div>);
                        },
                    },
                ]}/>);
            var separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
            internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
            internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
            internal_test_utils_1.fireEvent.mouseUp(separator);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '110px' });
            expect((0, helperFn_1.getCell)(0, 0).getBoundingClientRect().width).to.equal(110);
            expect(internal_test_utils_1.screen.getByTestId('dummy-row').firstElementChild).toHaveInlineStyle({
                width: '90px',
            });
        });
        it('should work with pinned rows', function () {
            render(<Test {...baselineProps} pinnedRows={{
                    top: [{ id: 'top-0', brand: 'Reebok' }],
                    bottom: [{ id: 'bottom-0', brand: 'Asics' }],
                }}/>);
            var separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
            var nonPinnedCell = (0, helperFn_1.getCell)(1, 0);
            var columnHeaderCell = (0, helperFn_1.getColumnHeaderCell)(0);
            var topPinnedRowCell = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['pinnedRows--top'], " [role=\"gridcell\"][data-colindex=\"0\"]"));
            var bottomPinnedRowCell = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['pinnedRows--bottom'], " [role=\"gridcell\"][data-colindex=\"0\"]"));
            internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
            internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
            expect(columnHeaderCell.getBoundingClientRect().width).to.equal(150);
            expect(nonPinnedCell.getBoundingClientRect().width).to.equal(150);
            expect(topPinnedRowCell === null || topPinnedRowCell === void 0 ? void 0 : topPinnedRowCell.getBoundingClientRect().width).to.equal(150);
            expect(bottomPinnedRowCell === null || bottomPinnedRowCell === void 0 ? void 0 : bottomPinnedRowCell.getBoundingClientRect().width).to.equal(150);
            internal_test_utils_1.fireEvent.mouseUp(separator);
            expect(columnHeaderCell.getBoundingClientRect().width).to.equal(150);
            expect(nonPinnedCell.getBoundingClientRect().width).to.equal(150);
            expect(topPinnedRowCell === null || topPinnedRowCell === void 0 ? void 0 : topPinnedRowCell.getBoundingClientRect().width).to.equal(150);
            expect(bottomPinnedRowCell === null || bottomPinnedRowCell === void 0 ? void 0 : bottomPinnedRowCell.getBoundingClientRect().width).to.equal(150);
        });
        // https://github.com/mui/mui-x/issues/12852
        it('should work with right pinned column', function () {
            render(<Test columns={[
                    { field: 'id', width: 100 },
                    { field: 'brand', width: 100 },
                ]} initialState={{ pinnedColumns: { right: ['brand'] } }}/>);
            var pinnedHeaderCell = (0, helperFn_1.getColumnHeaderCell)(1);
            var pinnedCell = (0, helperFn_1.getCell)(1, 1);
            var pinnedSeparator = pinnedHeaderCell.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
            var pinnedRightPosition = pinnedHeaderCell.getBoundingClientRect().right;
            // resize right pinned column to the right
            internal_test_utils_1.fireEvent.mouseDown(pinnedSeparator, { clientX: 100 });
            internal_test_utils_1.fireEvent.mouseMove(pinnedSeparator, { clientX: 150, buttons: 1 });
            // check that the right pinned column has shrunk and is in the same position
            expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(50);
            expect(pinnedCell.getBoundingClientRect().width).to.equal(50);
            expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);
            // release the mouse and check that the right pinned column is still in the same position
            internal_test_utils_1.fireEvent.mouseUp(pinnedSeparator);
            expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(50);
            expect(pinnedCell.getBoundingClientRect().width).to.equal(50);
            expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);
            // resize the right pinned column to the left
            internal_test_utils_1.fireEvent.mouseDown(pinnedSeparator, { clientX: 150 });
            internal_test_utils_1.fireEvent.mouseMove(pinnedSeparator, { clientX: 50, buttons: 1 });
            // check that the right pinned column has grown and is in the same position
            expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(150);
            expect(pinnedCell.getBoundingClientRect().width).to.equal(150);
            expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);
            // release the mouse and check that the right pinned column is still in the same position
            internal_test_utils_1.fireEvent.mouseUp(pinnedSeparator);
            expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(150);
            expect(pinnedCell.getBoundingClientRect().width).to.equal(150);
            expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);
        });
        // https://github.com/mui/mui-x/issues/15755
        it('should keep right-pinned column group aligned with its pinned children', function () {
            render(<Test rows={[
                    { id: 1, brand: 'Nike', category: 'Shoes' },
                    { id: 2, brand: 'Adidas', category: 'Shoes' },
                    { id: 3, brand: 'Puma', category: 'Shoes' },
                ]} columns={[
                    { field: 'id', width: 50 },
                    { field: 'brand', width: 50 },
                    { field: 'category', width: 50 },
                ]} initialState={{ pinnedColumns: { right: ['brand', 'category'] } }} columnGroupingModel={[
                    {
                        groupId: 'group1',
                        children: [{ field: 'brand' }, { field: 'category' }],
                    },
                ]}/>);
            var lastColumnSeparator = document.querySelector("[role=\"columnheader\"][data-field=\"category\"] .".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
            // resize the last column to the left
            internal_test_utils_1.fireEvent.mouseDown(lastColumnSeparator, { clientX: 150 });
            internal_test_utils_1.fireEvent.mouseMove(lastColumnSeparator, { clientX: 100, buttons: 1 });
            var rightPinnedColumns = [
                document.querySelector('[role="columnheader"][data-field="brand"]'),
                document.querySelector('[role="columnheader"][data-field="category"]'),
            ];
            var rightPinnedHeadersTotalWidth = rightPinnedColumns.reduce(function (acc, column) { return acc + column.offsetWidth; }, 0);
            var rightPinnedColumnGroup = document.querySelector('[role="columnheader"][data-fields="|-brand-|-category-|"]');
            expect(rightPinnedColumnGroup.offsetWidth).to.equal(rightPinnedHeadersTotalWidth, 'offsetWidth');
            expect(rightPinnedColumnGroup.offsetLeft).to.equal(rightPinnedColumns[0].offsetLeft, 'offsetLeft');
        });
        // https://github.com/mui/mui-x/issues/13548
        it('should fill remaining horizontal space in a row with an empty cell', function () {
            render(<Test columns={[{ field: 'id', width: 100 }]}/>);
            var row = (0, helperFn_1.getRow)(0);
            var rowWidth = row.getBoundingClientRect().width;
            var headerCell = (0, helperFn_1.getColumnHeaderCell)(0);
            var separator = headerCell.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
            var emptyCell = row.querySelector(".".concat(x_data_grid_pro_1.gridClasses.cellEmpty));
            // check that empty cell takes up the remaining width in a row
            expect(emptyCell.getBoundingClientRect().width).to.equal(rowWidth - 100);
            // check that empty cell takes up the remaining width when the column is resized
            internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
            internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 50, buttons: 1 });
            expect(emptyCell.getBoundingClientRect().width).to.equal(rowWidth - 50);
            // release the mouse and check that the empty cell still takes up the remaining width
            internal_test_utils_1.fireEvent.mouseUp(separator);
            expect(emptyCell.getBoundingClientRect().width).to.equal(rowWidth - 50);
        });
        // Need layouting
        describe.skipIf(skipIf_1.isJSDOM)('flex resizing', function () {
            it('should resize the flex width after resizing another column with api', function () {
                var twoColumns = [
                    { field: 'id', width: 100, flex: 1 },
                    { field: 'brand', width: 100 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '198px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '100px' });
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnWidth('brand', 150); });
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '148px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should resize the flex width after resizing a column with the separator', function () {
                var twoColumns = [
                    { field: 'id', width: 100, flex: 1 },
                    { field: 'brand', width: 100 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '198px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '100px' });
                var separator = (0, helperFn_1.getColumnHeaderCell)(1).querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
                internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
                internal_test_utils_1.fireEvent.mouseUp(separator);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '148px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should not resize a flex column under its minWidth property (api resize)', function () {
                var twoColumns = [
                    { field: 'id', minWidth: 175, flex: 1 },
                    { field: 'brand', width: 100 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '198px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '100px' });
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnWidth('brand', 150); });
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '175px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should not resize a flex column above its maxWidth property (api resize)', function () {
                var twoColumns = [
                    { field: 'id', maxWidth: 125, flex: 1 },
                    { field: 'brand', width: 200 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '98px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '200px' });
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnWidth('brand', 150); });
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '125px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should not resize a flex column under its minWidth property (separator resize)', function () {
                var twoColumns = [
                    { field: 'id', minWidth: 175, flex: 1 },
                    { field: 'brand', width: 100 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '198px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '100px' });
                var separator = (0, helperFn_1.getColumnHeaderCell)(1).querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
                internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
                internal_test_utils_1.fireEvent.mouseUp(separator);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '175px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should not resize a flex column above its maxWidth property (separator resize)', function () {
                var twoColumns = [
                    { field: 'id', maxWidth: 125, flex: 1 },
                    { field: 'brand', width: 200 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '98px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '200px' });
                var separator = (0, helperFn_1.getColumnHeaderCell)(1).querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
                internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 50, buttons: 1 });
                internal_test_utils_1.fireEvent.mouseUp(separator);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '125px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should be able to resize a flex column under its width property (api resize)', function () {
                var twoColumns = [
                    { field: 'id', width: 175, flex: 1 },
                    { field: 'brand', width: 100 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '198px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '100px' });
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnWidth('brand', 150); });
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '148px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should be able to resize a flex column under its width property (separator resize)', function () {
                var twoColumns = [
                    { field: 'id', width: 175, flex: 1 },
                    { field: 'brand', width: 100 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '198px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '100px' });
                var separator = (0, helperFn_1.getColumnHeaderCell)(1).querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
                internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
                internal_test_utils_1.fireEvent.mouseUp(separator);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '148px' });
                expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '150px' });
            });
            it('should be able to resize a column with flex twice (separator resize)', function () {
                var twoColumns = [
                    { field: 'id', flex: 1 },
                    { field: 'brand', width: 100 },
                ];
                render(<Test columns={twoColumns}/>);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '198px' });
                var separator = (0, helperFn_1.getColumnHeaderCell)(0).querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 200 });
                internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 100, buttons: 1 });
                internal_test_utils_1.fireEvent.mouseUp(separator);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '98px' });
                internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
                internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
                internal_test_utils_1.fireEvent.mouseUp(separator);
                expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '148px' });
            });
        });
    });
    // Need layouting
    describe.skipIf(skipIf_1.isJSDOM)('autosizing', function () {
        var rows = [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
            { id: 3, brand: 'Lululemon Athletica' },
        ];
        var columns = [
            { field: 'id', headerName: 'This is the ID column' },
            { field: 'brand', headerName: 'This is the brand column' },
        ];
        var getWidths = function () {
            return columns.map(function (_, i) { return parseInt((0, helperFn_1.getColumnHeaderCell)(i).style.width, 10); });
        };
        it('should work through the API', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test rows={rows} columns={columns}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.autosizeColumns()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(getWidths()).to.deep.equal([152, 174]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work through double-clicking the separator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, separator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test rows={rows} columns={columns}/>).user;
                        separator = document.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']))[1];
                        return [4 /*yield*/, user.dblClick(separator)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getWidths()).to.deep.equal([100, 174]);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work on mount', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test rows={rows} columns={columns} autosizeOnMount/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getWidths()).to.deep.equal([152, 174]);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work with flex columns', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, separators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test rows={rows} columns={[
                                { field: 'id', flex: 1 },
                                { field: 'brand', flex: 2 },
                            ]}/>).user;
                        separators = document.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                        return [4 /*yield*/, user.dblClick(separators[0])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(columns.map(function (_, i) { return (0, helperFn_1.getColumnHeaderCell)(i).offsetWidth; })).to.deep.equal([50, 248]);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.dblClick(separators[1])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(columns.map(function (_, i) { return (0, helperFn_1.getColumnHeaderCell)(i).offsetWidth; })).to.deep.equal([50, 63]);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('options', function () {
            var autosize = function (options, widths) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<Test rows={rows} columns={columns}/>);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.autosizeColumns(__assign({ includeHeaders: false }, options))];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(getWidths()).to.deep.equal(widths);
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            it('.columns works', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, autosize({ columns: [columns[0].field] }, [50, 100])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('.includeHeaders works', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, autosize({ includeHeaders: true }, [152, 174])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('.includeOutliers works', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, autosize({ includeOutliers: true }, [50, 141])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('.outliersFactor works', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, autosize({ outliersFactor: 40 }, [50, 141])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('.expand works', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // These values are tuned to Ubuntu/Chromium and might be flaky in other environments
                        return [4 /*yield*/, autosize({ expand: true }, [142, 155])];
                        case 1:
                            // These values are tuned to Ubuntu/Chromium and might be flaky in other environments
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('column pipe processing', function () {
        it('should not loose column width when re-applying pipe processing', function () {
            var privateApi;
            function Footer() {
                privateApi = (0, internals_1.useGridPrivateApiContext)();
                return null;
            }
            render(<Test checkboxSelection slots={{ footer: Footer }}/>);
            if (apiRef.current === null) {
                throw new Error('apiRef is not defined');
            }
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnWidth('brand', 300); });
            expect((0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef).brand.computedWidth).to.equal(300);
            // @ts-ignore
            (0, internal_test_utils_1.act)(function () { return privateApi.current.requestPipeProcessorsApplication('hydrateColumns'); });
            expect((0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef).brand.computedWidth).to.equal(300);
        });
        it('should not loose column index when re-applying pipe processing', function () {
            var privateApi;
            function Footer() {
                privateApi = (0, internals_1.useGridPrivateApiContext)();
                return null;
            }
            render(<Test checkboxSelection columns={[{ field: 'id' }, { field: 'brand' }]} slots={{ footer: Footer }}/>);
            expect((0, x_data_grid_pro_1.gridColumnFieldsSelector)(apiRef).indexOf('brand')).to.equal(2);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnIndex('brand', 1); });
            expect((0, x_data_grid_pro_1.gridColumnFieldsSelector)(apiRef).indexOf('brand')).to.equal(1);
            // @ts-ignore
            (0, internal_test_utils_1.act)(function () { return privateApi.current.requestPipeProcessorsApplication('hydrateColumns'); });
            expect((0, x_data_grid_pro_1.gridColumnFieldsSelector)(apiRef).indexOf('brand')).to.equal(1);
        });
        it('should not loose imperatively added columns when re-applying pipe processing', function () {
            var privateApi;
            function Footer() {
                privateApi = (0, internals_1.useGridPrivateApiContext)();
                return null;
            }
            render(<Test checkboxSelection slots={{ footer: Footer }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([{ field: 'id' }]); });
            expect((0, x_data_grid_pro_1.gridColumnFieldsSelector)(apiRef)).to.deep.equal(['__check__', 'brand', 'id']);
            // @ts-ignore
            (0, internal_test_utils_1.act)(function () { return privateApi.current.requestPipeProcessorsApplication('hydrateColumns'); });
            expect((0, x_data_grid_pro_1.gridColumnFieldsSelector)(apiRef)).to.deep.equal(['__check__', 'brand', 'id']);
        });
    });
    describe.skipIf(skipIf_1.isJSDOM)('flex columns with pinned columns', function () {
        it('should maintain correct widths and positions when flex columns are set', function () {
            render(<Test columns={[
                    { field: 'name', headerName: 'Name', flex: 1, minWidth: 100, editable: true },
                    { field: 'email', headerName: 'Email', width: 200, editable: true },
                ]} initialState={{ pinnedColumns: { left: ['name'] } }}/>);
            var firstColumn = (0, helperFn_1.getColumnHeaderCell)(0);
            expect(firstColumn.offsetWidth).to.equal(100);
            var secondColumn = (0, helperFn_1.getColumnHeaderCell)(1);
            expect(secondColumn.offsetWidth).to.equal(200);
        });
        it('should grow flex column beyond minWidth when space is available', function () {
            var columns = [
                { field: 'name', headerName: 'Name', flex: 1, minWidth: 200, editable: true },
                { field: 'email', headerName: 'Email', width: 200, editable: true },
            ];
            render(<Test width={600} columns={columns} initialState={{ pinnedColumns: { left: ['name'] } }} disableVirtualization/>);
            var firstColumn = (0, helperFn_1.getColumnHeaderCell)(0);
            var secondColumn = (0, helperFn_1.getColumnHeaderCell)(1);
            expect(firstColumn.offsetWidth).to.equal(398);
            expect(secondColumn.offsetWidth).to.equal(200);
        });
    });
});

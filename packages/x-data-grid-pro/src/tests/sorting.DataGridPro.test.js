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
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
var vitest_1 = require("vitest");
describe('<DataGridPro /> - Sorting', function () {
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
        rows: [
            {
                id: 0,
                brand: 'Nike',
                year: '1940',
            },
            {
                id: 1,
                brand: 'Adidas',
                year: '1940',
            },
            {
                id: 2,
                brand: 'Puma',
                year: '1950',
            },
        ],
        columns: [{ field: 'brand' }, { field: 'year', type: 'number' }],
    };
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestCase(props) {
        var rows = props.rows, other = __rest(props, ["rows"]);
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} rows={props.rows || baselineProps.rows} {...other}/>
      </div>);
    }
    var renderBrandSortedAsc = function () {
        var sortModel = [{ field: 'brand', sort: 'asc' }];
        render(<TestCase sortModel={sortModel}/>);
    };
    it('should apply the sortModel prop correctly', function () {
        renderBrandSortedAsc();
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    });
    it('should apply the sortModel prop correctly on GridApiRef setRows', function () {
        renderBrandSortedAsc();
        var newRows = [
            {
                id: 3,
                brand: 'Asics',
            },
            {
                id: 4,
                brand: 'RedBull',
            },
            {
                id: 5,
                brand: 'Hugo',
            },
        ];
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows(newRows); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics', 'Hugo', 'RedBull']);
    });
    it('should apply the sortModel prop correctly on GridApiRef update row data', function () {
        renderBrandSortedAsc();
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }]); });
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Patagonia' }]); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Fila', 'Patagonia', 'Puma']);
    });
    it('should allow apiRef to setSortModel', function () {
        render(<TestCase />);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel([{ field: 'brand', sort: 'desc' }]); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
    });
    it('should allow multiple sort columns and', function () {
        var sortModel = [
            { field: 'year', sort: 'desc' },
            { field: 'brand', sort: 'asc' },
        ];
        render(<TestCase sortModel={sortModel}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Adidas', 'Nike']);
    });
    it('should allow to set multiple Sort items via apiRef', function () {
        render(<TestCase />);
        var sortModel = [
            { field: 'year', sort: 'desc' },
            { field: 'brand', sort: 'asc' },
        ];
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel(sortModel); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Adidas', 'Nike']);
    });
    describe('multi-sorting', function () {
        ['shiftKey', 'metaKey', 'ctrlKey'].forEach(function (key) {
            it("should do a multi-sorting when clicking the header cell while ".concat(key, " is pressed"), function () {
                var _a;
                render(<TestCase />);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel([{ field: 'year', sort: 'desc' }]); });
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
                internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0), (_a = {}, _a[key] = true, _a));
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Adidas', 'Nike']);
            });
        });
        ['metaKey', 'ctrlKey'].forEach(function (key) {
            it("should do nothing when pressing Enter while ".concat(key, " is pressed"), function () {
                var _a;
                render(<TestCase />);
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel([{ field: 'year', sort: 'desc' }]); });
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
                (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.getColumnHeaderCell)(1).focus(); });
                internal_test_utils_1.fireEvent.keyDown((0, helperFn_1.getColumnHeaderCell)(1), (_a = { key: 'Enter' }, _a[key] = true, _a));
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
            });
        });
        it('should do a multi-sorting pressing Enter while shiftKey is pressed', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel([{ field: 'year', sort: 'desc' }]); });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
            (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.getColumnHeaderCell)(0).focus(); });
            internal_test_utils_1.fireEvent.keyDown((0, helperFn_1.getColumnHeaderCell)(0), { key: 'Enter', shiftKey: true });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Adidas', 'Nike']);
        });
        it("should not do a multi-sorting if no multiple key is pressed", function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel([{ field: 'year', sort: 'desc' }]); });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        });
        it('should not do a multi-sorting if disableMultipleColumnsSorting is true', function () {
            render(<TestCase disableMultipleColumnsSorting/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel([{ field: 'year', sort: 'desc' }]); });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0), { shiftKey: true });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        });
        it('should do multi-sorting when using column menu with multipleColumnsSortingMode="always"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var brandColumnCell, menuIconButton, sortModel;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vitest_1.vi.useFakeTimers();
                        render(<TestCase multipleColumnsSortingMode="always"/>);
                        // Set initial sort on year column
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setSortModel([{ field: 'year', sort: 'desc' }]); });
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
                        brandColumnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = brandColumnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        // Wait for menu to appear
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return vitest_1.vi.runAllTimersAsync(); })];
                    case 1:
                        // Wait for menu to appear
                        _b.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        // Click Sort by ASC
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Sort by ASC' }));
                        // Should have both year (desc) and brand (asc) in sort model
                        // Expected order: first by year desc (1950 before 1940), then by brand asc within same year
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Adidas', 'Nike']);
                        sortModel = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSortModel();
                        expect(sortModel).to.deep.equal([
                            { field: 'year', sort: 'desc' },
                            { field: 'brand', sort: 'asc' },
                        ]);
                        vitest_1.vi.useRealTimers();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // The number of renders depends on the user-agent
    it.skipIf(!/HeadlessChrome/.test(window.navigator.userAgent) || !skipIf_1.isJSDOM)('should prune rendering on cells', function () {
        var renderCellCount = 0;
        function CounterRender(props) {
            React.useEffect(function () {
                if (props.value === 'Nike') {
                    renderCellCount += 1;
                }
            });
            return <React.Fragment>{props.value}</React.Fragment>;
        }
        var columns = [
            {
                field: 'brand',
                renderCell: function (params) { return <CounterRender value={params.value}/>; },
            },
        ];
        function Test(props) {
            return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={columns} checkboxSelection {...props}/>
          </div>);
        }
        var setProps = render(<Test />).setProps;
        expect(renderCellCount).to.equal(1);
        var cell = (0, helperFn_1.getCell)(1, 0);
        cell.focus();
        internal_test_utils_1.fireEvent.click(cell);
        expect(renderCellCount).to.equal(2);
        setProps({ extra: true });
        expect(renderCellCount).to.equal(2);
    });
    describe('control Sorting', function () {
        it('should update the sorting state when neither the model nor the onChange are set', function () {
            render(<TestCase />);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
        });
        it('should not update the sort model when the sortModelProp is set', function () {
            var testSortModel = [{ field: 'brand', sort: 'desc' }];
            render(<TestCase sortModel={testSortModel}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma', 'Nike', 'Adidas']);
        });
        it('should update the sort state when the model is not set, but the onChange is set', function () {
            var onModelChange = (0, sinon_1.spy)();
            render(<TestCase onSortModelChange={onModelChange}/>);
            expect(onModelChange.callCount).to.equal(0);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0));
            expect(onModelChange.callCount).to.equal(1);
            expect(onModelChange.lastCall.firstArg).to.deep.equal([{ field: 'brand', sort: 'asc' }]);
        });
        it('should control sort state when the model and the onChange are set', function () {
            var expectedModel = [];
            function ControlCase(props) {
                var rows = props.rows, columns = props.columns, others = __rest(props, ["rows", "columns"]);
                var _a = React.useState([]), caseSortModel = _a[0], setSortModel = _a[1];
                var handleSortChange = function (newModel) {
                    setSortModel(newModel);
                    expectedModel = newModel;
                };
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro autoHeight={skipIf_1.isJSDOM} columns={columns || baselineProps.columns} rows={rows || baselineProps.rows} sortModel={caseSortModel} onSortModelChange={handleSortChange} {...others}/>
          </div>);
            }
            render(<ControlCase />);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
            expect(expectedModel).to.deep.equal([{ field: 'brand', sort: 'asc' }]);
        });
        it('should not call onSortModelChange on initialization or on sortModel prop change', function () {
            var onSortModelChange = (0, sinon_1.spy)();
            function Test(props) {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro autoHeight={skipIf_1.isJSDOM} columns={baselineProps.columns} rows={baselineProps.rows} onSortModelChange={onSortModelChange} {...props}/>
          </div>);
            }
            var setProps = render(<Test sortModel={[
                    { field: 'year', sort: 'desc' },
                    { field: 'brand', sort: 'asc' },
                ]}/>).setProps;
            expect(onSortModelChange.callCount).to.equal(0);
            setProps({
                sortModel: [
                    { field: 'year', sort: 'asc' },
                    { field: 'brand', sort: 'asc' },
                ],
            });
            expect(onSortModelChange.callCount).to.equal(0);
        });
    });
});

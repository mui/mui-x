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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
describe('<DataGridPro /> - Pagination', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('setPage', function () {
        it('should apply valid value', function () {
            var apiRef;
            function GridTest() {
                var basicData = (0, x_data_grid_generator_1.useBasicDemoData)(20, 2);
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...basicData} apiRef={apiRef} pagination initialState={{ pagination: { paginationModel: { pageSize: 1 } } }} pageSizeOptions={[1]}/>
          </div>);
            }
            render(<GridTest />);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(1);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
        });
        it('should apply last page if trying to go to a non-existing page', function () {
            var apiRef;
            function GridTest() {
                var basicData = (0, x_data_grid_generator_1.useBasicDemoData)(20, 2);
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...basicData} apiRef={apiRef} pagination initialState={{ pagination: { paginationModel: { pageSize: 1 } } }} pageSizeOptions={[1]}/>
          </div>);
            }
            render(<GridTest />);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(50);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['19']);
        });
    });
    describe('setPageSize', function () {
        it('should apply value', function () {
            var apiRef;
            function GridTest() {
                var basicData = (0, x_data_grid_generator_1.useBasicDemoData)(20, 2);
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...basicData} apiRef={apiRef} initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} pageSizeOptions={[2, 5]} pagination disableVirtualization/>
          </div>);
            }
            render(<GridTest />);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4']);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPageSize(2);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
        });
    });
    it('should log an error if rowCount is used with client-side pagination', function () {
        expect(function () {
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={[]} columns={[]} paginationMode="client" rowCount={100}/>
        </div>);
        }).toErrorDev([
            'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect. `rowCount` is only meant to be used with `paginationMode="server"`.',
        ]);
    });
    // Test for https://github.com/mui/mui-x/issues/19281
    it('should sync pagination prop with state properly', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var _b = _a.pagination, pagination = _b === void 0 ? false : _b;
            return (<div style={{ width: 300, height: 500 }}>
          <x_data_grid_pro_1.DataGridPro columns={columns} rows={rows} initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} pageSizeOptions={[5, 10]} pagination={pagination} disableVirtualization/>
        </div>);
        }
        var columns, rows, setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    columns = [{ field: 'name' }];
                    rows = [
                        { id: 1, name: 'Row 1' },
                        { id: 2, name: 'Row 2' },
                        { id: 3, name: 'Row 3' },
                        { id: 4, name: 'Row 4' },
                        { id: 5, name: 'Row 5' },
                        { id: 6, name: 'Row 6' },
                        { id: 7, name: 'Row 7' },
                        { id: 8, name: 'Row 8' },
                        { id: 9, name: 'Row 9' },
                        { id: 10, name: 'Row 10' },
                        { id: 11, name: 'Row 11' },
                    ];
                    setProps = render(<TestComponent />).setProps;
                    expect((0, helperFn_1.getColumnValues)(0)).to.have.length(11);
                    setProps({ pagination: true });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            var visibleValues = (0, helperFn_1.getColumnValues)(0);
                            expect(visibleValues).to.have.length(5);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});

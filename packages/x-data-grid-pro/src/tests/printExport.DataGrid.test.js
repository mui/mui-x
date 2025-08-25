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
var sinon_1 = require("sinon");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var internal_test_utils_1 = require("@mui/internal-test-utils");
describe('<DataGridPro /> - Print export', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var NB_ROWS = 2;
    var defaultData = (0, x_data_grid_generator_1.getBasicGridData)(NB_ROWS, 2);
    var apiRef;
    var baselineProps = __assign(__assign({}, defaultData), { 
        // A hack to remove the warning on print
        pageSizeOptions: [NB_ROWS, 100] });
    function Test(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef} {...props}/>
      </div>);
    }
    var allBooleanConfigurations = [
        {
            printVisible: true,
            gridVisible: true,
        },
        {
            printVisible: false,
            gridVisible: true,
        },
        {
            printVisible: true,
            gridVisible: false,
        },
        {
            printVisible: false,
            gridVisible: false,
        },
    ];
    describe('Export toolbar', function () {
        it('should display print button by default', function () {
            render(<Test showToolbar/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Export' }));
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Print' })).not.to.equal(null);
        });
        it('should disable print export when passing `printOptions.disableToolbarButton`', function () {
            render(<Test showToolbar slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Export' }));
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Print' })).to.equal(null);
        });
    });
    describe('column visibility with initialState', function () {
        allBooleanConfigurations.forEach(function (_a) {
            var printVisible = _a.printVisible, gridVisible = _a.gridVisible;
            it("should have 'currencyPair' ".concat(printVisible ? "'visible'" : "'hidden'", " in print and ").concat(gridVisible ? "'visible'" : "'hidden'", " in screen"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var onColumnVisibilityModelChange;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onColumnVisibilityModelChange = (0, sinon_1.spy)();
                            render(<Test onColumnVisibilityModelChange={onColumnVisibilityModelChange} initialState={{
                                    columns: {
                                        columnVisibilityModel: {
                                            currencyPair: gridVisible,
                                            id: false,
                                        },
                                    },
                                }}/>);
                            expect(onColumnVisibilityModelChange.callCount).to.equal(0);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                    var _a;
                                    return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsPrint({
                                        fields: printVisible ? ['currencyPair', 'id'] : ['id'],
                                    });
                                })];
                        case 1:
                            _a.sent();
                            expect(onColumnVisibilityModelChange.callCount).to.equal(2);
                            // verify column visibility has been set
                            expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
                                currencyPair: printVisible,
                                id: true,
                            });
                            // verify column visibility has been restored
                            expect(onColumnVisibilityModelChange.secondCall.firstArg).to.deep.equal({
                                currencyPair: gridVisible,
                                id: false,
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('columns to print', function () {
        it("should ignore 'allColumns' if 'fields' is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnVisibilityModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnVisibilityModelChange = (0, sinon_1.spy)();
                        render(<Test onColumnVisibilityModelChange={onColumnVisibilityModelChange}/>);
                        expect(onColumnVisibilityModelChange.callCount).to.equal(0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsPrint({ fields: ['id'], allColumns: true }); })];
                    case 1:
                        _a.sent();
                        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
                            currencyPair: false,
                            id: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it("should ignore 'disableExport' if 'fields' is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnVisibilityModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnVisibilityModelChange = (0, sinon_1.spy)();
                        render(<Test onColumnVisibilityModelChange={onColumnVisibilityModelChange} columns={[{ field: 'currencyPair' }, { field: 'id', disableExport: true }]}/>);
                        expect(onColumnVisibilityModelChange.callCount).to.equal(0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsPrint({ fields: ['id'], allColumns: true }); })];
                    case 1:
                        _a.sent();
                        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
                            currencyPair: false,
                            id: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it("should apply 'disableExport' even if 'allColumns' is set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnVisibilityModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnVisibilityModelChange = (0, sinon_1.spy)();
                        render(<Test onColumnVisibilityModelChange={onColumnVisibilityModelChange} columns={[{ field: 'currencyPair' }, { field: 'id', disableExport: true }]}/>);
                        expect(onColumnVisibilityModelChange.callCount).to.equal(0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsPrint({ allColumns: true }); })];
                    case 1:
                        _a.sent();
                        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
                            currencyPair: true,
                            id: false,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it("should print hidden columns if 'allColumns' set to true", function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnVisibilityModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnVisibilityModelChange = (0, sinon_1.spy)();
                        render(<Test columnVisibilityModel={{ id: false }} onColumnVisibilityModelChange={onColumnVisibilityModelChange} columns={[{ field: 'currencyPair' }, { field: 'id' }]}/>);
                        expect(onColumnVisibilityModelChange.callCount).to.equal(0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsPrint({ allColumns: true }); })];
                    case 1:
                        _a.sent();
                        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
                            currencyPair: true,
                            id: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});

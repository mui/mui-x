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
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var helperFn_1 = require("test/utils/helperFn");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
var rows = [{ id: 1 }];
var columns = [{ field: 'id' }, { field: 'idBis' }];
describe('<DataGridPro /> - Columns visibility', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestDataGridPro(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro columns={columns} rows={rows} {...props} apiRef={apiRef} autoHeight={isJSDOM}/>
      </div>);
    }
    describe('apiRef: updateColumns', function () {
        it('should not call `onColumnVisibilityModelChange` when no column visibility has changed', function () {
            var onColumnVisibilityModelChange = (0, sinon_1.spy)();
            render(<TestDataGridPro columnVisibilityModel={{ idBis: false }} onColumnVisibilityModelChange={onColumnVisibilityModelChange}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([{ field: 'id', width: 300 }]); });
            expect(onColumnVisibilityModelChange.callCount).to.equal(0);
        });
    });
    describe('apiRef: setColumnVisibility', function () {
        it('should update `columnVisibilityModel` in state', function () {
            render(<TestDataGridPro initialState={{ columns: { columnVisibilityModel: { idBis: false } } }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnVisibility('id', false); });
            expect((0, x_data_grid_pro_1.gridColumnVisibilityModelSelector)(apiRef)).to.deep.equal({
                id: false,
                idBis: false,
            });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnVisibility('id', true); });
            expect((0, x_data_grid_pro_1.gridColumnVisibilityModelSelector)(apiRef)).to.deep.equal({
                id: true,
                idBis: false,
            });
        });
        it('should call `onColumnVisibilityModelChange` with the new model', function () {
            var onColumnVisibilityModelChange = (0, sinon_1.spy)();
            render(<TestDataGridPro initialState={{ columns: { columnVisibilityModel: { idBis: false } } }} onColumnVisibilityModelChange={onColumnVisibilityModelChange}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnVisibility('id', false); });
            expect(onColumnVisibilityModelChange.callCount).to.equal(1);
            expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
                id: false,
                idBis: false,
            });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnVisibility('id', true); });
            expect(onColumnVisibilityModelChange.callCount).to.equal(2);
            expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
                idBis: false,
                id: true,
            });
        });
    });
    describe('apiRef: setColumnVisibilityModel', function () {
        it('should update `setColumnVisibilityModel` in state and call `onColumnVisibilityModelChange`', function () {
            var onColumnVisibilityModelChange = (0, sinon_1.spy)();
            render(<TestDataGridPro initialState={{ columns: { columnVisibilityModel: { idBis: false } } }} onColumnVisibilityModelChange={onColumnVisibilityModelChange}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnVisibilityModel({}); });
            expect(onColumnVisibilityModelChange.callCount).to.equal(1);
            expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({});
        });
    });
    it('should not hide column when resizing a column after hiding it and showing it again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, showHideAllCheckbox, separator;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGridPro initialState={{
                            columns: { columnVisibilityModel: {} },
                            preferencePanel: { open: true, openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.columns },
                        }}/>).user;
                    showHideAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Show/Hide All' });
                    return [4 /*yield*/, user.click(showHideAllCheckbox)];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([]);
                    return [4 /*yield*/, user.click(document.querySelector('[role="tooltip"] [name="id"]'))];
                case 2:
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                    return [4 /*yield*/, user.pointer([
                            {
                                keys: '[MouseLeft>]',
                                target: separator,
                                coords: { clientX: 100 },
                            },
                            {
                                target: separator,
                                coords: { clientX: 110 },
                            },
                            {
                                keys: '[/MouseLeft]',
                                target: separator,
                                coords: { clientX: 110 },
                            },
                        ])];
                case 3:
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    return [2 /*return*/];
            }
        });
    }); });
});

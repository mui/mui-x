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
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
describe('<DataGrid /> - Cell editable state', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function expectCellEditable(rowIndex, colIndex) {
        expect((0, helperFn_1.getCell)(rowIndex, colIndex)).to.have.class(x_data_grid_1.gridClasses['cell--editable']);
    }
    function expectCellNotEditable(rowIndex, colIndex) {
        expect((0, helperFn_1.getCell)(rowIndex, colIndex)).not.to.have.class(x_data_grid_1.gridClasses['cell--editable']);
    }
    // based on https://github.com/mui/mui-x/issues/19732
    it('should update cell editable state when `isCellEditable` prop changes', function () { return __awaiter(void 0, void 0, void 0, function () {
        function GridWithState() {
            var _a = React.useState(true), editable = _a[0], setEditable = _a[1];
            var _b = React.useState('cell'), editMode = _b[0], setEditMode = _b[1];
            return ((0, jsx_runtime_1.jsxs)("div", { style: { width: 400, height: 400 }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setEditable(function (s) { return !s; }); }, children: "toggle-editable" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setEditMode(function (s) { return (s === 'row' ? 'cell' : 'row'); }); }, children: "toggle-mode" }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: rows, columns: columns, editMode: editMode, isCellEditable: function (params) { return params.row.age % 2 === 0 && editable && editMode === 'cell'; } })] }));
        }
        var rows, columns, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rows = [
                        { id: 1, name: 'A', age: 20 },
                        { id: 2, name: 'B', age: 21 },
                    ];
                    columns = [
                        { field: 'name', editable: true, width: 150 },
                        { field: 'age', type: 'number', editable: true, width: 150 },
                    ];
                    user = render((0, jsx_runtime_1.jsx)(GridWithState, {})).user;
                    // Initially: editMode = 'cell', editable = true → row 0 cells editable
                    expectCellEditable(0, 0);
                    expectCellEditable(0, 1);
                    expectCellNotEditable(1, 0);
                    // Toggle editable → should remove editable class immediately
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'toggle-editable' }))];
                case 1:
                    // Toggle editable → should remove editable class immediately
                    _a.sent();
                    expectCellNotEditable(0, 0);
                    expectCellNotEditable(0, 1);
                    // Toggle mode to 'cell' again (it was set to false only) by switching mode away and back
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'toggle-mode' }))];
                case 2:
                    // Toggle mode to 'cell' again (it was set to false only) by switching mode away and back
                    _a.sent();
                    // Now editMode = 'row' → should not be editable regardless of row parity
                    expectCellNotEditable(0, 0);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'toggle-mode' }))];
                case 3:
                    _a.sent();
                    // Back to 'cell' but editable state is false → still not editable
                    expectCellNotEditable(0, 0);
                    return [2 /*return*/];
            }
        });
    }); });
    // based on https://github.com/mui/mui-x/issues/20143
    it('should update cell editable state when `colDef.editable` changes', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Component() {
            var _a = React.useState(true), isEditable = _a[0], setIsEditable = _a[1];
            var cols = [
                { field: 'id', width: 100 },
                { field: 'firstName', width: 150, editable: isEditable },
                { field: 'lastName', width: 150, editable: true },
            ];
            return ((0, jsx_runtime_1.jsxs)("div", { style: { width: 500, height: 400 }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setIsEditable(function (p) { return !p; }); }, children: "toggle-coldef" }), (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: rows, columns: cols, isCellEditable: function () { return true; } })] }));
        }
        var rows, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rows = [{ id: 1, firstName: 'Jon', lastName: 'Snow', age: 14 }];
                    user = render((0, jsx_runtime_1.jsx)(Component, {})).user;
                    // firstName column is editable initially
                    expectCellEditable(0, 1);
                    // Toggle colDef.editable to false → class should be removed immediately
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'toggle-coldef' }))];
                case 1:
                    // Toggle colDef.editable to false → class should be removed immediately
                    _a.sent();
                    expectCellNotEditable(0, 1);
                    return [2 /*return*/];
            }
        });
    }); });
});

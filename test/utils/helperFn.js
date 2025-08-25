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
exports.includeRowSelection = exports.getSelectInput = void 0;
exports.$ = $;
exports.$$ = $$;
exports.grid = grid;
exports.gridVar = gridVar;
exports.gridOffsetTop = gridOffsetTop;
exports.sleep = sleep;
exports.microtasks = microtasks;
exports.spyApi = spyApi;
exports.raf = raf;
exports.getActiveCell = getActiveCell;
exports.getActiveColumnHeader = getActiveColumnHeader;
exports.getColumnValues = getColumnValues;
exports.getRowValues = getRowValues;
exports.getColumnHeaderCell = getColumnHeaderCell;
exports.getColumnHeadersTextContent = getColumnHeadersTextContent;
exports.getRowsFieldContent = getRowsFieldContent;
exports.getCell = getCell;
exports.getRows = getRows;
exports.getRow = getRow;
exports.getSelectByName = getSelectByName;
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
function $(a, b) {
    var target = (b === undefined ? document : a);
    var selector = (b === undefined ? a : b);
    return target.querySelector(selector);
}
function $$(a, b) {
    var target = (b === undefined ? document : a);
    var selector = (b === undefined ? a : b);
    return Array.from(target.querySelectorAll(selector));
}
function grid(klass) {
    return $(".".concat(x_data_grid_1.gridClasses[klass]));
}
function gridVar(name) {
    return $(".".concat(x_data_grid_1.gridClasses.root)).style.getPropertyValue(name);
}
function gridOffsetTop() {
    var transform = getComputedStyle(grid('virtualScrollerRenderZone')).transform;
    return parseInt(transform.startsWith('translate3d')
        ? transform.split('(')[1].split(',')[1]
        : transform.split('(')[1].split(',')[5], 10);
}
function sleep(duration) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, duration);
    });
}
function microtasks() {
    return (0, internal_test_utils_1.act)(function () { return Promise.resolve(); });
}
function spyApi(api, methodName) {
    var methodKey = methodName;
    var privateApi = (0, internals_1.unwrapPrivateAPI)(api);
    var method = privateApi[methodKey];
    var spyFn = (0, sinon_1.spy)(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return spyFn.target.apply(spyFn, args);
    });
    spyFn.spying = true;
    spyFn.target = method;
    api[methodKey] = spyFn;
    privateApi[methodKey] = spyFn;
    return spyFn;
}
function raf() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    // Chrome and Safari have a bug where calling rAF once returns the current
                    // frame instead of the next frame, so we need to call a double rAF here.
                    // See crbug.com/675795 for more.
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            resolve();
                        });
                    });
                })];
        });
    });
}
/**
 * Returns the 0-based row and column index of the active cell
 */
function getActiveCell() {
    var activeElement;
    if (document.activeElement && document.activeElement.getAttribute('role') === 'gridcell') {
        activeElement = document.activeElement;
    }
    else {
        activeElement = document.activeElement && document.activeElement.closest('[role="gridcell"]');
    }
    if (!activeElement) {
        return null;
    }
    return "".concat(activeElement.parentElement.getAttribute('data-rowindex'), "-").concat(activeElement.getAttribute('data-colindex'));
}
/**
 * Returns the 0-based column index of the active column header
 */
function getActiveColumnHeader() {
    var activeElement;
    if (document.activeElement && document.activeElement.getAttribute('role') === 'columnheader') {
        activeElement = document.activeElement;
    }
    else {
        activeElement =
            document.activeElement && document.activeElement.closest('[role="columnheader"]');
    }
    if (!activeElement) {
        return null;
    }
    return "".concat(Number(activeElement.getAttribute('aria-colindex')) - 1);
}
function getColumnValues(colIndex) {
    return Array.from(document.querySelectorAll("[role=\"gridcell\"][data-colindex=\"".concat(colIndex, "\"]"))).map(function (node) { return node.textContent; });
}
function getRowValues(rowIndex) {
    return Array.from(document.querySelectorAll("[data-rowindex=\"".concat(rowIndex, "\"] [role=\"gridcell\"]"))).map(function (node) { return node.textContent; });
}
function getColumnHeaderCell(colIndex, rowIndex) {
    var headerRowSelector = rowIndex === undefined ? '' : "[role=\"row\"][aria-rowindex=\"".concat(rowIndex + 1, "\"] ");
    var headerCellSelector = "[role=\"columnheader\"][aria-colindex=\"".concat(colIndex + 1, "\"]");
    var columnHeader = document.querySelector("".concat(headerRowSelector).concat(headerCellSelector));
    if (columnHeader == null) {
        throw new Error("columnheader ".concat(colIndex, " not found"));
    }
    return columnHeader;
}
function getColumnHeadersTextContent() {
    return internal_test_utils_1.screen.queryAllByRole('columnheader').map(function (node) { return node.textContent; });
}
function getRowsFieldContent(field) {
    return Array.from(document.querySelectorAll('[role="row"][data-rowindex]')).map(function (node) { var _a; return (_a = node.querySelector("[role=\"gridcell\"][data-field=\"".concat(field, "\"]"))) === null || _a === void 0 ? void 0 : _a.textContent; });
}
function getCell(rowIndex, colIndex) {
    var cell = document.querySelector("[role=\"row\"][data-rowindex=\"".concat(rowIndex, "\"] [role=\"gridcell\"][data-colindex=\"").concat(colIndex, "\"]"));
    if (cell == null) {
        throw new Error("Cell ".concat(rowIndex, " ").concat(colIndex, " not found"));
    }
    return cell;
}
function getRows() {
    return document.querySelectorAll("[role=\"row\"][data-rowindex]");
}
function getRow(rowIndex) {
    var row = document.querySelector("[role=\"row\"][data-rowindex=\"".concat(rowIndex, "\"]"));
    if (row == null) {
        throw new Error("Row ".concat(rowIndex, " not found"));
    }
    return row;
}
/**
 * Returns the hidden `input` element of the Material UI Select component
 */
var getSelectInput = function (combobox) {
    if (!combobox) {
        return null;
    }
    var comboboxParent = combobox.parentElement;
    if (!comboboxParent) {
        return null;
    }
    var input = comboboxParent.querySelector('input');
    return input;
};
exports.getSelectInput = getSelectInput;
function getSelectByName(name) {
    return (0, exports.getSelectInput)(internal_test_utils_1.screen.getByRole('combobox', { name: name }));
}
var includeRowSelection = function (ids) {
    return { type: 'include', ids: new Set(ids) };
};
exports.includeRowSelection = includeRowSelection;

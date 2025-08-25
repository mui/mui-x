"use strict";
'use client';
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
exports.renderEditInputCell = exports.GridEditInputCell = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var styles_1 = require("@mui/material/styles");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var assert_1 = require("../../utils/assert");
var cssVariables_1 = require("../../constants/cssVariables");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['editInputCell'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridEditInputCellRoot = (0, styles_1.styled)((assert_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'EditInputCell',
})({
    font: cssVariables_1.vars.typography.font.body,
    padding: '1px 0',
    '& input': {
        padding: '0 16px',
        height: '100%',
    },
});
var GridEditInputCell = (0, forwardRef_1.forwardRef)(function (props, ref) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var id = props.id, value = props.value, formattedValue = props.formattedValue, api = props.api, field = props.field, row = props.row, rowNode = props.rowNode, colDef = props.colDef, cellMode = props.cellMode, isEditable = props.isEditable, tabIndex = props.tabIndex, hasFocus = props.hasFocus, isValidating = props.isValidating, _a = props.debounceMs, debounceMs = _a === void 0 ? 200 : _a, isProcessingProps = props.isProcessingProps, onValueChange = props.onValueChange, slotProps = props.slotProps, other = __rest(props, ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "hasFocus", "isValidating", "debounceMs", "isProcessingProps", "onValueChange", "slotProps"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var inputRef = React.useRef(null);
    var _b = React.useState(value), valueState = _b[0], setValueState = _b[1];
    var classes = useUtilityClasses(rootProps);
    var handleChange = React.useCallback(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var newValue, column, parsedValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newValue = event.target.value;
                    column = apiRef.current.getColumn(field);
                    parsedValue = newValue;
                    if (column.valueParser) {
                        parsedValue = column.valueParser(newValue, apiRef.current.getRow(id), column, apiRef);
                    }
                    setValueState(parsedValue);
                    apiRef.current.setEditCellValue({ id: id, field: field, value: parsedValue, debounceMs: debounceMs, unstable_skipValueParser: true }, event);
                    if (!onValueChange) return [3 /*break*/, 2];
                    return [4 /*yield*/, onValueChange(event, newValue)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [apiRef, debounceMs, field, id, onValueChange]);
    var meta = apiRef.current.unstable_getEditCellMeta(id, field);
    React.useEffect(function () {
        if ((meta === null || meta === void 0 ? void 0 : meta.changeReason) !== 'debouncedSetEditCellValue') {
            setValueState(value);
        }
    }, [meta, value]);
    (0, useEnhancedEffect_1.default)(function () {
        if (hasFocus) {
            inputRef.current.focus();
        }
    }, [hasFocus]);
    return (<GridEditInputCellRoot as={rootProps.slots.baseInput} inputRef={inputRef} className={classes.root} ownerState={rootProps} fullWidth type={colDef.type === 'number' ? colDef.type : 'text'} value={valueState !== null && valueState !== void 0 ? valueState : ''} onChange={handleChange} endAdornment={isProcessingProps ? <rootProps.slots.loadIcon fontSize="small" color="action"/> : undefined} {...other} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.root} ref={ref}/>);
});
exports.GridEditInputCell = GridEditInputCell;
GridEditInputCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * GridApi that let you manipulate the grid.
     */
    api: prop_types_1.default.object.isRequired,
    /**
     * The mode of the cell.
     */
    cellMode: prop_types_1.default.oneOf(['edit', 'view']).isRequired,
    changeReason: prop_types_1.default.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: prop_types_1.default.object.isRequired,
    debounceMs: prop_types_1.default.number,
    /**
     * The column field of the cell that triggered the event.
     */
    field: prop_types_1.default.string.isRequired,
    /**
     * The cell value formatted with the column valueFormatter.
     */
    formattedValue: prop_types_1.default.any,
    /**
     * If true, the cell is the active element.
     */
    hasFocus: prop_types_1.default.bool.isRequired,
    /**
     * The grid row id.
     */
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    /**
     * If true, the cell is editable.
     */
    isEditable: prop_types_1.default.bool,
    isProcessingProps: prop_types_1.default.bool,
    isValidating: prop_types_1.default.bool,
    /**
     * Callback called when the value is changed by the user.
     * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
     * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
     * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
     */
    onValueChange: prop_types_1.default.func,
    /**
     * The row model of the row that the current cell belongs to.
     */
    row: prop_types_1.default.any.isRequired,
    /**
     * The node of the row that the current cell belongs to.
     */
    rowNode: prop_types_1.default.object.isRequired,
    slotProps: prop_types_1.default.object,
    /**
     * the tabIndex value.
     */
    tabIndex: prop_types_1.default.oneOf([-1, 0]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: prop_types_1.default.any,
};
var renderEditInputCell = function (params) { return (<GridEditInputCell {...params}/>); };
exports.renderEditInputCell = renderEditInputCell;

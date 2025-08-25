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
exports.renderEditCountry = renderEditCountry;
var React = require("react");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var Autocomplete_1 = require("@mui/material/Autocomplete");
var InputBase_1 = require("@mui/material/InputBase");
var Box_1 = require("@mui/material/Box");
var styles_1 = require("@mui/material/styles");
var static_data_1 = require("../services/static-data");
var StyledAutocomplete = (0, styles_1.styled)(Autocomplete_1.default)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            height: '100%'
        },
        _b["& .".concat(Autocomplete_1.autocompleteClasses.inputRoot)] = __assign(__assign({}, theme.typography.body2), { padding: '1px 0', height: '100%', '& input': {
                padding: '0 16px',
                height: '100%',
            } }),
        _b);
});
function EditCountry(props) {
    var _this = this;
    var id = props.id, value = props.value, field = props.field;
    var apiRef = (0, x_data_grid_premium_1.useGridApiContext)();
    var handleChange = React.useCallback(function (event, newValue) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiRef.current.setEditCellValue({ id: id, field: field, value: newValue }, event)];
                case 1:
                    _a.sent();
                    apiRef.current.stopCellEditMode({ id: id, field: field });
                    return [2 /*return*/];
            }
        });
    }); }, [apiRef, field, id]);
    return (<StyledAutocomplete value={value} onChange={handleChange} options={static_data_1.COUNTRY_ISO_OPTIONS} getOptionLabel={function (option) { return option.label; }} autoHighlight fullWidth open disableClearable renderOption={function (optionProps, option) { return (<Box_1.default component="li" sx={{
                '& > img': {
                    mr: 1.5,
                    flexShrink: 0,
                },
            }} {...optionProps} key={option.code}>
          <img loading="lazy" width="20" src={"https://flagcdn.com/w20/".concat(option.code.toLowerCase(), ".png")} srcSet={"https://flagcdn.com/w40/".concat(option.code.toLowerCase(), ".png 2x")} alt=""/>
          {option.label}
        </Box_1.default>); }} renderInput={function (params) { return (<InputBase_1.default autoFocus fullWidth id={params.id} inputProps={__assign(__assign({}, params.inputProps), { autoComplete: 'new-password' })} {...params.InputProps}/>); }}/>);
}
function renderEditCountry(params) {
    return <EditCountry {...params}/>;
}

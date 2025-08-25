"use strict";
'use client';
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
exports.PromptField = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var PromptFieldContext_1 = require("./PromptFieldContext");
/**
 * The top level Prompt Field component that provides context to child components.
 * It renders a `<div />` element.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptField API](https://mui.com/x/api/data-grid/prompt-field/)
 */
var PromptField = (0, forwardRef_1.forwardRef)(function PromptField(props, ref) {
    var _this = this;
    var render = props.render, className = props.className, lang = props.lang, onRecordError = props.onRecordError, onSubmit = props.onSubmit, other = __rest(props, ["render", "className", "lang", "onRecordError", "onSubmit"]);
    var _a = React.useState(''), value = _a[0], setValue = _a[1];
    var _b = React.useState(false), recording = _b[0], setRecording = _b[1];
    var _c = React.useState(false), disabled = _c[0], setDisabled = _c[1];
    var state = React.useMemo(function () { return ({
        value: value,
        recording: recording,
        disabled: disabled,
    }); }, [value, recording, disabled]);
    var resolvedClassName = typeof className === 'function' ? className(state) : className;
    var handleOnSubmit = React.useCallback(function (prompt) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setDisabled(true);
                    setValue('');
                    return [4 /*yield*/, onSubmit(prompt)];
                case 1:
                    _a.sent();
                    setDisabled(false);
                    return [2 /*return*/];
            }
        });
    }); }, [onSubmit]);
    var contextValue = React.useMemo(function () { return ({
        state: state,
        lang: lang,
        onValueChange: setValue,
        onRecordingChange: setRecording,
        onSubmit: handleOnSubmit,
        onError: onRecordError,
    }); }, [state, lang, onRecordError, handleOnSubmit]);
    var element = (0, useComponentRenderer_1.useComponentRenderer)('div', render, __assign(__assign({ className: resolvedClassName }, other), { ref: ref }), state);
    return <PromptFieldContext_1.PromptFieldContext.Provider value={contextValue}>{element}</PromptFieldContext_1.PromptFieldContext.Provider>;
});
exports.PromptField = PromptField;
PromptField.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    className: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    /**
     * Called when an speech recognition error occurs.
     * @param {string} error The error message
     */
    onRecordError: prop_types_1.default.func,
    /**
     * Called when the user submits the prompt.
     * @param {string} prompt The prompt
     */
    onSubmit: prop_types_1.default.func.isRequired,
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
};

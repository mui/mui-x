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
exports.PromptFieldRecord = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useTimeout_1 = require("@mui/utils/useTimeout");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var PromptFieldContext_1 = require("./PromptFieldContext");
var speechRecognition_1 = require("../../utils/speechRecognition");
/**
 * A button that records the user's voice when clicked.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptFieldRecord API](https://mui.com/x/api/data-grid/prompt-field-record/)
 */
var PromptFieldRecord = (0, forwardRef_1.forwardRef)(function PromptFieldRecord(props, ref) {
    var _a;
    var render = props.render, className = props.className, onClick = props.onClick, other = __rest(props, ["render", "className", "onClick"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _b = (0, PromptFieldContext_1.usePromptFieldContext)(), state = _b.state, lang = _b.lang, onRecordingChange = _b.onRecordingChange, onValueChange = _b.onValueChange, onSubmit = _b.onSubmit, onError = _b.onError;
    var resolvedClassName = typeof className === 'function' ? className(state) : className;
    var recognition = (0, useLazyRef_1.default)(function () {
        if (!speechRecognition_1.BrowserSpeechRecognition) {
            return {
                start: function () { },
                abort: function () { },
            };
        }
        var timeout = new useTimeout_1.Timeout();
        var instance = new speechRecognition_1.BrowserSpeechRecognition();
        instance.continuous = true;
        instance.interimResults = true;
        instance.lang = lang;
        var finalResult = '';
        var interimResult = '';
        function start(options) {
            if (state.recording) {
                return;
            }
            onRecordingChange(true);
            instance.onresult = function (event) {
                finalResult = '';
                interimResult = '';
                if (typeof event.results === 'undefined') {
                    instance.stop();
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; i += 1) {
                    if (event.results[i].isFinal) {
                        finalResult += event.results[i][0].transcript;
                    }
                    else {
                        interimResult += event.results[i][0].transcript;
                    }
                }
                if (finalResult === '') {
                    options.onUpdate(interimResult);
                }
                timeout.start(1000, function () { return instance.stop(); });
            };
            instance.onsoundend = function () {
                instance.stop();
            };
            instance.onend = function () {
                options.onDone(finalResult);
                onRecordingChange(false);
            };
            instance.onerror = function (error) {
                options.onError(error.message);
                instance.stop();
                onRecordingChange(false);
            };
            instance.start();
        }
        function abort() {
            instance.abort();
        }
        return { start: start, abort: abort };
    }).current;
    var handleClick = function (event) {
        if (!state.recording) {
            recognition.start({
                onDone: onSubmit,
                onUpdate: onValueChange,
                onError: onError !== null && onError !== void 0 ? onError : (function () { }),
            });
            return;
        }
        recognition.abort();
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    };
    var element = (0, useComponentRenderer_1.useComponentRenderer)(rootProps.slots.baseIconButton, render, __assign(__assign(__assign(__assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton), { className: resolvedClassName, disabled: state.disabled }), other), { ref: ref, onClick: handleClick }), state);
    return <React.Fragment>{element}</React.Fragment>;
});
exports.PromptFieldRecord = PromptFieldRecord;
PromptFieldRecord.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    className: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    color: prop_types_1.default.oneOf(['default', 'inherit', 'primary']),
    disabled: prop_types_1.default.bool,
    edge: prop_types_1.default.oneOf(['end', 'start', false]),
    id: prop_types_1.default.string,
    label: prop_types_1.default.string,
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
    role: prop_types_1.default.string,
    size: prop_types_1.default.oneOf(['large', 'medium', 'small']),
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    title: prop_types_1.default.string,
    touchRippleRef: prop_types_1.default.any,
};

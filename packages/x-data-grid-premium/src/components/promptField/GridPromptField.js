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
exports.GridPromptField = GridPromptField;
var jsx_runtime_1 = require("react/jsx-runtime");
var PromptField_1 = require("./PromptField");
var PromptFieldControl_1 = require("./PromptFieldControl");
var PromptFieldRecord_1 = require("./PromptFieldRecord");
var PromptFieldSend_1 = require("./PromptFieldSend");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var speechRecognition_1 = require("../../utils/speechRecognition");
function GridPromptField(props) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var placeholder = apiRef.current.getLocaleText('promptFieldPlaceholder');
    if (speechRecognition_1.IS_SPEECH_RECOGNITION_SUPPORTED) {
        placeholder = apiRef.current.getLocaleText('promptFieldPlaceholderWithRecording');
    }
    return ((0, jsx_runtime_1.jsx)(PromptField_1.PromptField, __assign({}, props, { children: (0, jsx_runtime_1.jsx)(PromptFieldControl_1.PromptFieldControl, { onKeyDown: function (event) {
                if (event.key === 'Enter') {
                    // Prevents the `multiline` TextField from adding a new line
                    event.preventDefault();
                }
            }, render: function (_a, state) {
                var _b;
                var ref = _a.ref, controlProps = __rest(_a, ["ref"]);
                return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTextField, __assign({}, controlProps, { fullWidth: true, inputRef: ref, "aria-label": apiRef.current.getLocaleText('promptFieldLabel'), placeholder: state.recording
                        ? apiRef.current.getLocaleText('promptFieldPlaceholderListening')
                        : placeholder, size: "small", multiline: true, autoFocus: true, slotProps: __assign({ input: __assign({ startAdornment: speechRecognition_1.IS_SPEECH_RECOGNITION_SUPPORTED ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: state.recording
                                    ? apiRef.current.getLocaleText('promptFieldStopRecording')
                                    : apiRef.current.getLocaleText('promptFieldRecord'), children: (0, jsx_runtime_1.jsx)(PromptFieldRecord_1.PromptFieldRecord, { size: "small", edge: "start", color: state.recording ? 'primary' : 'default', children: (0, jsx_runtime_1.jsx)(rootProps.slots.promptSpeechRecognitionIcon, { fontSize: "small" }) }) })) : ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('promptFieldSpeechRecognitionNotSupported'), children: (0, jsx_runtime_1.jsx)(rootProps.slots.promptSpeechRecognitionOffIcon, { fontSize: "small" }) })), endAdornment: ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('promptFieldSend'), children: (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsx)(PromptFieldSend_1.PromptFieldSend, { size: "small", edge: "end", color: "primary", children: (0, jsx_runtime_1.jsx)(rootProps.slots.promptSendIcon, { fontSize: "small" }) }) }) })) }, (_b = controlProps.slotProps) === null || _b === void 0 ? void 0 : _b.input) }, controlProps.slotProps) })));
            } }) })));
}

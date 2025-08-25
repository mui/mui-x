"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRegisterPipeProcessor = void 0;
var React = require("react");
var useFirstRender_1 = require("../../utils/useFirstRender");
var useGridRegisterPipeProcessor = function (apiRef, group, callback, enabled) {
    if (enabled === void 0) { enabled = true; }
    var cleanup = React.useRef(null);
    var id = React.useRef("mui-".concat(Math.round(Math.random() * 1e9)));
    var registerPreProcessor = React.useCallback(function () {
        cleanup.current = apiRef.current.registerPipeProcessor(group, id.current, callback);
    }, [apiRef, callback, group]);
    (0, useFirstRender_1.useFirstRender)(function () {
        if (enabled) {
            registerPreProcessor();
        }
    });
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else if (enabled) {
            registerPreProcessor();
        }
        return function () {
            if (cleanup.current) {
                cleanup.current();
                cleanup.current = null;
            }
        };
    }, [registerPreProcessor, enabled]);
};
exports.useGridRegisterPipeProcessor = useGridRegisterPipeProcessor;

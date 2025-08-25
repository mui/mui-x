"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRegisterPipeApplier = void 0;
var React = require("react");
var useFirstRender_1 = require("../../utils/useFirstRender");
var useGridRegisterPipeApplier = function (apiRef, group, callback) {
    var cleanup = React.useRef(null);
    var id = React.useRef("mui-".concat(Math.round(Math.random() * 1e9)));
    var registerPreProcessor = React.useCallback(function () {
        cleanup.current = apiRef.current.registerPipeApplier(group, id.current, callback);
    }, [apiRef, callback, group]);
    (0, useFirstRender_1.useFirstRender)(function () {
        registerPreProcessor();
    });
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else {
            registerPreProcessor();
        }
        return function () {
            if (cleanup.current) {
                cleanup.current();
                cleanup.current = null;
            }
        };
    }, [registerPreProcessor]);
};
exports.useGridRegisterPipeApplier = useGridRegisterPipeApplier;

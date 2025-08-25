"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRegisterStrategyProcessor = void 0;
var React = require("react");
var useFirstRender_1 = require("../../utils/useFirstRender");
var useGridRegisterStrategyProcessor = function (apiRef, strategyName, group, processor) {
    var registerPreProcessor = React.useCallback(function () {
        apiRef.current.registerStrategyProcessor(strategyName, group, processor);
    }, [apiRef, processor, group, strategyName]);
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
    }, [registerPreProcessor]);
};
exports.useGridRegisterStrategyProcessor = useGridRegisterStrategyProcessor;

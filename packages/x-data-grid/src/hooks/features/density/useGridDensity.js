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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridDensity = exports.densityStateInitializer = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useGridLogger_1 = require("../../utils/useGridLogger");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var densitySelector_1 = require("./densitySelector");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var densityStateInitializer = function (state, props) {
    var _a, _b, _c;
    return (__assign(__assign({}, state), { density: (_c = (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.density) !== null && _b !== void 0 ? _b : props.density) !== null && _c !== void 0 ? _c : 'standard' }));
};
exports.densityStateInitializer = densityStateInitializer;
var useGridDensity = function (apiRef, props) {
    var _a;
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useDensity');
    apiRef.current.registerControlState({
        stateId: 'density',
        propModel: props.density,
        propOnChange: props.onDensityChange,
        stateSelector: densitySelector_1.gridDensitySelector,
        changeEvent: 'densityChange',
    });
    var setDensity = (0, useEventCallback_1.default)(function (newDensity) {
        var currentDensity = (0, densitySelector_1.gridDensitySelector)(apiRef);
        if (currentDensity === newDensity) {
            return;
        }
        logger.debug("Set grid density to ".concat(newDensity));
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { density: newDensity })); });
    });
    var densityApi = {
        setDensity: setDensity,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, densityApi, 'public');
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a;
        var exportedDensity = (0, densitySelector_1.gridDensitySelector)(apiRef);
        var shouldExportRowCount = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the `density` is controlled
            props.density != null ||
            // Always export if the `density` has been initialized
            ((_a = props.initialState) === null || _a === void 0 ? void 0 : _a.density) != null;
        if (!shouldExportRowCount) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { density: exportedDensity });
    }, [apiRef, props.density, (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.density]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a;
        var restoredDensity = ((_a = context.stateToRestore) === null || _a === void 0 ? void 0 : _a.density)
            ? context.stateToRestore.density
            : (0, densitySelector_1.gridDensitySelector)(apiRef);
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { density: restoredDensity })); });
        return params;
    }, [apiRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    React.useEffect(function () {
        if (props.density) {
            apiRef.current.setDensity(props.density);
        }
    }, [apiRef, props.density]);
};
exports.useGridDensity = useGridDensity;

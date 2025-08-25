"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridStatePersistence = void 0;
var React = require("react");
var utils_1 = require("../../utils");
var useGridStatePersistence = function (apiRef) {
    var exportState = React.useCallback(function (params) {
        if (params === void 0) { params = {}; }
        var stateToExport = apiRef.current.unstable_applyPipeProcessors('exportState', {}, params);
        return stateToExport;
    }, [apiRef]);
    var restoreState = React.useCallback(function (stateToRestore) {
        var response = apiRef.current.unstable_applyPipeProcessors('restoreState', {
            callbacks: [],
        }, {
            stateToRestore: stateToRestore,
        });
        response.callbacks.forEach(function (callback) {
            callback();
        });
    }, [apiRef]);
    var statePersistenceApi = {
        exportState: exportState,
        restoreState: restoreState,
    };
    (0, utils_1.useGridApiMethod)(apiRef, statePersistenceApi, 'public');
};
exports.useGridStatePersistence = useGridStatePersistence;

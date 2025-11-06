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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridPreferencesPanel = exports.preferencePanelStateInitializer = void 0;
var React = require("react");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridLogger_1 = require("../../utils/useGridLogger");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var gridPreferencePanelSelector_1 = require("./gridPreferencePanelSelector");
var preferencePanelStateInitializer = function (state, props) {
    var _a, _b;
    return (__assign(__assign({}, state), { preferencePanel: (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.preferencePanel) !== null && _b !== void 0 ? _b : { open: false } }));
};
exports.preferencePanelStateInitializer = preferencePanelStateInitializer;
/**
 * TODO: Add a single `setPreferencePanel` method to avoid multiple `setState`
 */
var useGridPreferencesPanel = function (apiRef, props) {
    var _a;
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridPreferencesPanel');
    /**
     * API METHODS
     */
    var hidePreferences = React.useCallback(function () {
        apiRef.current.setState(function (state) {
            if (!state.preferencePanel.open) {
                return state;
            }
            logger.debug('Hiding Preferences Panel');
            var preferencePanelState = (0, gridPreferencePanelSelector_1.gridPreferencePanelStateSelector)(apiRef);
            apiRef.current.publishEvent('preferencePanelClose', {
                openedPanelValue: preferencePanelState.openedPanelValue,
            });
            return __assign(__assign({}, state), { preferencePanel: { open: false } });
        });
    }, [apiRef, logger]);
    var showPreferences = React.useCallback(function (newValue, panelId, labelId) {
        logger.debug('Opening Preferences Panel');
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { preferencePanel: __assign(__assign({}, state.preferencePanel), { open: true, openedPanelValue: newValue, panelId: panelId, labelId: labelId }) })); });
        apiRef.current.publishEvent('preferencePanelOpen', {
            openedPanelValue: newValue,
        });
    }, [logger, apiRef]);
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, {
        showPreferences: showPreferences,
        hidePreferences: hidePreferences,
    }, 'public');
    /**
     * PRE-PROCESSING
     */
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a;
        var preferencePanelToExport = (0, gridPreferencePanelSelector_1.gridPreferencePanelStateSelector)(apiRef);
        var shouldExportPreferencePanel = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the panel was initialized
            ((_a = props.initialState) === null || _a === void 0 ? void 0 : _a.preferencePanel) != null ||
            // Always export if the panel is opened
            preferencePanelToExport.open;
        if (!shouldExportPreferencePanel) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { preferencePanel: preferencePanelToExport });
    }, [apiRef, (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.preferencePanel]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var preferencePanel = context.stateToRestore.preferencePanel;
        if (preferencePanel != null) {
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { preferencePanel: preferencePanel })); });
        }
        return params;
    }, [apiRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
};
exports.useGridPreferencesPanel = useGridPreferencesPanel;

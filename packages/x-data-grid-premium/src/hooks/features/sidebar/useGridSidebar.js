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
exports.useGridSidebar = exports.sidebarStateInitializer = void 0;
var React = require("react");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridSidebarSelector_1 = require("./gridSidebarSelector");
var sidebarStateInitializer = function (state, props) {
    var _a, _b;
    return (__assign(__assign({}, state), { sidebar: (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.sidebar) !== null && _b !== void 0 ? _b : { open: false } }));
};
exports.sidebarStateInitializer = sidebarStateInitializer;
var useGridSidebar = function (apiRef, props) {
    var _a;
    var hideSidebar = React.useCallback(function () {
        apiRef.current.setState(function (state) {
            if (!state.sidebar.open || !state.sidebar.value) {
                return state;
            }
            apiRef.current.publishEvent('sidebarClose', {
                value: state.sidebar.value,
            });
            return __assign(__assign({}, state), { sidebar: { open: false } });
        });
    }, [apiRef]);
    var showSidebar = React.useCallback(function (newValue, sidebarId, labelId) {
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { sidebar: __assign(__assign({}, state.sidebar), { open: true, value: newValue, sidebarId: sidebarId, labelId: labelId }) })); });
        apiRef.current.publishEvent('sidebarOpen', {
            value: newValue,
        });
    }, [apiRef]);
    (0, internals_1.useGridApiMethod)(apiRef, {
        showSidebar: showSidebar,
        hideSidebar: hideSidebar,
    }, 'public');
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a;
        var sidebarToExport = (0, gridSidebarSelector_1.gridSidebarStateSelector)(apiRef);
        var shouldExportSidebar = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the sidebar was initialized
            ((_a = props.initialState) === null || _a === void 0 ? void 0 : _a.sidebar) != null ||
            // Always export if the sidebar is opened
            sidebarToExport.open;
        if (!shouldExportSidebar) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { sidebar: sidebarToExport });
    }, [apiRef, (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.sidebar]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var sidebar = context.stateToRestore.sidebar;
        if (sidebar != null) {
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { sidebar: sidebar })); });
        }
        return params;
    }, [apiRef]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    (0, internals_1.useGridEventPriority)(apiRef, 'sidebarClose', props.onSidebarClose);
    (0, internals_1.useGridEventPriority)(apiRef, 'sidebarOpen', props.onSidebarOpen);
};
exports.useGridSidebar = useGridSidebar;

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
exports.virtualizationStateInitializer = void 0;
exports.useGridVirtualization = useGridVirtualization;
var React = require("react");
var x_virtualizer_1 = require("@mui/x-virtualizer");
var isJSDOM_1 = require("../../../utils/isJSDOM");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var utils_1 = require("../../utils");
var HAS_LAYOUT = !isJSDOM_1.isJSDOM;
// XXX: We want to use the virtualizer as the source of truth for its state, but this needs to
// stay because some parts of the grid require the `virtualization` state during initialization.
var virtualizationStateInitializer = function (state, props) {
    var disableVirtualization = props.disableVirtualization, autoHeight = props.autoHeight;
    var virtualization = {
        enabled: !disableVirtualization && HAS_LAYOUT,
        enabledForColumns: !disableVirtualization && HAS_LAYOUT,
        enabledForRows: !disableVirtualization && !autoHeight && HAS_LAYOUT,
        renderContext: x_virtualizer_1.EMPTY_RENDER_CONTEXT,
    };
    return __assign(__assign({}, state), { virtualization: virtualization });
};
exports.virtualizationStateInitializer = virtualizationStateInitializer;
function useGridVirtualization(apiRef, rootProps) {
    var virtualizer = apiRef.current.virtualizer;
    var autoHeight = rootProps.autoHeight, disableVirtualization = rootProps.disableVirtualization;
    /*
     * API METHODS
     */
    var setVirtualization = function (enabled) {
        enabled && (enabled = HAS_LAYOUT);
        virtualizer.store.set('virtualization', __assign(__assign({}, virtualizer.store.state.virtualization), { enabled: enabled, enabledForColumns: enabled, enabledForRows: enabled && !autoHeight }));
    };
    var setColumnVirtualization = function (enabled) {
        enabled && (enabled = HAS_LAYOUT);
        virtualizer.store.set('virtualization', __assign(__assign({}, virtualizer.store.state.virtualization), { enabledForColumns: enabled }));
    };
    var api = {
        unstable_setVirtualization: setVirtualization,
        unstable_setColumnVirtualization: setColumnVirtualization,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, api, 'public');
    var forceUpdateRenderContext = virtualizer.api.forceUpdateRenderContext;
    apiRef.current.register('private', {
        updateRenderContext: forceUpdateRenderContext,
    });
    /*
     * EFFECTS
     */
    (0, utils_1.useGridEventPriority)(apiRef, 'sortedRowsSet', forceUpdateRenderContext);
    (0, utils_1.useGridEventPriority)(apiRef, 'paginationModelChange', forceUpdateRenderContext);
    (0, utils_1.useGridEventPriority)(apiRef, 'columnsChange', forceUpdateRenderContext);
    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(function () {
        setVirtualization(!rootProps.disableVirtualization);
    }, [disableVirtualization, autoHeight]);
    /* eslint-enable react-hooks/exhaustive-deps */
}

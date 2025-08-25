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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeView = void 0;
exports.useTreeViewApiInitialization = useTreeViewApiInitialization;
var React = require("react");
var useForkRef_1 = require("@mui/utils/useForkRef");
var corePlugins_1 = require("../corePlugins");
var useExtractPluginParamsFromProps_1 = require("./useExtractPluginParamsFromProps");
var useTreeViewBuildContext_1 = require("./useTreeViewBuildContext");
var TreeViewStore_1 = require("../utils/TreeViewStore");
function initializeInputApiRef(inputApiRef) {
    if (inputApiRef.current == null) {
        inputApiRef.current = {};
    }
    return inputApiRef;
}
function useTreeViewApiInitialization(inputApiRef) {
    var fallbackPublicApiRef = React.useRef({});
    if (inputApiRef) {
        return initializeInputApiRef(inputApiRef);
    }
    return fallbackPublicApiRef;
}
var globalId = 0;
/**
 * This is the main hook that sets the plugin system up for the tree-view.
 *
 * It manages the data used to create the tree-view.
 *
 * @param plugins All the plugins that will be used in the tree-view.
 * @param props The props passed to the tree-view.
 * @param rootRef The ref of the root element.
 */
var useTreeView = function (_a) {
    var inPlugins = _a.plugins, rootRef = _a.rootRef, props = _a.props;
    var plugins = React.useMemo(function () {
        return __spreadArray(__spreadArray([], corePlugins_1.TREE_VIEW_CORE_PLUGINS, true), inPlugins, true);
    }, [inPlugins]);
    var _b = (0, useExtractPluginParamsFromProps_1.useExtractPluginParamsFromProps)({
        plugins: plugins,
        props: props,
    }), pluginParams = _b.pluginParams, forwardedProps = _b.forwardedProps, apiRef = _b.apiRef;
    var instanceRef = React.useRef({});
    var instance = instanceRef.current;
    var publicAPI = useTreeViewApiInitialization(apiRef);
    var innerRootRef = React.useRef(null);
    var handleRootRef = (0, useForkRef_1.default)(innerRootRef, rootRef);
    var storeRef = React.useRef(null);
    if (storeRef.current == null) {
        globalId += 1;
        var initialState_1 = {
            cacheKey: { id: globalId },
        };
        plugins.forEach(function (plugin) {
            if (plugin.getInitialState) {
                Object.assign(initialState_1, plugin.getInitialState(pluginParams));
            }
        });
        storeRef.current = new TreeViewStore_1.TreeViewStore(initialState_1);
    }
    var contextValue = (0, useTreeViewBuildContext_1.useTreeViewBuildContext)({
        plugins: plugins,
        instance: instance,
        publicAPI: publicAPI.current,
        store: storeRef.current,
        rootRef: innerRootRef,
    });
    var rootPropsGetters = [];
    var runPlugin = function (plugin) {
        var pluginResponse = plugin({
            instance: instance,
            params: pluginParams,
            rootRef: innerRootRef,
            plugins: plugins,
            store: storeRef.current,
        });
        if (pluginResponse.getRootProps) {
            rootPropsGetters.push(pluginResponse.getRootProps);
        }
        if (pluginResponse.publicAPI) {
            Object.assign(publicAPI.current, pluginResponse.publicAPI);
        }
        if (pluginResponse.instance) {
            Object.assign(instance, pluginResponse.instance);
        }
    };
    plugins.forEach(runPlugin);
    var getRootProps = function (otherHandlers) {
        if (otherHandlers === void 0) { otherHandlers = {}; }
        var rootProps = __assign(__assign(__assign({ role: 'tree' }, forwardedProps), otherHandlers), { ref: handleRootRef });
        rootPropsGetters.forEach(function (rootPropsGetter) {
            Object.assign(rootProps, rootPropsGetter(otherHandlers));
        });
        return rootProps;
    };
    return {
        getRootProps: getRootProps,
        rootRef: handleRootRef,
        contextValue: contextValue,
    };
};
exports.useTreeView = useTreeView;

"use strict";
'use client';
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
exports.useCharts = useCharts;
exports.useChartApiInitialization = useChartApiInitialization;
var React = require("react");
var useId_1 = require("@mui/utils/useId");
var store_1 = require("@mui/x-internals/store");
var corePlugins_1 = require("../plugins/corePlugins");
var extractPluginParamsFromProps_1 = require("./extractPluginParamsFromProps");
var globalId = 0;
/**
 * This is the main hook that setups the plugin system for the chart.
 *
 * It manages the data used to create the charts.
 *
 * @param inPlugins All the plugins that will be used in the chart.
 * @param props The props passed to the chart.
 */
function useCharts(inPlugins, props) {
    var _a;
    var chartId = (0, useId_1.default)();
    var plugins = React.useMemo(function () {
        return __spreadArray(__spreadArray([], corePlugins_1.CHART_CORE_PLUGINS, true), inPlugins, true);
    }, [inPlugins]);
    var pluginParams = (0, extractPluginParamsFromProps_1.extractPluginParamsFromProps)({
        plugins: plugins,
        props: props,
    });
    pluginParams.id = (_a = pluginParams.id) !== null && _a !== void 0 ? _a : chartId;
    var instanceRef = React.useRef({});
    var instance = instanceRef.current;
    var publicAPI = useChartApiInitialization(props.apiRef);
    var storeRef = React.useRef(null);
    if (storeRef.current == null) {
        // eslint-disable-next-line react-compiler/react-compiler
        globalId += 1;
        var initialState_1 = {
            cacheKey: { id: globalId },
        };
        plugins.forEach(function (plugin) {
            if (plugin.getInitialState) {
                Object.assign(initialState_1, plugin.getInitialState(pluginParams, initialState_1));
            }
        });
        storeRef.current = new store_1.Store(initialState_1);
    }
    var runPlugin = function (plugin) {
        var pluginResponse = plugin({
            instance: instance,
            params: pluginParams,
            plugins: plugins,
            store: storeRef.current,
        });
        if (pluginResponse.publicAPI) {
            Object.assign(publicAPI.current, pluginResponse.publicAPI);
        }
        if (pluginResponse.instance) {
            Object.assign(instance, pluginResponse.instance);
        }
    };
    plugins.forEach(runPlugin);
    var contextValue = React.useMemo(function () { return ({
        store: storeRef.current,
        publicAPI: publicAPI.current,
        instance: instance,
    }); }, [instance, publicAPI]);
    return { contextValue: contextValue };
}
function initializeInputApiRef(inputApiRef) {
    if (inputApiRef.current == null) {
        inputApiRef.current = {};
    }
    return inputApiRef;
}
function useChartApiInitialization(inputApiRef) {
    var fallbackPublicApiRef = React.useRef({});
    if (inputApiRef) {
        return initializeInputApiRef(inputApiRef);
    }
    return fallbackPublicApiRef;
}

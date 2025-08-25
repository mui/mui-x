"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExtractPluginParamsFromProps = void 0;
var React = require("react");
var useExtractPluginParamsFromProps = function (_a) {
    var _b = _a.props, apiRef = _b.apiRef, props = __rest(_b, ["apiRef"]), plugins = _a.plugins;
    var paramsLookup = React.useMemo(function () {
        var tempParamsLookup = {};
        plugins.forEach(function (plugin) {
            Object.assign(tempParamsLookup, plugin.params);
        });
        return tempParamsLookup;
    }, [plugins]);
    var _c = React.useMemo(function () {
        var tempPluginParams = {};
        var tempForwardedProps = {};
        Object.keys(props).forEach(function (propName) {
            var prop = props[propName];
            if (paramsLookup[propName]) {
                tempPluginParams[propName] = prop;
            }
            else {
                tempForwardedProps[propName] = prop;
            }
        });
        var pluginParamsWithDefaults = plugins.reduce(function (acc, plugin) {
            if (plugin.applyDefaultValuesToParams) {
                return plugin.applyDefaultValuesToParams({
                    params: acc,
                });
            }
            return acc;
        }, tempPluginParams);
        return {
            forwardedProps: tempForwardedProps,
            pluginParams: pluginParamsWithDefaults,
        };
    }, [plugins, props, paramsLookup]), forwardedProps = _c.forwardedProps, pluginParams = _c.pluginParams;
    return { forwardedProps: forwardedProps, pluginParams: pluginParams, apiRef: apiRef };
};
exports.useExtractPluginParamsFromProps = useExtractPluginParamsFromProps;

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
exports.extractPluginParamsFromProps = void 0;
var extractPluginParamsFromProps = function (_a) {
    var _b = _a.props, apiRef = _b.apiRef, props = __rest(_b, ["apiRef"]), plugins = _a.plugins;
    var paramsLookup = {};
    plugins.forEach(function (plugin) {
        Object.assign(paramsLookup, plugin.params);
    });
    var pluginParams = {};
    Object.keys(props).forEach(function (propName) {
        var prop = props[propName];
        if (paramsLookup[propName]) {
            pluginParams[propName] = prop;
        }
    });
    var defaultizedPluginParams = plugins.reduce(function (acc, plugin) {
        if (plugin.getDefaultizedParams) {
            return plugin.getDefaultizedParams({ params: acc });
        }
        return acc;
    }, pluginParams);
    return defaultizedPluginParams;
};
exports.extractPluginParamsFromProps = extractPluginParamsFromProps;

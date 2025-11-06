"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCSSVariablesClass = useCSSVariablesClass;
exports.useCSSVariablesContext = useCSSVariablesContext;
exports.GridPortalWrapper = GridPortalWrapper;
exports.GridCSSVariablesContext = GridCSSVariablesContext;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridConfiguration_1 = require("../../hooks/utils/useGridConfiguration");
var CLASSNAME_PREFIX = 'MuiDataGridVariables';
var CSSVariablesContext = React.createContext({
    className: 'unset',
    tag: (0, jsx_runtime_1.jsx)("style", { href: "/unset" }),
});
function useCSSVariablesClass() {
    return React.useContext(CSSVariablesContext).className;
}
function useCSSVariablesContext() {
    return React.useContext(CSSVariablesContext);
}
function GridPortalWrapper(_a) {
    var children = _a.children;
    var className = useCSSVariablesClass();
    return (0, jsx_runtime_1.jsx)("div", { className: className, children: children });
}
function GridCSSVariablesContext(props) {
    var config = (0, useGridConfiguration_1.useGridConfiguration)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var description = config.hooks.useCSSVariables();
    var context = React.useMemo(function () {
        var className = "".concat(CLASSNAME_PREFIX, "-").concat(description.id);
        var cssString = ".".concat(className, "{").concat(variablesToString(description.variables), "}");
        var tag = ((0, jsx_runtime_1.jsx)("style", { href: "/".concat(className), nonce: rootProps.nonce, children: cssString }));
        return { className: className, tag: tag };
    }, [rootProps.nonce, description]);
    return ((0, jsx_runtime_1.jsx)(CSSVariablesContext.Provider, { value: context, children: props.children }));
}
function variablesToString(variables) {
    var output = '';
    for (var key in variables) {
        if (Object.hasOwn(variables, key) && variables[key] !== undefined) {
            output += "".concat(key, ":").concat(variables[key], ";");
        }
    }
    return output;
}

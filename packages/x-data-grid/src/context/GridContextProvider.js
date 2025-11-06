"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridContextProvider = GridContextProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var GridApiContext_1 = require("../components/GridApiContext");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var GridRootPropsContext_1 = require("./GridRootPropsContext");
var GridConfigurationContext_1 = require("../components/GridConfigurationContext");
var GridPanelContext_1 = require("../components/panel/GridPanelContext");
var context_1 = require("../utils/css/context");
function GridContextProvider(_a) {
    var privateApiRef = _a.privateApiRef, configuration = _a.configuration, props = _a.props, children = _a.children;
    var apiRef = React.useRef(privateApiRef.current.getPublicApi());
    return ((0, jsx_runtime_1.jsx)(GridConfigurationContext_1.GridConfigurationContext.Provider, { value: configuration, children: (0, jsx_runtime_1.jsx)(GridRootPropsContext_1.GridRootPropsContext.Provider, { value: props, children: (0, jsx_runtime_1.jsx)(useGridPrivateApiContext_1.GridPrivateApiContext.Provider, { value: privateApiRef, children: (0, jsx_runtime_1.jsx)(GridApiContext_1.GridApiContext.Provider, { value: apiRef, children: (0, jsx_runtime_1.jsx)(GridPanelContext_1.GridPanelContextProvider, { children: (0, jsx_runtime_1.jsx)(context_1.GridCSSVariablesContext, { children: children }) }) }) }) }) }));
}

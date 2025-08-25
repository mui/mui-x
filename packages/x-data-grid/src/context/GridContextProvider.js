"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridContextProvider = GridContextProvider;
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
    return (<GridConfigurationContext_1.GridConfigurationContext.Provider value={configuration}>
      <GridRootPropsContext_1.GridRootPropsContext.Provider value={props}>
        <useGridPrivateApiContext_1.GridPrivateApiContext.Provider value={privateApiRef}>
          <GridApiContext_1.GridApiContext.Provider value={apiRef}>
            <GridPanelContext_1.GridPanelContextProvider>
              <context_1.GridCSSVariablesContext>{children}</context_1.GridCSSVariablesContext>
            </GridPanelContext_1.GridPanelContextProvider>
          </GridApiContext_1.GridApiContext.Provider>
        </useGridPrivateApiContext_1.GridPrivateApiContext.Provider>
      </GridRootPropsContext_1.GridRootPropsContext.Provider>
    </GridConfigurationContext_1.GridConfigurationContext.Provider>);
}

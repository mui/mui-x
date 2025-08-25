"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNoResultsOverlay = void 0;
var React = require("react");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridOverlay_1 = require("./containers/GridOverlay");
exports.GridNoResultsOverlay = (0, forwardRef_1.forwardRef)(function GridNoResultsOverlay(props, ref) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var noResultsOverlayLabel = apiRef.current.getLocaleText('noResultsOverlayLabel');
    return (<GridOverlay_1.GridOverlay {...props} ref={ref}>
        {noResultsOverlayLabel}
      </GridOverlay_1.GridOverlay>);
});

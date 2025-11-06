"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridApiRef = void 0;
var React = require("react");
/**
 * Hook that instantiate a [[GridApiRef]].
 */
var useGridApiRef = function () {
    return React.useRef(null);
};
exports.useGridApiRef = useGridApiRef;

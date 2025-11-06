"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridLogger = useGridLogger;
var React = require("react");
function useGridLogger(privateApiRef, name) {
    var logger = React.useRef(null);
    if (logger.current) {
        return logger.current;
    }
    var newLogger = privateApiRef.current.getLogger(name);
    logger.current = newLogger;
    return newLogger;
}

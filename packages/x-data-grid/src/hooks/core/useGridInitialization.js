"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridInitialization = void 0;
var useGridRefs_1 = require("./useGridRefs");
var useGridIsRtl_1 = require("./useGridIsRtl");
var useGridLoggerFactory_1 = require("./useGridLoggerFactory");
var useGridLocaleText_1 = require("./useGridLocaleText");
var pipeProcessing_1 = require("./pipeProcessing");
var strategyProcessing_1 = require("./strategyProcessing");
var useGridStateInitialization_1 = require("./useGridStateInitialization");
var useGridProps_1 = require("./useGridProps");
/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
var useGridInitialization = function (privateApiRef, props) {
    (0, useGridRefs_1.useGridRefs)(privateApiRef);
    (0, useGridProps_1.useGridProps)(privateApiRef, props);
    (0, useGridIsRtl_1.useGridIsRtl)(privateApiRef);
    (0, useGridLoggerFactory_1.useGridLoggerFactory)(privateApiRef, props);
    (0, useGridStateInitialization_1.useGridStateInitialization)(privateApiRef);
    (0, pipeProcessing_1.useGridPipeProcessing)(privateApiRef);
    (0, strategyProcessing_1.useGridStrategyProcessing)(privateApiRef);
    (0, useGridLocaleText_1.useGridLocaleText)(privateApiRef, props);
    privateApiRef.current.register('private', { rootProps: props });
};
exports.useGridInitialization = useGridInitialization;

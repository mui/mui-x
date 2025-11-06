"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBasicDemoData = void 0;
var React = require("react");
var services_1 = require("../services");
var useBasicDemoData = function (nbRows, nbCols) {
    return React.useMemo(function () { return (0, services_1.getBasicGridData)(nbRows, nbCols); }, [nbRows, nbCols]);
};
exports.useBasicDemoData = useBasicDemoData;

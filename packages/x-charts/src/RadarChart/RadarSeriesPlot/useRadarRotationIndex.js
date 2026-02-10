"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarRotationIndex = useRadarRotationIndex;
var React = require("react");
var useChartPolarAxis_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis");
var getSVGPoint_1 = require("../../internals/getSVGPoint");
var coordinateTransformation_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis/coordinateTransformation");
var getAxisIndex_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis/getAxisIndex");
var useStore_1 = require("../../internals/store/useStore");
var useSvgRef_1 = require("../../hooks/useSvgRef");
var useAxis_1 = require("../../hooks/useAxis");
/**
 * This hook provides a function that from pointer event returns the rotation index.
 * @return {(event: { clientX: number; clientY: number }) => number | null} rotationIndexGetter Returns the rotation data index.
 */
function useRadarRotationIndex() {
    var svgRef = (0, useSvgRef_1.useSvgRef)();
    var store = (0, useStore_1.useStore)();
    var rotationAxis = (0, useAxis_1.useRotationAxis)();
    var center = store.use(useChartPolarAxis_1.selectorChartPolarCenter);
    var rotationIndexGetter = React.useCallback(function rotationIndexGetter(event) {
        var element = svgRef.current;
        if (!element || !rotationAxis) {
            // Should never append
            throw new Error("MUI X Charts: The ".concat(!element ? 'SVG' : 'rotation axis', " was not found to compute radar dataIndex."));
        }
        var svgPoint = (0, getSVGPoint_1.getSVGPoint)(element, event);
        var rotation = (0, coordinateTransformation_1.generateSvg2rotation)(center)(svgPoint.x, svgPoint.y);
        var rotationIndex = (0, getAxisIndex_1.getAxisIndex)(rotationAxis, rotation);
        return rotationIndex;
    }, [center, rotationAxis, svgRef]);
    return rotationIndexGetter;
}

"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlestickPlot = CandlestickPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var hooks_1 = require("@mui/x-charts/hooks");
var useOHLCSeries_1 = require("../hooks/useOHLCSeries");
var useChartCandlestickPosition_selectors_1 = require("../plugins/selectors/useChartCandlestickPosition.selectors");
var useCandlestickPlotData_1 = require("./useCandlestickPlotData");
var useWebGLResizeObserver_1 = require("../utils/webgl/useWebGLResizeObserver");
var ChartsWebGLLayer_1 = require("../ChartsWebGLLayer/ChartsWebGLLayer");
var checkCandlestickScaleErrors_1 = require("./checkCandlestickScaleErrors");
var CandlestickWebGLProgram_1 = require("./CandlestickWebGLProgram");
function CandlestickPlot() {
    return (0, jsx_runtime_1.jsx)(CandlestickWebGLPlot, {});
}
function CandlestickWebGLPlot() {
    var gl = (0, ChartsWebGLLayer_1.useWebGLContext)();
    var series = (0, useOHLCSeries_1.useOHLCSeriesContext)();
    var seriesToDisplay = series === null || series === void 0 ? void 0 : series.series[series.seriesOrder[0]];
    if (!gl || !seriesToDisplay || seriesToDisplay.hidden) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(CandlestickWebGLPlotImpl, { gl: gl, series: seriesToDisplay });
}
function CandlestickWebGLPlotImpl(_a) {
    var gl = _a.gl, series = _a.series;
    var drawingArea = (0, internals_1.useDrawingArea)();
    var xScale = (0, hooks_1.useXScale)();
    var yScale = (0, hooks_1.useYScale)();
    (0, checkCandlestickScaleErrors_1.checkCandlestickScaleErrors)(series.id, xScale);
    var _b = React.useState(null), program = _b[0], setProgram = _b[1];
    var dataLength = series.data.length;
    var renderScheduledRef = React.useRef(false);
    (0, internals_1.useRegisterPointerInteractions)(useChartCandlestickPosition_selectors_1.selectorCandlestickItemAtPosition);
    React.useEffect(function () {
        var prog = new CandlestickWebGLProgram_1.CandlestickWebGLProgram(gl);
        setProgram(prog);
        return function () {
            prog.dispose();
        };
    }, [gl]);
    var render = React.useCallback(function () {
        renderScheduledRef.current = false;
        program === null || program === void 0 ? void 0 : program.render(dataLength);
    }, [program, dataLength]);
    var scheduleRender = React.useCallback(function () {
        renderScheduledRef.current = true;
    }, []);
    // On resize render directly to avoid a frame where the canvas is blank
    (0, useWebGLResizeObserver_1.useWebGLResizeObserver)(render);
    React.useEffect(function () {
        program === null || program === void 0 ? void 0 : program.setResolution(drawingArea.width, drawingArea.height);
        scheduleRender();
    }, [drawingArea.height, drawingArea.width, gl, scheduleRender, program]);
    var candleWidth = xScale.bandwidth();
    React.useEffect(function () {
        program === null || program === void 0 ? void 0 : program.setCandleWidth(candleWidth);
        scheduleRender();
    }, [candleWidth, gl, program, scheduleRender]);
    var plotData = (0, useCandlestickPlotData_1.useCandlestickPlotData)(drawingArea, series, xScale, yScale);
    React.useEffect(function () {
        program === null || program === void 0 ? void 0 : program.plot(plotData);
        scheduleRender();
    }, [gl, plotData, program, scheduleRender]);
    React.useEffect(function () {
        if (renderScheduledRef.current) {
            render();
        }
    });
    return null;
}

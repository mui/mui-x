"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapWebGLPlot = HeatmapWebGLPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var hooks_1 = require("@mui/x-charts/hooks");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var ChartsWebGLLayer_1 = require("../../ChartsWebGLLayer/ChartsWebGLLayer");
var hooks_2 = require("../../hooks");
var shaders_1 = require("./shaders");
var useWebGLResizeObserver_1 = require("../../utils/webgl/useWebGLResizeObserver");
var utils_1 = require("../../utils/webgl/utils");
var useHeatmapPlotData_1 = require("./useHeatmapPlotData");
function HeatmapWebGLPlot(_a) {
    var borderRadius = _a.borderRadius;
    var gl = (0, ChartsWebGLLayer_1.useWebGLContext)();
    var series = (0, hooks_2.useHeatmapSeriesContext)();
    var seriesToDisplay = series === null || series === void 0 ? void 0 : series.series[series.seriesOrder[0]];
    if (!gl || !seriesToDisplay) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(HeatmapWebGLPlotImpl, { gl: gl, borderRadius: borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0, series: seriesToDisplay });
}
function HeatmapWebGLPlotImpl(props) {
    var gl = props.gl, borderRadius = props.borderRadius, series = props.series;
    var drawingArea = (0, hooks_1.useDrawingArea)();
    var xScale = (0, hooks_1.useXScale)();
    var yScale = (0, hooks_1.useYScale)();
    var vertexShader = React.useState(function () {
        return (0, utils_1.compileShader)(gl, shaders_1.heatmapVertexShaderSource, gl.VERTEX_SHADER);
    })[0];
    var program = React.useState(function () {
        var p = gl.createProgram();
        gl.attachShader(p, vertexShader);
        return p;
    })[0];
    var quadBuffer = React.useState(function () { return (0, utils_1.uploadQuadBuffer)(gl); })[0];
    var dataLength = series.data.length;
    var renderScheduledRef = React.useRef(false);
    var render = React.useCallback(function () {
        renderScheduledRef.current = false;
        // Clear and draw
        gl.clearColor(0, 0, 0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLength);
    }, [dataLength, gl]);
    var scheduleRender = React.useCallback(function () {
        renderScheduledRef.current = true;
    }, []);
    // On resize render directly to avoid a frame where the canvas is blank
    (0, useWebGLResizeObserver_1.useWebGLResizeObserver)(render);
    React.useEffect(function () {
        /* Enable blending for transparency
         * These are global to the WebGL context and need to be set only once */
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }, [gl]);
    var width = xScale.bandwidth();
    var height = yScale.bandwidth();
    // A border radius cannot be larger than half the width or height of the rectangle
    var seriesBorderRadius = Math.min(borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0, width / 2, height / 2);
    var lastSeriesBorderRadiusRef = React.useRef(seriesBorderRadius > 0 ? 0 : 1);
    var setupResolutionUniform = React.useCallback(function () {
        gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), drawingArea.width, drawingArea.height);
    }, [drawingArea.height, drawingArea.width, gl, program]);
    var setupBorderRadiusUniform = React.useCallback(function () {
        gl.uniform1f(gl.getUniformLocation(program, 'u_borderRadius'), seriesBorderRadius);
    }, [gl, program, seriesBorderRadius]);
    var setupRectDimensionsUniform = React.useCallback(function () {
        gl.uniform2f(gl.getUniformLocation(program, 'u_dimensions'), width, height);
    }, [gl, height, program, width]);
    var setupUniformsEvent = (0, useEventCallback_1.default)(function () {
        (0, utils_1.bindQuadBuffer)(gl, program, quadBuffer);
        setupBorderRadiusUniform();
        setupResolutionUniform();
        setupRectDimensionsUniform();
    });
    var plotData = (0, useHeatmapPlotData_1.useHeatmapPlotData)(drawingArea, series, xScale, yScale);
    var setupAttributes = React.useCallback(function () {
        var centers = plotData.centers, colors = plotData.colors, saturations = plotData.saturations;
        // Upload rectangle centers
        var centerBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, centers, gl.STATIC_DRAW);
        var aCenter = gl.getAttribLocation(program, 'a_center');
        gl.enableVertexAttribArray(aCenter);
        gl.vertexAttribPointer(aCenter, 2, gl.FLOAT, false, 0, 0);
        // This makes the attribute instanced (one value per rectangle, not per vertex)
        gl.vertexAttribDivisor(aCenter, 1);
        // Upload colors
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        var aColor = gl.getAttribLocation(program, 'a_color');
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(aColor, 1);
        // Upload saturations
        var saturationBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, saturations, gl.STATIC_DRAW);
        var aSaturation = gl.getAttribLocation(program, 'a_saturation');
        gl.enableVertexAttribArray(aSaturation);
        gl.vertexAttribPointer(aSaturation, 1, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(aSaturation, 1);
    }, [gl, plotData, program]);
    var setupAttributesEvent = (0, useEventCallback_1.default)(function () { return setupAttributes(); });
    React.useEffect(function () {
        var _a;
        var shouldAttachNewShader = lastSeriesBorderRadiusRef.current > 0 !== seriesBorderRadius > 0;
        lastSeriesBorderRadiusRef.current = seriesBorderRadius;
        if (shouldAttachNewShader) {
            var shaderSource = seriesBorderRadius > 0
                ? shaders_1.heatmapFragmentShaderSourceWithBorderRadius
                : shaders_1.heatmapFragmentShaderSourceNoBorderRadius;
            (_a = gl.getAttachedShaders(program)) === null || _a === void 0 ? void 0 : _a.forEach(function (shader) {
                var shaderType = gl.getShaderParameter(shader, gl.SHADER_TYPE);
                if (shaderType === gl.FRAGMENT_SHADER) {
                    gl.detachShader(program, shader);
                    gl.deleteShader(shader);
                }
            });
            var fragmentShader = (0, utils_1.attachShader)(gl, program, shaderSource, gl.FRAGMENT_SHADER);
            gl.linkProgram(program);
            // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error("Program linking failed: ".concat(gl.getProgramInfoLog(program)));
                console.error("Vertex shader info-log: ".concat(gl.getShaderInfoLog(vertexShader)));
                console.error("Fragment shader info-log: ".concat(gl.getShaderInfoLog(fragmentShader)));
            }
            // Not a hook
            // eslint-disable-next-line react-compiler/react-compiler
            gl.useProgram(program);
            (0, utils_1.logWebGLErrors)(gl);
            setupUniformsEvent();
            setupAttributesEvent();
        }
        else {
            setupBorderRadiusUniform();
        }
        scheduleRender();
    }, [
        gl,
        program,
        scheduleRender,
        seriesBorderRadius,
        setupBorderRadiusUniform,
        // We use the event callback versions here because we only want this effect to trigger when the border radius changes
        setupAttributesEvent,
        setupUniformsEvent,
        vertexShader,
    ]);
    React.useEffect(function () {
        setupResolutionUniform();
        scheduleRender();
    }, [setupResolutionUniform, scheduleRender]);
    React.useEffect(function () {
        setupRectDimensionsUniform();
        scheduleRender();
    }, [setupRectDimensionsUniform, scheduleRender]);
    React.useEffect(function () {
        setupAttributes();
        scheduleRender();
    }, [scheduleRender, setupAttributes]);
    React.useEffect(function () {
        if (renderScheduledRef.current) {
            render();
        }
    });
    return null;
}

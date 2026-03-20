"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlestickWebGLProgram = void 0;
var utils_1 = require("../utils/webgl/utils");
var candleShaders_1 = require("./candleShaders");
var wickShaders_1 = require("./wickShaders");
var CandlestickWebGLProgram = /** @class */ (function () {
    function CandlestickWebGLProgram(gl) {
        this.gl = gl;
        this.shaders = [];
        /* Enable blending for transparency
         * These are global to the WebGL context and need to be set only once */
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        var candleProg = initializeProgram(this.gl, candleShaders_1.candleVertexShader, candleShaders_1.candleFragmentShader);
        this.candleProgram = candleProg.program;
        this.shaders.push(candleProg.fragmentShader);
        this.shaders.push(candleProg.vertexShader);
        this.candleVao = this.gl.createVertexArray();
        this.candleCentersBuffer = this.gl.createBuffer();
        this.candleHeightsBuffer = this.gl.createBuffer();
        this.candleColorsBuffer = this.gl.createBuffer();
        var wickProg = initializeProgram(this.gl, wickShaders_1.wickVertexShader, wickShaders_1.wickFragmentShader);
        this.wickProgram = wickProg.program;
        this.shaders.push(wickProg.fragmentShader);
        this.shaders.push(wickProg.vertexShader);
        this.wickVao = this.gl.createVertexArray();
        this.wickVerticesBuffer = this.gl.createBuffer();
        this.wickCentersBuffer = this.gl.createBuffer();
        this.wickHeightsBuffer = this.gl.createBuffer();
        this.wickColorsBuffer = this.gl.createBuffer();
    }
    CandlestickWebGLProgram.prototype.setResolution = function (width, height) {
        this.gl.useProgram(this.candleProgram);
        this.gl.uniform2f(this.gl.getUniformLocation(this.candleProgram, 'u_resolution'), width, height);
        this.gl.useProgram(this.wickProgram);
        this.gl.uniform2f(this.gl.getUniformLocation(this.wickProgram, 'u_resolution'), width, height);
    };
    CandlestickWebGLProgram.prototype.setCandleWidth = function (candleWidth) {
        this.gl.useProgram(this.candleProgram);
        this.gl.uniform1f(this.gl.getUniformLocation(this.candleProgram, 'u_candle_width'), candleWidth);
        this.gl.useProgram(this.wickProgram);
        this.gl.uniform1f(this.gl.getUniformLocation(this.wickProgram, 'u_candle_width'), candleWidth);
    };
    CandlestickWebGLProgram.prototype.plot = function (plotData) {
        var candleCenters = plotData.candleCenters, candleHeights = plotData.candleHeights, wickCenters = plotData.wickCenters, wickHeights = plotData.wickHeights, candleColors = plotData.candleColors, wickColors = plotData.wickColors;
        // Setup candle attributes
        this.gl.useProgram(this.candleProgram);
        this.gl.bindVertexArray(this.candleVao);
        (0, utils_1.bindQuadBuffer)(this.gl, this.candleProgram, (0, utils_1.uploadQuadBuffer)(this.gl));
        // Center attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.candleCentersBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, candleCenters, this.gl.STATIC_DRAW);
        var candleCenterLocation = this.gl.getAttribLocation(this.candleProgram, 'a_center');
        this.gl.enableVertexAttribArray(candleCenterLocation);
        this.gl.vertexAttribPointer(candleCenterLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(candleCenterLocation, 1); // One per instance
        // Height attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.candleHeightsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, candleHeights, this.gl.STATIC_DRAW);
        var candleHeightLocation = this.gl.getAttribLocation(this.candleProgram, 'a_height');
        this.gl.enableVertexAttribArray(candleHeightLocation);
        this.gl.vertexAttribPointer(candleHeightLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(candleHeightLocation, 1); // One per instance
        // Color attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.candleColorsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, candleColors, this.gl.STATIC_DRAW);
        var candleColorLocation = this.gl.getAttribLocation(this.candleProgram, 'a_color');
        this.gl.enableVertexAttribArray(candleColorLocation);
        this.gl.vertexAttribPointer(candleColorLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(candleColorLocation, 1); // One per instance
        this.gl.bindVertexArray(null);
        // Setup wick attributes
        this.gl.useProgram(this.wickProgram);
        this.gl.bindVertexArray(this.wickVao);
        var wickVertices = new Float32Array([0, -1, 0, 1]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickVerticesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, wickVertices, this.gl.STATIC_DRAW);
        var aPosition = this.gl.getAttribLocation(this.wickProgram, 'a_position');
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickCentersBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, wickCenters, this.gl.STATIC_DRAW);
        var wickCenterLocation = this.gl.getAttribLocation(this.wickProgram, 'a_center');
        this.gl.enableVertexAttribArray(wickCenterLocation);
        this.gl.vertexAttribPointer(wickCenterLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(wickCenterLocation, 1); // One per instance
        // Height attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickHeightsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, wickHeights, this.gl.STATIC_DRAW);
        var wickHeightLocation = this.gl.getAttribLocation(this.wickProgram, 'a_height');
        this.gl.enableVertexAttribArray(wickHeightLocation);
        this.gl.vertexAttribPointer(wickHeightLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(wickHeightLocation, 1); // One per instance
        // Color attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickColorsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, wickColors, this.gl.STATIC_DRAW);
        var wickColorLocation = this.gl.getAttribLocation(this.wickProgram, 'a_wick_color');
        this.gl.enableVertexAttribArray(wickColorLocation);
        this.gl.vertexAttribPointer(wickColorLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(wickColorLocation, 1); // One per instance
        this.gl.bindVertexArray(null);
    };
    CandlestickWebGLProgram.prototype.render = function (dataLength) {
        // Clear and draw
        this.gl.clearColor(0, 0, 0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.wickProgram);
        (0, utils_1.logWebGLErrors)(this.gl);
        this.gl.bindVertexArray(this.wickVao);
        this.gl.drawArraysInstanced(this.gl.LINES, 0, 2, dataLength * 2);
        this.gl.useProgram(this.candleProgram);
        (0, utils_1.logWebGLErrors)(this.gl);
        this.gl.bindVertexArray(this.candleVao);
        this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, dataLength);
    };
    CandlestickWebGLProgram.prototype.dispose = function () {
        var _this = this;
        this.gl.deleteProgram(this.candleProgram);
        this.gl.deleteVertexArray(this.candleVao);
        this.gl.deleteBuffer(this.candleCentersBuffer);
        this.gl.deleteBuffer(this.candleHeightsBuffer);
        this.gl.deleteBuffer(this.candleColorsBuffer);
        this.gl.deleteProgram(this.wickProgram);
        this.gl.deleteVertexArray(this.wickVao);
        this.gl.deleteBuffer(this.wickVerticesBuffer);
        this.gl.deleteBuffer(this.wickCentersBuffer);
        this.gl.deleteBuffer(this.wickHeightsBuffer);
        this.gl.deleteBuffer(this.wickColorsBuffer);
        this.shaders.forEach(function (shader) { return _this.gl.deleteShader(shader); });
    };
    return CandlestickWebGLProgram;
}());
exports.CandlestickWebGLProgram = CandlestickWebGLProgram;
function initializeProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var program = gl.createProgram();
    var vertexShader = (0, utils_1.compileShader)(gl, vertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = (0, utils_1.compileShader)(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking failed: ".concat(gl.getProgramInfoLog(program)));
        console.error("Vertex shader info-log: ".concat(gl.getShaderInfoLog(vertexShader)));
        console.error("Fragment shader info-log: ".concat(gl.getShaderInfoLog(fragmentShader)));
    }
    return { program: program, vertexShader: vertexShader, fragmentShader: fragmentShader };
}

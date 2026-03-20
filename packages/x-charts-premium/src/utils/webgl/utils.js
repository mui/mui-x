"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileShader = compileShader;
exports.uploadQuadBuffer = uploadQuadBuffer;
exports.bindQuadBuffer = bindQuadBuffer;
exports.attachShader = attachShader;
exports.logWebGLErrors = logWebGLErrors;
function compileShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    return shader;
}
function uploadQuadBuffer(gl) {
    var quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    return buffer;
}
function bindQuadBuffer(gl, program, quadBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    var aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
}
function attachShader(gl, program, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    return shader;
}
/**
 * Logs WebGL errors to the console in development mode.
 */
function logWebGLErrors(gl) {
    /* Only log errors in dev because it has a performance cost:
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_blocking_api_calls_in_production */
    if (process.env.NODE_ENV !== 'production') {
        var error = gl.getError();
        while (error !== gl.NO_ERROR) {
            console.error('WebGL error:', error);
            error = gl.getError();
        }
    }
}

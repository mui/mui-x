"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
var encoder = new TextEncoder();
// bufferLength must be a multiple of 4 to satisfy Int32Array constraints
var bufferLength = 2 * 1024;
var buffer = new ArrayBuffer(bufferLength);
var uint8View = new Uint8Array(buffer);
var int32View = new Int32Array(buffer);
exports.hash = xxh;
/**
 * Returns an xxh hash of `input` formatted as a decimal string.
 */
// prettier-ignore
function xxh(input) {
    /* eslint-disable no-bitwise */
    // Worst-case scenario: full string of 2-byte characters
    var requiredLength = input.length * 2;
    if (requiredLength > bufferLength) {
        // buffer.resize() is only available in recent browsers, so we re-allocate
        // a new and views
        bufferLength = requiredLength + (4 - requiredLength % 4);
        buffer = new ArrayBuffer(bufferLength);
        uint8View = new Uint8Array(buffer);
        int32View = new Int32Array(buffer);
    }
    var length8 = encoder.encodeInto(input, uint8View).written;
    var seed = 0;
    var len = length8 | 0;
    var i = 0;
    var h = (seed + len | 0) + 0x165667B1 | 0;
    if (len < 16) {
        for (; (i + 3 | 0) < len; i = i + 4 | 0) {
            h = Math.imul(rotl32(h + Math.imul(int32View[i] | 0, 0xC2B2AE3D) | 0, 17) | 0, 0x27D4EB2F);
        }
    }
    else {
        var v0 = seed + 0x24234428 | 0;
        var v1 = seed + 0x85EBCA77 | 0;
        var v2 = seed;
        var v3 = seed - 0x9E3779B1 | 0;
        for (; (i + 15 | 0) < len; i = i + 16 | 0) {
            v0 = Math.imul(rotl32(v0 + Math.imul(int32View[i + 0 | 0] | 0, 0x85EBCA77) | 0, 13) | 0, 0x9E3779B1);
            v1 = Math.imul(rotl32(v1 + Math.imul(int32View[i + 4 | 0] | 0, 0x85EBCA77) | 0, 13) | 0, 0x9E3779B1);
            v2 = Math.imul(rotl32(v2 + Math.imul(int32View[i + 8 | 0] | 0, 0x85EBCA77) | 0, 13) | 0, 0x9E3779B1);
            v3 = Math.imul(rotl32(v3 + Math.imul(int32View[i + 12 | 0] | 0, 0x85EBCA77) | 0, 13) | 0, 0x9E3779B1);
        }
        h = (((rotl32(v0, 1) | 0 +
            rotl32(v1, 7) | 0) +
            rotl32(v2, 12) | 0) +
            rotl32(v3, 18) | 0)
            + len | 0;
        for (; (i + 3 | 0) < len; i = i + 4 | 0) {
            h = Math.imul(rotl32(h + Math.imul(int32View[i] | 0, 0xC2B2AE3D) | 0, 17) | 0, 0x27D4EB2F);
        }
    }
    for (; i < len; i = i + 1 | 0) {
        h = Math.imul(rotl32(h + Math.imul(uint8View[i] | 0, 0x165667B1) | 0, 11) | 0, 0x9E3779B1);
    }
    h = Math.imul(h ^ h >>> 15, 0x85EBCA77);
    h = Math.imul(h ^ h >>> 13, 0xC2B2AE3D);
    return ((h ^ h >>> 16) >>> 0).toString();
}
function rotl32(x, r) {
    return (x << r) | (x >>> (32 - r));
}

"use strict";
/**
 * Based on `fast-deep-equal`
 *
 * MIT License
 *
 * Copyright (c) 2017 Evgeny Poberezkin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeepEqual = isDeepEqual;
function isDeepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        if (a.constructor !== b.constructor) {
            return false;
        }
        if (Array.isArray(a)) {
            var length_1 = a.length;
            if (length_1 !== b.length) {
                return false;
            }
            for (var i = 0; i < length_1; i += 1) {
                if (!isDeepEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) {
                return false;
            }
            var entriesA = Array.from(a.entries());
            for (var i = 0; i < entriesA.length; i += 1) {
                if (!b.has(entriesA[i][0])) {
                    return false;
                }
            }
            for (var i = 0; i < entriesA.length; i += 1) {
                var entryA = entriesA[i];
                if (!isDeepEqual(entryA[1], b.get(entryA[0]))) {
                    return false;
                }
            }
            return true;
        }
        if (a instanceof Set && b instanceof Set) {
            if (a.size !== b.size) {
                return false;
            }
            var entries = Array.from(a.entries());
            for (var i = 0; i < entries.length; i += 1) {
                if (!b.has(entries[i][0])) {
                    return false;
                }
            }
            return true;
        }
        if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
            var length_2 = a.length;
            if (length_2 !== b.length) {
                return false;
            }
            for (var i = 0; i < length_2; i += 1) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        }
        if (a.constructor === RegExp) {
            return a.source === b.source && a.flags === b.flags;
        }
        if (a.valueOf !== Object.prototype.valueOf) {
            return a.valueOf() === b.valueOf();
        }
        if (a.toString !== Object.prototype.toString) {
            return a.toString() === b.toString();
        }
        var keys = Object.keys(a);
        var length_3 = keys.length;
        if (length_3 !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < length_3; i += 1) {
            if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
                return false;
            }
        }
        for (var i = 0; i < length_3; i += 1) {
            var key = keys[i];
            if (!isDeepEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    // true if both NaN, false otherwise
    // eslint-disable-next-line no-self-compare
    return a !== a && b !== b;
}

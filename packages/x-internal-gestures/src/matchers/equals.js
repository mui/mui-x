"use strict";
/* eslint-disable */
/*
Copyright (c) 2008-2016 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFakeState = void 0;
var getFakeState = function () {
    return ({
        isNot: false,
        equals: equals,
    });
};
exports.getFakeState = getFakeState;
// Extracted out of https://github.com/vitest-dev/vitest/blob/c5ac9859d4e94394e470f559c1fb7288698842e3/packages/expect/src/types.ts
function equals(a, b, customTesters, strictCheck) {
    customTesters = customTesters || [];
    return eq(a, b, [], [], customTesters, strictCheck ? hasKey : hasDefinedKey);
}
function isAsymmetric(obj) {
    return (!!obj &&
        typeof obj === 'object' &&
        'asymmetricMatch' in obj &&
        isA('Function', obj.asymmetricMatch));
}
function asymmetricMatch(a, b) {
    var asymmetricA = isAsymmetric(a);
    var asymmetricB = isAsymmetric(b);
    if (asymmetricA && asymmetricB) {
        return undefined;
    }
    if (asymmetricA) {
        return a.asymmetricMatch(b);
    }
    if (asymmetricB) {
        return b.asymmetricMatch(a);
    }
}
function eq(a, b, aStack, bStack, customTesters, hasKey) {
    var result = true;
    var asymmetricResult = asymmetricMatch(a, b);
    if (asymmetricResult !== undefined) {
        return asymmetricResult;
    }
    var testerContext = { equals: equals };
    for (var i = 0; i < customTesters.length; i++) {
        var customTesterResult = customTesters[i].call(testerContext, a, b, customTesters);
        if (customTesterResult !== undefined) {
            return customTesterResult;
        }
    }
    if (typeof URL === 'function' && a instanceof URL && b instanceof URL) {
        return a.href === b.href;
    }
    if (Object.is(a, b)) {
        return true;
    }
    // A strict comparison is necessary because `null == undefined`.
    if (a === null || b === null) {
        return a === b;
    }
    var className = Object.prototype.toString.call(a);
    if (className !== Object.prototype.toString.call(b)) {
        return false;
    }
    switch (className) {
        case '[object Boolean]':
        case '[object String]':
        case '[object Number]':
            if (typeof a !== typeof b) {
                // One is a primitive, one a `new Primitive()`
                return false;
            }
            if (typeof a !== 'object' && typeof b !== 'object') {
                // both are proper primitives
                return Object.is(a, b);
            }
            // both are `new Primitive()`s
            return Object.is(a.valueOf(), b.valueOf());
        case '[object Date]': {
            var numA = +a;
            var numB = +b;
            // Coerce dates to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are equivalent.
            return numA === numB || (Number.isNaN(numA) && Number.isNaN(numB));
        }
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
            return a.source === b.source && a.flags === b.flags;
        case '[object Temporal.Instant]':
        case '[object Temporal.ZonedDateTime]':
        case '[object Temporal.PlainDateTime]':
        case '[object Temporal.PlainDate]':
        case '[object Temporal.PlainTime]':
        case '[object Temporal.PlainYearMonth]':
        case '[object Temporal.PlainMonthDay]':
            return a.equals(b);
        case '[object Temporal.Duration]':
            return a.toString() === b.toString();
    }
    if (typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }
    // Use DOM3 method isEqualNode (IE>=9)
    if (isDomNode(a) && isDomNode(b)) {
        return a.isEqualNode(b);
    }
    // Used to detect circular references.
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        // circular references at same depth are equal
        // circular reference is not equal to non-circular one
        if (aStack[length] === a) {
            return bStack[length] === b;
        }
        if (bStack[length] === b) {
            return false;
        }
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    // Compare array lengths to determine if a deep comparison is necessary.
    if (className === '[object Array]' && a.length !== b.length) {
        return false;
    }
    if (a instanceof Error && b instanceof Error) {
        aStack.pop();
        bStack.pop();
    }
    // Deep compare objects.
    var aKeys = keys(a, hasKey);
    var key;
    var size = aKeys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (keys(b, hasKey).length !== size) {
        return false;
    }
    while (size--) {
        key = aKeys[size];
        // Deep compare each member
        result = hasKey(b, key) && eq(a[key], b[key], aStack, bStack, customTesters, hasKey);
        if (!result) {
            return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
}
function keys(obj, hasKey) {
    var keys = [];
    for (var key in obj) {
        if (hasKey(obj, key)) {
            keys.push(key);
        }
    }
    return keys.concat(Object.getOwnPropertySymbols(obj).filter(function (symbol) { return Object.getOwnPropertyDescriptor(obj, symbol).enumerable; }));
}
function hasDefinedKey(obj, key) {
    return hasKey(obj, key) && obj[key] !== undefined;
}
function hasKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function isA(typeName, value) {
    return Object.prototype.toString.apply(value) === "[object ".concat(typeName, "]");
}
function isDomNode(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'nodeType' in obj &&
        typeof obj.nodeType === 'number' &&
        'nodeName' in obj &&
        typeof obj.nodeName === 'string' &&
        'isEqualNode' in obj &&
        typeof obj.isEqualNode === 'function');
}

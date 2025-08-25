"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeClonable = void 0;
var core_1 = require("../../core");
var messages_1 = require("../messages");
var toBeClonable = function toBeClonable(received, expected) {
    // Check if the matcher is being used with .not and throw an error since it's not supported
    if (this.isNot) {
        throw new Error(messages_1.messages.negationError('toBeClonable'));
    }
    // Validate inputs
    if (!received) {
        return {
            pass: false,
            message: messages_1.messages.invalidClass,
        };
    }
    if (expected !== null && expected !== undefined && typeof expected !== 'object') {
        return {
            pass: false,
            message: function () { return messages_1.messages.invalidObjectParam('options'); },
        };
    }
    // eslint-disable-next-line new-cap
    var original = new received({ name: 'beClonable' });
    var overrides = expected;
    var clone = original.clone(overrides);
    // Check that the clone is a different instance
    var isNotSameInstance = original !== clone;
    var isInstanceOfGesture = clone instanceof core_1.Gesture;
    // Check that overridden properties were applied
    var overridesApplied = true;
    if (overrides) {
        for (var key in overrides) {
            if (Reflect.has(clone, key)) {
                // @ts-expect-error, we checked that the key exists
                var valueMatches = this.equals(clone[key], overrides[key]);
                if (!valueMatches) {
                    overridesApplied = false;
                    break;
                }
            }
        }
    }
    // Check that non-overridden properties match the original
    var nonOverriddenPropertiesMatch = true;
    for (var key in original) {
        // Skip checking overridden properties and functions
        if (overrides && key in overrides) {
            continue;
        }
        // @ts-expect-error, its ok if original[key] = undefined
        if (typeof original[key] === 'function') {
            continue;
        }
        if (Reflect.has(clone, key)) {
            // @ts-expect-error, we checked that the key exists
            var valueMatches = this.equals(clone[key], original[key]);
            if (!valueMatches) {
                nonOverriddenPropertiesMatch = false;
                break;
            }
        }
    }
    var pass = isNotSameInstance && isInstanceOfGesture && overridesApplied && nonOverriddenPropertiesMatch;
    if (pass) {
        return {
            pass: true,
            message: function () { return "Expected gesture not to be clonable, but it was."; },
        };
    }
    return {
        pass: false,
        message: function () {
            if (!isInstanceOfGesture) {
                return 'Expected clone to be an instance of Gesture, but it is not.';
            }
            if (!overridesApplied) {
                return 'Expected clone to have overridden properties applied, but it does not.';
            }
            if (!nonOverriddenPropertiesMatch) {
                return 'Expected non-overridden properties to match the original, but they do not.';
            }
            return 'Expected clone to be a different instance than the original, but they are the same.';
        },
    };
};
exports.toBeClonable = toBeClonable;

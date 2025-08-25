"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpdateState = void 0;
var core_1 = require("../../core");
var ActiveGesturesRegistry_1 = require("../../core/ActiveGesturesRegistry");
var messages_1 = require("../messages");
var toUpdateState = function toUpdateState(received, expected) {
    // Check if the matcher is being used with .not and throw an error since it's not supported
    if (this.isNot) {
        throw new Error(messages_1.messages.negationError('toUpdateState'));
    }
    // Validate inputs
    if (!received) {
        return {
            pass: false,
            message: messages_1.messages.invalidClass,
        };
    }
    if (!expected || typeof expected !== 'object' || Object.keys(expected).length === 0) {
        return {
            pass: false,
            message: function () { return messages_1.messages.invalidOrEmptyObjectParam('state'); },
        };
    }
    // eslint-disable-next-line new-cap
    var original = new received({ name: 'updateState' });
    // eslint-disable-next-line new-cap
    var clone = new received({ name: 'updateState' });
    var expectedState = expected;
    var target = document.createElement('div');
    document.body.appendChild(target);
    var pointerManager = new core_1.PointerManager({});
    var gestureRegistry = new ActiveGesturesRegistry_1.ActiveGesturesRegistry();
    var keyboardManager = new core_1.KeyboardManager();
    // Setup the environment for testing
    clone.init(target, pointerManager, gestureRegistry, keyboardManager);
    // Create and dispatch the change state event
    var changeStateEvent = new CustomEvent("".concat(clone.name, "ChangeState"), {
        detail: expectedState,
    });
    target.dispatchEvent(changeStateEvent);
    var actualStateValues = {};
    var originalStateValues = {};
    // Track which keys didn't update correctly
    var incorrectKeys = [];
    // @ts-expect-error, accessing protected property for testing
    var cloneState = clone.state;
    // @ts-expect-error, accessing protected property for testing
    var originalState = original.state;
    // Only compare keys that are in the expected state
    for (var key in expectedState) {
        if (Reflect.has(cloneState, key)) {
            // @ts-expect-error, we checked that the key exists
            actualStateValues[key] = cloneState[key];
            // @ts-expect-error, we don't care if the key exists
            originalStateValues[key] = originalState[key];
            // Track keys that didn't update as expected
            // @ts-expect-error, we checked that the key exists
            if (!this.equals(cloneState[key], expectedState[key])) {
                incorrectKeys.push(key);
            }
        }
    }
    // Clean up
    clone.destroy();
    document.body.removeChild(target);
    var hasUpdated = this.equals(actualStateValues, expectedState);
    var isSameAsOriginal = this.equals(originalStateValues, expectedState);
    var pass = hasUpdated && !isSameAsOriginal;
    // If pass, we set the message if the "not" condition is true
    if (pass) {
        return {
            pass: true,
            message: function () { return 'Expected state not to be updatable to the specified values, but it was.'; },
            actual: actualStateValues,
            expected: expectedState,
        };
    }
    return {
        pass: false,
        message: function () {
            if (isSameAsOriginal) {
                return 'Expected state to be updated, but it remained the same as the original.';
            }
            return 'Expected state to be updated to the specified values, but it was not.';
        },
        actual: actualStateValues,
        expected: expectedState,
    };
};
exports.toUpdateState = toUpdateState;

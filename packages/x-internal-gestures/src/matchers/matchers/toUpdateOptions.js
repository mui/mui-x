"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpdateOptions = void 0;
var core_1 = require("../../core");
var ActiveGesturesRegistry_1 = require("../../core/ActiveGesturesRegistry");
var messages_1 = require("../messages");
var toUpdateOptions = function toUpdateOptions(received, expected) {
    // Check if the matcher is being used with .not and throw an error since it's not supported
    if (this.isNot) {
        throw new Error(messages_1.messages.negationError('toUpdateOptions'));
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
            message: function () { return messages_1.messages.invalidOrEmptyObjectParam('options'); },
        };
    }
    // eslint-disable-next-line new-cap
    var original = new received({ name: 'updateOptions' });
    // eslint-disable-next-line new-cap
    var clone = new received({ name: 'updateOptions' });
    var expectedOptions = expected;
    var target = document.createElement('div');
    document.body.appendChild(target);
    var pointerManager = new core_1.PointerManager({});
    var gestureRegistry = new ActiveGesturesRegistry_1.ActiveGesturesRegistry();
    var keyboardManager = new core_1.KeyboardManager();
    // Setup the environment for testing
    clone.init(target, pointerManager, gestureRegistry, keyboardManager);
    // Create and dispatch the change options event
    var changeOptionsEvent = new CustomEvent("".concat(clone.name, "ChangeOptions"), {
        detail: expectedOptions,
    });
    target.dispatchEvent(changeOptionsEvent);
    // Collect actual and original option values
    var actualOptions = {};
    var originalOptions = {};
    // Track which keys didn't update correctly
    var incorrectKeys = [];
    for (var key in expectedOptions) {
        if (Reflect.has(clone, key)) {
            // @ts-expect-error, we checked that the key exists
            actualOptions[key] = clone[key];
            // @ts-expect-error, we don't care if the key exists
            originalOptions[key] = original[key];
            // Track keys that didn't update as expected
            // @ts-expect-error, we checked that the key exists
            if (!this.equals(clone[key], expectedOptions[key])) {
                incorrectKeys.push(key);
            }
        }
    }
    // Clean up
    clone.destroy();
    document.body.removeChild(target);
    var hasUpdated = this.equals(actualOptions, expectedOptions);
    var isSameAsOriginal = this.equals(originalOptions, expectedOptions);
    var pass = hasUpdated && !isSameAsOriginal;
    // If pass, we set the message if the "not" condition is true
    if (pass) {
        return {
            pass: true,
            message: function () { return 'Expected options not to be updatable to the specified values, but they were.'; },
            actual: actualOptions,
            expected: expectedOptions,
        };
    }
    return {
        pass: false,
        message: function () {
            if (isSameAsOriginal) {
                return 'Expected options to be updated, but they remained the same as the original.';
            }
            return 'Expected options to be updated to the specified values, but they were not.';
        },
        actual: actualOptions,
        expected: expectedOptions,
    };
};
exports.toUpdateOptions = toUpdateOptions;

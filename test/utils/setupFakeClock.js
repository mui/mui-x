"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeClock = void 0;
exports.setupFakeClock = setupFakeClock;
exports.restoreFakeClock = restoreFakeClock;
var sinon_1 = require("sinon");
// Use a "real timestamp" so that we see a useful date instead of "00:00"
var DEFAULT_TIMESTAMP = 'Mon Aug 18 14:11:54 2014 -0500';
setupFakeClock();
function setupFakeClock(shouldAdvanceTime) {
    if (shouldAdvanceTime === void 0) { shouldAdvanceTime = true; }
    restoreFakeClock();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    exports.fakeClock = (0, sinon_1.useFakeTimers)({
        now: new Date(DEFAULT_TIMESTAMP).getTime(),
        // We need to let time advance to use `useDemoData`, but on the pickers
        // test it makes the tests flaky
        shouldAdvanceTime: shouldAdvanceTime,
    });
    return restoreFakeClock;
}
function restoreFakeClock() {
    if (exports.fakeClock) {
        exports.fakeClock.runToLast();
        exports.fakeClock.restore();
        exports.fakeClock = undefined;
    }
}

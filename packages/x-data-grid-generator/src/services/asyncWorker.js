"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = asyncWorker;
function asyncWorker(_a) {
    var work = _a.work, tasks = _a.tasks, done = _a.done;
    var myNonEssentialWork = function (deadline) {
        // If there is a surplus time in the frame, or timeout
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.current > 0) {
            work();
        }
        if (tasks.current > 0) {
            requestIdleCallback(myNonEssentialWork);
        }
        else {
            done();
        }
    };
    // Don't use requestIdleCallback if the time is mock, better to run synchronously in such case.
    if (typeof requestIdleCallback === 'function' && !requestIdleCallback.clock) {
        requestIdleCallback(myNonEssentialWork);
    }
    else {
        while (tasks.current > 0) {
            work();
        }
        done();
    }
}

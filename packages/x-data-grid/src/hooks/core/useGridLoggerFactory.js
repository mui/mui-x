"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridLoggerFactory = void 0;
var React = require("react");
var utils_1 = require("../../utils/utils");
var utils_2 = require("../utils");
var forceDebug = (0, utils_1.localStorageAvailable)() && window.localStorage.getItem('DEBUG') != null;
var noop = function () { };
var noopLogger = {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
};
var LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
function getAppender(name, logLevel, appender) {
    if (appender === void 0) { appender = console; }
    var minLogLevelIdx = LOG_LEVELS.indexOf(logLevel);
    if (minLogLevelIdx === -1) {
        throw new Error("MUI X: Log level ".concat(logLevel, " not recognized."));
    }
    var logger = LOG_LEVELS.reduce(function (loggerObj, method, idx) {
        if (idx >= minLogLevelIdx) {
            loggerObj[method] = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var message = args[0], other = args.slice(1);
                (_a = appender)[method].apply(_a, __spreadArray(["MUI X: ".concat(name, " - ").concat(message)], other, false));
            };
        }
        else {
            loggerObj[method] = noop;
        }
        return loggerObj;
    }, {});
    return logger;
}
var useGridLoggerFactory = function (apiRef, props) {
    var getLogger = React.useCallback(function (name) {
        if (forceDebug) {
            return getAppender(name, 'debug', props.logger);
        }
        if (!props.logLevel) {
            return noopLogger;
        }
        return getAppender(name, props.logLevel.toString(), props.logger);
    }, [props.logLevel, props.logger]);
    (0, utils_2.useGridApiMethod)(apiRef, { getLogger: getLogger }, 'private');
};
exports.useGridLoggerFactory = useGridLoggerFactory;

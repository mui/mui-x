"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeGregorianAdapter = void 0;
var createDescribe_1 = require("@mui/internal-test-utils/createDescribe");
var testCalculations_1 = require("./testCalculations");
var testLocalization_1 = require("./testLocalization");
var testFormat_1 = require("./testFormat");
function innerGregorianDescribeAdapter(Adapter, params) {
    var _a;
    var prepareAdapter = (_a = params.prepareAdapter) !== null && _a !== void 0 ? _a : (function (adapter) { return adapter; });
    var adapter = new Adapter();
    var adapterTZ = params.dateLibInstanceWithTimezoneSupport
        ? new Adapter({
            dateLibInstance: params.dateLibInstanceWithTimezoneSupport,
        })
        : new Adapter();
    var adapterFr = new Adapter({
        locale: params.frenchLocale,
        dateLibInstance: params.dateLibInstanceWithTimezoneSupport,
    });
    prepareAdapter(adapter);
    prepareAdapter(adapterTZ);
    describe(adapter.lib, function () {
        var testSuitParams = __assign(__assign({}, params), { adapter: adapter, adapterTZ: adapterTZ, adapterFr: adapterFr });
        (0, testCalculations_1.testCalculations)(testSuitParams);
        (0, testLocalization_1.testLocalization)(testSuitParams);
        (0, testFormat_1.testFormat)(testSuitParams);
    });
}
exports.describeGregorianAdapter = (0, createDescribe_1.default)('Adapter methods', innerGregorianDescribeAdapter);

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
exports.describeAdapters = void 0;
var moment_1 = require("moment");
var moment_timezone_1 = require("moment-timezone");
var createDescribe_1 = require("@mui/internal-test-utils/createDescribe");
var pickers_1 = require("test/utils/pickers");
var ADAPTERS = ['dayjs', 'date-fns', 'luxon', 'moment'];
function innerDescribeAdapters(title, FieldComponent, testRunner) {
    ADAPTERS.forEach(function (adapterName) {
        // TODO: Set locale moment before the 1st test run
        if (adapterName === 'moment') {
            moment_1.default.locale('en');
        }
        describe("".concat(title, " - adapter: ").concat(adapterName), function () {
            var pickerRendererResponse = (0, pickers_1.createPickerRenderer)({
                adapterName: adapterName,
                clockConfig: new Date(2022, 5, 15),
                instance: adapterName === 'moment' ? moment_timezone_1.default : undefined,
            });
            var fieldInteractions = (0, pickers_1.buildFieldInteractions)({
                render: pickerRendererResponse.render,
                Component: FieldComponent,
            });
            testRunner(__assign(__assign({}, pickerRendererResponse), fieldInteractions));
        });
    });
}
exports.describeAdapters = (0, createDescribe_1.default)('Adapter specific tests', innerDescribeAdapters);

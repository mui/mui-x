"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapterToUse = exports.AdapterClassToUse = exports.availableAdapters = void 0;
var AdapterDateFns_1 = require("@mui/x-date-pickers/AdapterDateFns");
var AdapterDayjs_1 = require("@mui/x-date-pickers/AdapterDayjs");
var AdapterLuxon_1 = require("@mui/x-date-pickers/AdapterLuxon");
var AdapterMoment_1 = require("@mui/x-date-pickers/AdapterMoment");
// import { AdapterJsJoda } from '@mui/x-date-pickers/AdapterJsJoda';
var AdapterMomentHijri_1 = require("@mui/x-date-pickers/AdapterMomentHijri");
var AdapterMomentJalaali_1 = require("@mui/x-date-pickers/AdapterMomentJalaali");
var AdapterDateFnsJalali_1 = require("@mui/x-date-pickers/AdapterDateFnsJalali");
exports.availableAdapters = {
    'date-fns': AdapterDateFns_1.AdapterDateFns,
    dayjs: AdapterDayjs_1.AdapterDayjs,
    luxon: AdapterLuxon_1.AdapterLuxon,
    moment: AdapterMoment_1.AdapterMoment,
    'moment-hijri': AdapterMomentHijri_1.AdapterMomentHijri,
    'moment-jalaali': AdapterMomentJalaali_1.AdapterMomentJalaali,
    'date-fns-jalali': AdapterDateFnsJalali_1.AdapterDateFnsJalali,
    // 'js-joda': AdapterJsJoda,
};
var AdapterClassToExtend = exports.availableAdapters['date-fns'];
// Check if we are in unit tests
if (/jsdom/.test(window.navigator.userAgent)) {
    // Add parameter `--date-adapter luxon` to use AdapterLuxon for running tests
    // adapter available : date-fns (default one), dayjs, luxon, moment
    var args = process.argv.slice(2);
    var flagIndex = args.findIndex(function (element) { return element === '--date-adapter'; });
    if (flagIndex !== -1 && flagIndex + 1 < args.length) {
        var potentialAdapter = args[flagIndex + 1];
        if (potentialAdapter) {
            if (exports.availableAdapters[potentialAdapter]) {
                AdapterClassToExtend = exports.availableAdapters[potentialAdapter];
            }
            else {
                var supportedAdapters = Object.keys(exports.availableAdapters);
                var message = "Error: Invalid --date-adapter value \"".concat(potentialAdapter, "\". Supported date adapters: ").concat(supportedAdapters
                    .map(function (key) { return "\"".concat(key, "\""); })
                    .join(', '));
                // eslint-disable-next-line no-console
                console.log(message); // log message explicitly, because error message gets swallowed by mocha
                throw new Error(message);
            }
        }
    }
}
var AdapterClassToUse = /** @class */ (function (_super) {
    __extends(AdapterClassToUse, _super);
    function AdapterClassToUse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AdapterClassToUse;
}(AdapterClassToExtend));
exports.AdapterClassToUse = AdapterClassToUse;
exports.adapterToUse = new AdapterClassToUse();

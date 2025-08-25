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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPickerRenderer = createPickerRenderer;
var React = require("react");
var LocalizationProvider_1 = require("@mui/x-date-pickers/LocalizationProvider");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var vitest_1 = require("vitest");
var adapters_1 = require("./adapters");
function createPickerRenderer(_a) {
    if (_a === void 0) { _a = {}; }
    var locale = _a.locale, adapterName = _a.adapterName, instance = _a.instance, clockConfig = _a.clockConfig, createRendererOptions = __rest(_a, ["locale", "adapterName", "instance", "clockConfig"]);
    var clientRender = (0, internal_test_utils_1.createRenderer)(__assign({}, createRendererOptions)).render;
    beforeEach(function () {
        if (clockConfig) {
            vitest_1.vi.setSystemTime(clockConfig);
        }
    });
    afterEach(function () {
        if (clockConfig) {
            vitest_1.vi.useRealTimers();
        }
    });
    var adapterLocale = [
        'date-fns',
        'date-fns-jalali',
        // 'js-joda'
    ].includes(adapterName !== null && adapterName !== void 0 ? adapterName : adapters_1.adapterToUse.lib)
        ? locale
        : locale === null || locale === void 0 ? void 0 : locale.code;
    if (typeof adapterLocale === 'string' && adapterLocale.length > 2) {
        adapterLocale = adapterLocale.slice(0, 2);
    }
    var adapter = adapterName
        ? new adapters_1.availableAdapters[adapterName]({ locale: adapterLocale, instance: instance })
        : new adapters_1.AdapterClassToUse({ locale: adapterLocale, instance: instance });
    function Wrapper(_a) {
        var children = _a.children;
        return (<LocalizationProvider_1.LocalizationProvider adapterLocale={adapterLocale} dateAdapter={adapterName ? adapters_1.availableAdapters[adapterName] : adapters_1.AdapterClassToUse}>
        {children}
      </LocalizationProvider_1.LocalizationProvider>);
    }
    return {
        render: function (node, options) {
            return clientRender(node, __assign(__assign({}, options), { wrapper: Wrapper }));
        },
        adapter: adapter,
    };
}

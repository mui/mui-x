"use strict";
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
exports.createSchedulerRenderer = createSchedulerRenderer;
var internal_test_utils_1 = require("@mui/internal-test-utils");
var vitest_1 = require("vitest");
function createSchedulerRenderer(_a) {
    if (_a === void 0) { _a = {}; }
    var clockConfig = _a.clockConfig, createRendererOptions = __rest(_a, ["clockConfig"]);
    var clientRender = (0, internal_test_utils_1.createRenderer)(createRendererOptions).render;
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
    return {
        render: function (node, options) {
            return clientRender(node, options);
        },
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var toBeClonable_1 = require("./matchers/toBeClonable");
var toUpdateOptions_1 = require("./matchers/toUpdateOptions");
var toUpdateState_1 = require("./matchers/toUpdateState");
vitest_1.expect.extend({
    toUpdateOptions: toUpdateOptions_1.toUpdateOptions,
    toBeClonable: toBeClonable_1.toBeClonable,
    toUpdateState: toUpdateState_1.toUpdateState,
});

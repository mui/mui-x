"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var muiXTelemetrySettings = {
    enableDebug: function () {
        (0, config_1.setTelemetryEnvConfigValue)('DEBUG', true);
    },
    enableTelemetry: function () {
        (0, config_1.setTelemetryEnvConfigValue)('IS_COLLECTING', true);
    },
    disableTelemetry: function () {
        (0, config_1.setTelemetryEnvConfigValue)('IS_COLLECTING', false);
    },
};
exports.default = muiXTelemetrySettings;

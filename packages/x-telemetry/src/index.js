"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.muiXTelemetrySettings = exports.sendMuiXTelemetryEvent = exports.muiXTelemetryEvents = void 0;
var events_1 = require("./runtime/events");
exports.muiXTelemetryEvents = events_1.default;
var sender_1 = require("./runtime/sender");
var settings_1 = require("./runtime/settings");
var noop = function () { };
// To cut unused imports in production as early as possible
var sendMuiXTelemetryEvent = process.env.NODE_ENV === 'production' ? noop : sender_1.default;
exports.sendMuiXTelemetryEvent = sendMuiXTelemetryEvent;
// To cut unused imports in production as early as possible
var muiXTelemetrySettings = process.env.NODE_ENV === 'production'
    ? {
        enableDebug: noop,
        enableTelemetry: noop,
        disableTelemetry: noop,
    }
    : settings_1.default;
exports.muiXTelemetrySettings = muiXTelemetrySettings;

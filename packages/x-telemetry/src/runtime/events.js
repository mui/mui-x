"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noop = function () { return null; };
var muiXTelemetryEvents = {
    licenseVerification: process.env.NODE_ENV === 'production'
        ? noop
        : function (context, payload) { return ({
            eventName: 'licenseVerification',
            payload: payload,
            context: context,
        }); },
};
exports.default = muiXTelemetryEvents;

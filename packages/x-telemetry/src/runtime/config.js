"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTelemetryEnvConfig = getTelemetryEnvConfig;
exports.getTelemetryEnvConfigValue = getTelemetryEnvConfigValue;
exports.setTelemetryEnvConfigValue = setTelemetryEnvConfigValue;
var envEnabledValues = ['1', 'true', 'yes', 'y'];
var envDisabledValues = ['0', 'false', 'no', 'n'];
function getBooleanEnv(value) {
    if (!value) {
        return undefined;
    }
    if (envEnabledValues.includes(value)) {
        return true;
    }
    if (envDisabledValues.includes(value)) {
        return false;
    }
    return undefined;
}
function getBooleanEnvFromEnvObject(envKey, envObj) {
    var _a;
    var keys = Object.keys(envObj);
    for (var i = 0; i < keys.length; i += 1) {
        var key = keys[i];
        if (!key.endsWith(envKey)) {
            continue;
        }
        var value = getBooleanEnv((_a = envObj[key]) === null || _a === void 0 ? void 0 : _a.toLowerCase());
        if (typeof value === 'boolean') {
            return value;
        }
    }
    return undefined;
}
function getIsTelemetryCollecting() {
    // Check global variable
    // eslint-disable-next-line no-underscore-dangle
    var globalValue = globalThis.__MUI_X_TELEMETRY_DISABLED__;
    if (typeof globalValue === 'boolean') {
        // If disabled=true, telemetry is disabled
        // If disabled=false, telemetry is enabled
        return !globalValue;
    }
    try {
        if (typeof process !== 'undefined' && process.env && typeof process.env === 'object') {
            var result = getBooleanEnvFromEnvObject('MUI_X_TELEMETRY_DISABLED', process.env);
            if (typeof result === 'boolean') {
                // If disabled=true, telemetry is disabled
                // If disabled=false, telemetry is enabled
                return !result;
            }
        }
    }
    catch (_) {
        // If there is an error, return the default value
    }
    try {
        // e.g. Vite.js
        // eslint-disable-next-line global-require
        var importMetaEnv = require('./config.import-meta').importMetaEnv;
        if (importMetaEnv) {
            var result = getBooleanEnvFromEnvObject('MUI_X_TELEMETRY_DISABLED', importMetaEnv);
            if (typeof result === 'boolean') {
                // If disabled=true, telemetry is disabled
                // If disabled=false, telemetry is enabled
                return !result;
            }
        }
    }
    catch (_) {
        // If there is an error, return the default value
    }
    try {
        // Some build tools replace env variables on compilation
        // e.g. Next.js, webpack EnvironmentPlugin
        var envValue = process.env.MUI_X_TELEMETRY_DISABLED ||
            process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED ||
            process.env.GATSBY_MUI_X_TELEMETRY_DISABLED ||
            process.env.REACT_APP_MUI_X_TELEMETRY_DISABLED ||
            process.env.PUBLIC_MUI_X_TELEMETRY_DISABLED;
        var result = getBooleanEnv(envValue);
        if (typeof result === 'boolean') {
            // If disabled=true, telemetry is disabled
            // If disabled=false, telemetry is enabled
            return !result;
        }
    }
    catch (_) {
        // If there is an error, return the default value
    }
    return undefined;
}
function getIsDebugModeEnabled() {
    try {
        // Check global variable
        // eslint-disable-next-line no-underscore-dangle
        var globalValue = globalThis.__MUI_X_TELEMETRY_DEBUG__;
        if (typeof globalValue === 'boolean') {
            return globalValue;
        }
        if (typeof process !== 'undefined' && process.env && typeof process.env === 'object') {
            var result = getBooleanEnvFromEnvObject('MUI_X_TELEMETRY_DEBUG', process.env);
            if (typeof result === 'boolean') {
                return result;
            }
        }
        // e.g. Webpack EnvironmentPlugin
        if (process.env.MUI_X_TELEMETRY_DEBUG) {
            var result = getBooleanEnv(process.env.MUI_X_TELEMETRY_DEBUG);
            if (typeof result === 'boolean') {
                return result;
            }
        }
    }
    catch (_) {
        // If there is an error, return the default value
    }
    try {
        // e.g. Vite.js
        // eslint-disable-next-line global-require
        var importMetaEnv = require('./config.import-meta').importMetaEnv;
        if (importMetaEnv) {
            var result = getBooleanEnvFromEnvObject('MUI_X_TELEMETRY_DEBUG', importMetaEnv);
            if (typeof result === 'boolean') {
                return result;
            }
        }
    }
    catch (_) {
        // If there is an error, return the default value
    }
    try {
        // e.g. Next.js, webpack EnvironmentPlugin
        var envValue = process.env.MUI_X_TELEMETRY_DEBUG ||
            process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_DEBUG ||
            process.env.GATSBY_MUI_X_TELEMETRY_DEBUG ||
            process.env.REACT_APP_MUI_X_TELEMETRY_DEBUG ||
            process.env.PUBLIC_MUI_X_TELEMETRY_DEBUG;
        var result = getBooleanEnv(envValue);
        if (typeof result === 'boolean') {
            return result;
        }
    }
    catch (_) {
        // If there is an error, return the default value
    }
    return false;
}
function getNodeEnv() {
    var _a;
    try {
        return (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : '<unknown>';
    }
    catch (_) {
        return '<unknown>';
    }
}
var cachedEnv = null;
function getTelemetryEnvConfig(skipCache) {
    if (skipCache === void 0) { skipCache = false; }
    if (skipCache || !cachedEnv) {
        cachedEnv = {
            NODE_ENV: getNodeEnv(),
            IS_COLLECTING: getIsTelemetryCollecting(),
            DEBUG: getIsDebugModeEnabled(),
        };
    }
    return cachedEnv;
}
function getTelemetryEnvConfigValue(key) {
    return getTelemetryEnvConfig()[key];
}
function setTelemetryEnvConfigValue(key, value) {
    getTelemetryEnvConfig()[key] = value;
}

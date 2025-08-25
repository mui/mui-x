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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var fetcher_1 = require("./fetcher");
var sendMuiXTelemetryRetries = 3;
function shouldSendTelemetry(telemetryContext) {
    // Disable reporting in SSR / Node.js
    if (typeof window === 'undefined') {
        return false;
    }
    // Priority to the config (e.g. in code, env)
    var envIsCollecting = (0, config_1.getTelemetryEnvConfigValue)('IS_COLLECTING');
    if (typeof envIsCollecting === 'boolean') {
        return envIsCollecting;
    }
    // Disable collection of the telemetry in CI builds,
    // as it not related to development process
    if (telemetryContext.traits.isCI) {
        return false;
    }
    // Disabled by default
    return false;
}
function sendMuiXTelemetryEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var getTelemetryContext, telemetryContext, eventPayload, _1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    // Disable collection of the telemetry
                    // in production environment
                    if (process.env.NODE_ENV === 'production') {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./get-context'); })];
                case 1:
                    getTelemetryContext = (_c.sent()).default;
                    return [4 /*yield*/, getTelemetryContext()];
                case 2:
                    telemetryContext = _c.sent();
                    if (!event || !shouldSendTelemetry(telemetryContext)) {
                        return [2 /*return*/];
                    }
                    eventPayload = __assign(__assign({}, event), { context: __assign(__assign({}, telemetryContext.traits), event.context) });
                    if ((0, config_1.getTelemetryEnvConfigValue)('DEBUG')) {
                        console.log('[mui-x-telemetry] event', JSON.stringify(eventPayload, null, 2));
                        return [2 /*return*/];
                    }
                    // TODO: batch events and send them in a single request when there will be more
                    return [4 /*yield*/, (0, fetcher_1.fetchWithRetry)('https://x-telemetry.mui.com/v2/telemetry/record', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Telemetry-Client-Version': (_a = process.env.MUI_VERSION) !== null && _a !== void 0 ? _a : '<dev>',
                                'X-Telemetry-Node-Env': (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : '<unknown>',
                            },
                            body: JSON.stringify([eventPayload]),
                        }, sendMuiXTelemetryRetries)];
                case 3:
                    // TODO: batch events and send them in a single request when there will be more
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _1 = _c.sent();
                    console.log('[mui-x-telemetry] error', _1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.default = sendMuiXTelemetryEvent;

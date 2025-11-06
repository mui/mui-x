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
var context_1 = require("../context");
var window_storage_1 = require("./window-storage");
function generateId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function pick(obj, keys) {
    return keys.reduce(function (acc, key) {
        acc[key] = obj[key];
        return acc;
    }, {});
}
var getBrowserFingerprint = typeof window === 'undefined' || process.env.NODE_ENV === 'test'
    ? function () { return undefined; }
    : function () { return __awaiter(void 0, void 0, void 0, function () {
        var fingerprintLCKey, existingFingerprint, FingerprintJS, fp, fpResult, components, fullHash, coreHash, result, _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fingerprintLCKey = 'fingerprint';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    existingFingerprint = (0, window_storage_1.getWindowStorageItem)('localStorage', fingerprintLCKey);
                    if (existingFingerprint) {
                        return [2 /*return*/, JSON.parse(existingFingerprint)];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('@fingerprintjs/fingerprintjs'); })];
                case 2:
                    FingerprintJS = _a.sent();
                    return [4 /*yield*/, FingerprintJS.load({ monitoring: false })];
                case 3:
                    fp = _a.sent();
                    return [4 /*yield*/, fp.get()];
                case 4:
                    fpResult = _a.sent();
                    components = __assign({}, fpResult.components);
                    delete components.cookiesEnabled;
                    fullHash = FingerprintJS.hashComponents(components);
                    coreHash = FingerprintJS.hashComponents(__assign({}, pick(components, [
                        'fonts',
                        'audio',
                        'languages',
                        'deviceMemory',
                        'timezone',
                        'sessionStorage',
                        'localStorage',
                        'indexedDB',
                        'openDatabase',
                        'platform',
                        'canvas',
                        'vendor',
                        'vendorFlavors',
                        'colorGamut',
                        'forcedColors',
                        'monochrome',
                        'contrast',
                        'reducedMotion',
                        'math',
                        'videoCard',
                        'architecture',
                    ])));
                    result = { fullHash: fullHash, coreHash: coreHash };
                    (0, window_storage_1.setWindowStorageItem)('localStorage', fingerprintLCKey, JSON.stringify(result));
                    return [2 /*return*/, result];
                case 5:
                    _1 = _a.sent();
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    }); };
function getAnonymousId() {
    var localStorageKey = 'anonymous_id';
    var existingAnonymousId = (0, window_storage_1.getWindowStorageItem)('localStorage', localStorageKey);
    if (existingAnonymousId) {
        return existingAnonymousId;
    }
    var generated = "anid_".concat(generateId(32));
    if ((0, window_storage_1.setWindowStorageItem)('localStorage', localStorageKey, generated)) {
        return generated;
    }
    return '';
}
function getSessionId() {
    var localStorageKey = 'session_id';
    var existingSessionId = (0, window_storage_1.getWindowStorageItem)('sessionStorage', localStorageKey);
    if (existingSessionId) {
        return existingSessionId;
    }
    var generated = "sesid_".concat(generateId(32));
    if ((0, window_storage_1.setWindowStorageItem)('sessionStorage', localStorageKey, generated)) {
        return generated;
    }
    return "sestp_".concat(generateId(32));
}
function getTelemetryContext() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    context_1.default.traits.sessionId = getSessionId();
                    // Initialize the context if it hasn't been initialized yet
                    // (e.g. postinstall not run)
                    if (!context_1.default.config.isInitialized) {
                        context_1.default.traits.anonymousId = getAnonymousId();
                        context_1.default.config.isInitialized = true;
                    }
                    if (!!context_1.default.traits.fingerprint) return [3 /*break*/, 2];
                    _a = context_1.default.traits;
                    return [4 /*yield*/, getBrowserFingerprint()];
                case 1:
                    _a.fingerprint = _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/, context_1.default];
            }
        });
    });
}
exports.default = getTelemetryContext;

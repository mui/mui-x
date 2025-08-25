"use strict";
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
exports.TelemetryStorage = void 0;
var crypto_1 = require("crypto");
var path_1 = require("path");
var notify_1 = require("./notify");
var get_environment_info_1 = require("./get-environment-info");
// This is the key that specifies when the user was informed about telemetry collection.
var TELEMETRY_KEY_NOTIFY_DATE = 'telemetry.notifiedAt';
// This is a quasi-persistent identifier used to dedupe recurring events. It's
// generated from random data and completely anonymous.
var TELEMETRY_KEY_ID = "telemetry.anonymousId";
function getStorageDirectory(distDir) {
    var env = (0, get_environment_info_1.default)();
    var isLikelyEphemeral = env.isCI || env.isDocker;
    if (isLikelyEphemeral) {
        return path_1.default.join(distDir, 'cache');
    }
    return undefined;
}
var TelemetryStorage = /** @class */ (function () {
    function TelemetryStorage(conf) {
        var _this = this;
        this.conf = conf;
        this.notify = function () {
            if (!_this.conf) {
                return;
            }
            // The end-user has already been notified about our telemetry integration. We
            // don't need to constantly annoy them about it.
            // We will re-inform users about the telemetry if significant changes are
            // ever made.
            if (_this.conf.get(TELEMETRY_KEY_NOTIFY_DATE, '')) {
                return;
            }
            _this.conf.set(TELEMETRY_KEY_NOTIFY_DATE, Date.now().toString());
            (0, notify_1.default)();
        };
        this.notify();
    }
    TelemetryStorage.init = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var storageDirectory, conf, Conf, _1;
            var distDir = _b.distDir;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        storageDirectory = getStorageDirectory(distDir);
                        conf = null;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('conf'); })];
                    case 2:
                        Conf = (_c.sent()).default;
                        conf = new Conf({ projectName: 'mui-x', cwd: storageDirectory });
                        return [3 /*break*/, 4];
                    case 3:
                        _1 = _c.sent();
                        conf = null;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, new TelemetryStorage(conf)];
                }
            });
        });
    };
    Object.defineProperty(TelemetryStorage.prototype, "configPath", {
        get: function () {
            var _a;
            return (_a = this.conf) === null || _a === void 0 ? void 0 : _a.path;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TelemetryStorage.prototype, "anonymousId", {
        get: function () {
            var _a;
            var val = this.conf && this.conf.get(TELEMETRY_KEY_ID);
            if (val) {
                return val;
            }
            var generated = (0, crypto_1.randomBytes)(32).toString('hex');
            (_a = this.conf) === null || _a === void 0 ? void 0 : _a.set(TELEMETRY_KEY_ID, generated);
            return generated;
        },
        enumerable: false,
        configurable: true
    });
    return TelemetryStorage;
}());
exports.TelemetryStorage = TelemetryStorage;

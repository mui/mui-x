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
var fs_1 = require("fs");
var path_1 = require("path");
var crypto_1 = require("crypto");
var url_1 = require("url");
var get_environment_info_1 = require("./get-environment-info");
var get_project_id_1 = require("./get-project-id");
var get_machine_id_1 = require("./get-machine-id");
var storage_1 = require("./storage");
var dirname = typeof __dirname === 'string'
    ? __dirname // cjs build in root dir
    : (function () {
        var filename = (0, url_1.fileURLToPath)(import.meta.url);
        // esm build in `esm` directory, so we need to go up two levels
        return path_1.default.dirname(path_1.default.dirname(filename));
    })();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var storage, _a, environmentInfo, projectId, machineId, contextData, writeContextData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // If Node.js support permissions, we need to check if the current user has
                // the necessary permissions to write to the file system.
                if (typeof process.permission !== 'undefined' &&
                    !(process.permission.has('fs.read') && process.permission.has('fs.write'))) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, storage_1.TelemetryStorage.init({
                        distDir: process.cwd(),
                    })];
            case 1:
                storage = _b.sent();
                return [4 /*yield*/, Promise.all([
                        (0, get_environment_info_1.default)(),
                        (0, get_project_id_1.default)(),
                        (0, get_machine_id_1.default)(),
                    ])];
            case 2:
                _a = _b.sent(), environmentInfo = _a[0], projectId = _a[1], machineId = _a[2];
                contextData = {
                    config: {
                        isInitialized: true,
                    },
                    traits: __assign(__assign({}, environmentInfo), { machineId: machineId, projectId: projectId, sessionId: (0, crypto_1.randomBytes)(32).toString('hex'), anonymousId: storage.anonymousId }),
                };
                writeContextData = function (filePath, format) {
                    var targetPath = path_1.default.resolve(dirname, '..', filePath, 'context.js');
                    fs_1.default.writeFileSync(targetPath, format(JSON.stringify(contextData, null, 2)));
                };
                writeContextData('esm', function (content) { return "export default ".concat(content, ";"); });
                writeContextData('', function (content) {
                    return [
                        "\"use strict\";",
                        "Object.defineProperty(exports, \"__esModule\", { value: true });",
                        "exports.default = void 0;",
                        "var _default = exports.default = ".concat(content, ";"),
                    ].join('\n');
                });
                return [2 /*return*/];
        }
    });
}); })().catch(function (error) {
    console.error('[telemetry] Failed to make initialization. Please, report error to MUI X team:\n' +
        'https://mui.com/r/x-telemetry-postinstall-troubleshoot\n', error);
});

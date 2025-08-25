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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import path from 'path';
var cleanDepName = function (name) {
    // If the name starts with '@', we need to split it into scope and lib
    // e.g. `@mui/material/Button` -> `@mui/material`
    if (name.startsWith('@')) {
        var _a = name.split('/'), scope = _a[0], lib = _a[1];
        return "".concat(scope, "/").concat(lib);
    }
    // If the name does not start with '@', we only care about the first part
    // e.g. `material/Button` -> `material`
    return name.split('/')[0];
};
export function redirectImports(rules) {
    return {
        name: 'vite-plugin-redirect-imports',
        enforce: 'pre',
        config: function (config) {
            var _a;
            var _b, _c;
            var _d;
            (_b = config.optimizeDeps) !== null && _b !== void 0 ? _b : (config.optimizeDeps = {});
            (_c = (_d = config.optimizeDeps).include) !== null && _c !== void 0 ? _c : (_d.include = []);
            var depsToInclude = new Set(__spreadArray(__spreadArray([], rules.flatMap(function (rule) { var _a; return (_a = rule.include) !== null && _a !== void 0 ? _a : []; }), true), rules.flatMap(function (rule) { return cleanDepName(rule.to); }), true));
            // Ignore already-included deps
            config.optimizeDeps.include.forEach(function (dep) { return depsToInclude.delete(dep); });
            (_a = config.optimizeDeps.include).push.apply(_a, depsToInclude);
        },
        resolveId: function (source, importer) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedImporter, _i, rules_1, rule, match, newSource;
                return __generator(this, function (_a) {
                    if (!importer) {
                        return [2 /*return*/, null];
                    }
                    normalizedImporter = importer.split(path.sep).join('/');
                    for (_i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                        rule = rules_1[_i];
                        if (!rule.test.test(normalizedImporter)) {
                            continue;
                        }
                        match = source === rule.from || source.startsWith("".concat(rule.from, "/"));
                        if (!match) {
                            continue;
                        }
                        newSource = rule.to + source.slice(rule.from.length);
                        return [2 /*return*/, this.resolve(newSource, importer, { skipSelf: true })];
                    }
                    return [2 /*return*/, null];
                });
            });
        },
    };
}

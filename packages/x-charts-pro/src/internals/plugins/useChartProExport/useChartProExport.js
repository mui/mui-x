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
exports.useChartProExport = void 0;
var print_1 = require("./print");
var exportImage_1 = require("./exportImage");
var exportSvg_1 = require("./exportSvg");
function waitForAnimationFrame() {
    var resolve;
    var promise = new Promise(function (res) {
        resolve = res;
    });
    window.requestAnimationFrame(function () {
        resolve();
    });
    return promise;
}
var useChartProExport = function (_a) {
    var chartRootRef = _a.chartRootRef, instance = _a.instance;
    var exportAsPrint = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var chartRoot, enableAnimation, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chartRoot = chartRootRef.current;
                    if (!chartRoot) return [3 /*break*/, 5];
                    enableAnimation = instance.disableAnimation();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Wait for animation frame to ensure the animation finished
                    return [4 /*yield*/, waitForAnimationFrame()];
                case 2:
                    // Wait for animation frame to ensure the animation finished
                    _a.sent();
                    (0, print_1.printChart)(chartRoot, options);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('MUI X Charts: Error exporting chart as print:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    enableAnimation();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var exportAsImage = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var chartRoot, enableAnimation, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chartRoot = chartRootRef.current;
                    if (!chartRoot) return [3 /*break*/, 9];
                    enableAnimation = instance.disableAnimation();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    // Wait for animation frame to ensure the animation finished
                    return [4 /*yield*/, waitForAnimationFrame()];
                case 2:
                    // Wait for animation frame to ensure the animation finished
                    _a.sent();
                    if (!((options === null || options === void 0 ? void 0 : options.type) === 'image/svg+xml')) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, exportSvg_1.exportSvg)(chartRoot, options)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, (0, exportImage_1.exportImage)(chartRoot, options)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    error_2 = _a.sent();
                    console.error('MUI X Charts: Error exporting chart as image:', error_2);
                    return [3 /*break*/, 9];
                case 8:
                    enableAnimation();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    return {
        publicAPI: {
            exportAsPrint: exportAsPrint,
            exportAsImage: exportAsImage,
        },
        instance: {
            exportAsPrint: exportAsPrint,
            exportAsImage: exportAsImage,
        },
    };
};
exports.useChartProExport = useChartProExport;
exports.useChartProExport.params = {};
exports.useChartProExport.getDefaultizedParams = function (_a) {
    var params = _a.params;
    return (__assign({}, params));
};
exports.useChartProExport.getInitialState = function () { return ({ export: {} }); };

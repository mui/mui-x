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
exports.getDrawDocument = void 0;
exports.exportImage = exportImage;
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var export_1 = require("@mui/x-internals/export");
var common_1 = require("./common");
var defaults_1 = require("./defaults");
var getDrawDocument = function () { return __awaiter(void 0, void 0, void 0, function () {
    var module, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('rasterizehtml'); })];
            case 1:
                module = _a.sent();
                return [2 /*return*/, (module.default || module).drawDocument];
            case 2:
                error_1 = _a.sent();
                throw new Error("MUI X Charts: Failed to import 'rasterizehtml' module. This dependency is mandatory when exporting a chart as an image. Make sure you have it installed as a dependency.", { cause: error_1 });
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDrawDocument = getDrawDocument;
function exportImage(element, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, fileName, _b, type, _c, quality, _d, onBeforeExport, _e, copyStyles, drawDocumentPromise, _f, width, height, doc, canvas, ratio, iframe, resolve, iframeLoadPromise, drawDocument, resolveBlobPromise, blobPromise, blob, error_2, url;
        var _this = this;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = params !== null && params !== void 0 ? params : {}, fileName = _a.fileName, _b = _a.type, type = _b === void 0 ? 'image/png' : _b, _c = _a.quality, quality = _c === void 0 ? 0.9 : _c, _d = _a.onBeforeExport, onBeforeExport = _d === void 0 ? defaults_1.defaultOnBeforeExport : _d, _e = _a.copyStyles, copyStyles = _e === void 0 ? true : _e;
                    drawDocumentPromise = (0, exports.getDrawDocument)();
                    _f = element.getBoundingClientRect(), width = _f.width, height = _f.height;
                    doc = (0, ownerDocument_1.default)(element);
                    canvas = document.createElement('canvas');
                    ratio = window.devicePixelRatio || 1;
                    canvas.width = width * ratio;
                    canvas.height = height * ratio;
                    canvas.style.width = "".concat(width, "px");
                    canvas.style.height = "".concat(height, "px");
                    iframe = (0, common_1.createExportIframe)(fileName);
                    iframeLoadPromise = new Promise(function (res) {
                        resolve = res;
                    });
                    iframe.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                        var exportDoc, elementClone, container, rootCandidate, root;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    exportDoc = iframe.contentDocument;
                                    elementClone = element.cloneNode(true);
                                    container = document.createElement('div');
                                    container.appendChild(elementClone);
                                    exportDoc.body.innerHTML = container.innerHTML;
                                    exportDoc.body.style.margin = '0px';
                                    rootCandidate = element.getRootNode();
                                    root = rootCandidate.constructor.name === 'ShadowRoot' ? rootCandidate : doc;
                                    if (!copyStyles) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Promise.all((0, export_1.loadStyleSheets)(exportDoc, root))];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    doc.body.appendChild(iframe);
                    return [4 /*yield*/, iframeLoadPromise];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, onBeforeExport(iframe)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, drawDocumentPromise];
                case 3:
                    drawDocument = _g.sent();
                    _g.label = 4;
                case 4:
                    _g.trys.push([4, , 6, 7]);
                    return [4 /*yield*/, drawDocument(iframe.contentDocument, canvas, {
                            // Handle retina displays: https://github.com/cburgmer/rasterizeHTML.js/blob/262b3404d1c469ce4a7750a2976dec09b8ae2d6c/examples/retina.html#L71
                            zoom: ratio,
                        })];
                case 5:
                    _g.sent();
                    return [3 /*break*/, 7];
                case 6:
                    doc.body.removeChild(iframe);
                    return [7 /*endfinally*/];
                case 7:
                    blobPromise = new Promise(function (res) {
                        resolveBlobPromise = res;
                    });
                    canvas.toBlob(function (blob) { return resolveBlobPromise(blob); }, type, quality);
                    _g.label = 8;
                case 8:
                    _g.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, blobPromise];
                case 9:
                    blob = _g.sent();
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _g.sent();
                    throw new Error('MUI X Charts: Failed to create blob from canvas.', { cause: error_2 });
                case 11:
                    if (!blob) {
                        throw new Error('MUI X Charts: Failed to create blob from canvas.');
                        return [2 /*return*/];
                    }
                    url = URL.createObjectURL(blob);
                    triggerDownload(url, fileName || document.title);
                    URL.revokeObjectURL(url);
                    return [2 /*return*/];
            }
        });
    });
}
function triggerDownload(url, name) {
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
}

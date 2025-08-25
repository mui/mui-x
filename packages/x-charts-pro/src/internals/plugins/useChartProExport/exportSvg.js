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
exports.exportSvg = exportSvg;
var defaults_1 = require("./defaults");
var common_1 = require("./common");
function triggerDownload(url, name) {
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
}
function exportSvg(element, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, fileName, _b, onBeforeExport, _c, copyStyles, svgElement, titleElement, iframe, resolve, iframeLoadPromise, processedSvg, svgString, fullSvgContent, blob, url, downloadFileName, fileNameWithExtension;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = params !== null && params !== void 0 ? params : {}, fileName = _a.fileName, _b = _a.onBeforeExport, onBeforeExport = _b === void 0 ? defaults_1.defaultOnBeforeExport : _b, _c = _a.copyStyles, copyStyles = _c === void 0 ? true : _c;
                    svgElement = null;
                    if (element.tagName.toLowerCase() === 'svg') {
                        svgElement = element;
                    }
                    else {
                        // First try to find the main chart SVG by class (ChartsSurface component)
                        svgElement = element.querySelector('svg.MuiChartsSurface-root');
                        // If not found, try to find SVG with title element (ChartsSurface adds title/desc)
                        if (!svgElement) {
                            titleElement = element.querySelector('svg title');
                            if (titleElement) {
                                svgElement = titleElement.parentElement;
                            }
                        }
                        // Final fallback to the first SVG (for backward compatibility)
                        if (!svgElement) {
                            svgElement = element.querySelector('svg');
                        }
                    }
                    if (!svgElement) {
                        throw new Error('MUI X Charts: No SVG element found in the chart for SVG export.');
                    }
                    iframe = (0, common_1.createExportIframe)(fileName);
                    iframeLoadPromise = new Promise(function (res) {
                        resolve = res;
                    });
                    iframe.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                        var exportDoc, svgClone, container, rootCandidate, root, loadStyleSheets, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    exportDoc = iframe.contentDocument;
                                    svgClone = svgElement.cloneNode(true);
                                    container = document.createElement('div');
                                    container.appendChild(svgClone);
                                    exportDoc.body.innerHTML = container.innerHTML;
                                    exportDoc.body.style.margin = '0px';
                                    rootCandidate = element.getRootNode();
                                    root = rootCandidate.constructor.name === 'ShadowRoot'
                                        ? rootCandidate
                                        : document;
                                    if (!copyStyles) return [3 /*break*/, 5];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require('@mui/x-internals/export'); })];
                                case 2:
                                    loadStyleSheets = (_a.sent()).loadStyleSheets;
                                    return [4 /*yield*/, Promise.all(loadStyleSheets(exportDoc, root))];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _a.sent();
                                    console.warn('MUI X Charts: Could not load stylesheets for SVG export:', error_1);
                                    return [3 /*break*/, 5];
                                case 5:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    document.body.appendChild(iframe);
                    return [4 /*yield*/, iframeLoadPromise];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, onBeforeExport(iframe)];
                case 2:
                    _d.sent();
                    try {
                        processedSvg = iframe.contentDocument.querySelector('svg');
                        if (!processedSvg) {
                            throw new Error('MUI X Charts: Processed SVG element not found.');
                        }
                        svgString = new XMLSerializer().serializeToString(processedSvg);
                        fullSvgContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n".concat(svgString);
                        blob = new Blob([fullSvgContent], { type: 'image/svg+xml' });
                        url = URL.createObjectURL(blob);
                        downloadFileName = fileName || document.title;
                        fileNameWithExtension = downloadFileName.endsWith('.svg')
                            ? downloadFileName
                            : "".concat(downloadFileName, ".svg");
                        triggerDownload(url, fileNameWithExtension);
                        URL.revokeObjectURL(url);
                    }
                    finally {
                        document.body.removeChild(iframe);
                    }
                    return [2 /*return*/];
            }
        });
    });
}

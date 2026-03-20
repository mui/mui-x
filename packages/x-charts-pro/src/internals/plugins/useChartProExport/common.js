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
exports.createExportIframe = createExportIframe;
exports.applyStyles = applyStyles;
exports.copyCanvasesContent = copyCanvasesContent;
function createExportIframe(title) {
    var iframeEl = document.createElement('iframe');
    iframeEl.style.position = 'absolute';
    iframeEl.style.width = '0px';
    iframeEl.style.height = '0px';
    iframeEl.title = title || document.title;
    return iframeEl;
}
/**
 * Applies styles to an element and returns the previous styles.
 */
function applyStyles(element, styles) {
    var previousStyles = {};
    Object.entries(styles).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        var prev = element.style.getPropertyValue(key);
        previousStyles[key] = prev;
        element.style.setProperty(key, value);
    });
    return previousStyles;
}
/**
 * Copies the content of all canvases from the original element to the cloned element.
 */
function copyCanvasesContent(original, clone) {
    var _this = this;
    var originalCanvases = original.querySelectorAll('canvas');
    var cloneCanvases = clone.querySelectorAll('canvas');
    var promises = Array.from(originalCanvases).map(function (originalCanvas, index) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var cloneCanvas = cloneCanvases[index];
                    if (cloneCanvas) {
                        var dataURL = originalCanvas.toDataURL();
                        var img = cloneCanvas.ownerDocument.createElement('img');
                        img.src = dataURL;
                        // Use the CSS dimensions (not canvas.width/height which are in device pixels)
                        img.width = originalCanvas.clientWidth;
                        img.height = originalCanvas.clientHeight;
                        img.style.cssText = cloneCanvas.style.cssText;
                        cloneCanvas.replaceWith(img);
                        img.onload = function () {
                            resolve();
                        };
                        img.onerror = function (event) {
                            reject(event);
                        };
                    }
                    else {
                        resolve();
                    }
                })];
        });
    }); });
    return Promise.all(promises);
}

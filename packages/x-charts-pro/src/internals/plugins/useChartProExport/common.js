"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExportIframe = createExportIframe;
function createExportIframe(title) {
    var iframeEl = document.createElement('iframe');
    iframeEl.style.position = 'absolute';
    iframeEl.style.width = '0px';
    iframeEl.style.height = '0px';
    iframeEl.title = title || document.title;
    return iframeEl;
}

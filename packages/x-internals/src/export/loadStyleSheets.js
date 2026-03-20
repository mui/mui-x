"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStyleSheets = loadStyleSheets;
/**
 * Loads all stylesheets from the given root element into the document.
 * @returns an array of promises that resolve when each stylesheet is loaded
 * @param document Document to load stylesheets into
 * @param root Document or ShadowRoot to load stylesheets from
 * @param nonce Optional nonce to set on style elements for CSP compliance
 */
function loadStyleSheets(document, root, nonce) {
    var stylesheetLoadPromises = [];
    var headStyleElements = root.querySelectorAll("style, link[rel='stylesheet']");
    var _loop_1 = function (i) {
        var node = headStyleElements[i];
        var newHeadStyleElement = document.createElement(node.tagName);
        if (node.tagName === 'STYLE') {
            var sheet = node.sheet;
            if (sheet) {
                var styleCSS = '';
                for (var j = 0; j < sheet.cssRules.length; j += 1) {
                    if (typeof sheet.cssRules[j].cssText === 'string') {
                        styleCSS += "".concat(sheet.cssRules[j].cssText, "\r\n");
                    }
                }
                newHeadStyleElement.appendChild(document.createTextNode(styleCSS));
            }
        }
        else if (node.getAttribute('href')) {
            for (var j = 0; j < node.attributes.length; j += 1) {
                var attr = node.attributes[j];
                if (attr) {
                    newHeadStyleElement.setAttribute(attr.nodeName, attr.nodeValue || '');
                }
            }
            stylesheetLoadPromises.push(new Promise(function (resolve) {
                newHeadStyleElement.addEventListener('load', function () { return resolve(); });
            }));
        }
        if (nonce) {
            newHeadStyleElement.setAttribute('nonce', nonce);
        }
        document.head.appendChild(newHeadStyleElement);
        if (nonce) {
            // I don't understand why we need to set the nonce again after appending the element, but I've tested it, and it's
            // the only way I could find to fix Chrome's warning about a CSP violation.
            newHeadStyleElement.setAttribute('nonce', nonce);
        }
    };
    for (var i = 0; i < headStyleElements.length; i += 1) {
        _loop_1(i);
    }
    return stylesheetLoadPromises;
}

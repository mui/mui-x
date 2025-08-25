"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStyleSheets = loadStyleSheets;
/**
 * Loads all stylesheets from the given root element into the document.
 * @returns an array of promises that resolve when each stylesheet is loaded
 * @param document Document to load stylesheets into
 * @param root Document or ShadowRoot to load stylesheets from
 */
function loadStyleSheets(document, root) {
    var stylesheetLoadPromises = [];
    var headStyleElements = root.querySelectorAll("style, link[rel='stylesheet']");
    var _loop_1 = function (i) {
        var node = headStyleElements[i];
        if (node.tagName === 'STYLE') {
            var newHeadStyleElements = document.createElement(node.tagName);
            var sheet = node.sheet;
            if (sheet) {
                var styleCSS = '';
                for (var j = 0; j < sheet.cssRules.length; j += 1) {
                    if (typeof sheet.cssRules[j].cssText === 'string') {
                        styleCSS += "".concat(sheet.cssRules[j].cssText, "\r\n");
                    }
                }
                newHeadStyleElements.appendChild(document.createTextNode(styleCSS));
                document.head.appendChild(newHeadStyleElements);
            }
        }
        else if (node.getAttribute('href')) {
            // If `href` tag is empty, avoid loading these links
            var newHeadStyleElements_1 = document.createElement(node.tagName);
            for (var j = 0; j < node.attributes.length; j += 1) {
                var attr = node.attributes[j];
                if (attr) {
                    newHeadStyleElements_1.setAttribute(attr.nodeName, attr.nodeValue || '');
                }
            }
            stylesheetLoadPromises.push(new Promise(function (resolve) {
                newHeadStyleElements_1.addEventListener('load', function () { return resolve(); });
            }));
            document.head.appendChild(newHeadStyleElements_1);
        }
    };
    for (var i = 0; i < headStyleElements.length; i += 1) {
        _loop_1(i);
    }
    return stylesheetLoadPromises;
}

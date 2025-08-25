"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveElement = void 0;
exports.escapeOperandAttributeSelector = escapeOperandAttributeSelector;
// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
var getActiveElement = function (root) {
    if (root === void 0) { root = document; }
    var activeEl = root.activeElement;
    if (!activeEl) {
        return null;
    }
    if (activeEl.shadowRoot) {
        return (0, exports.getActiveElement)(activeEl.shadowRoot);
    }
    return activeEl;
};
exports.getActiveElement = getActiveElement;
// TODO, eventually replaces this function with CSS.escape, once available in jsdom, either added manually or built in
// https://github.com/jsdom/jsdom/issues/1550#issuecomment-236734471
function escapeOperandAttributeSelector(operand) {
    return operand.replace(/["\\]/g, '\\$&');
}

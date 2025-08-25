"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DESKTOP_MODE_MEDIA_QUERY = exports.getFocusedListItemIndex = exports.getActiveElement = exports.executeInTheNextEventLoopTick = exports.onSpaceOrEnter = void 0;
exports.arrayIncludes = arrayIncludes;
exports.mergeSx = mergeSx;
var ownerDocument_1 = require("@mui/utils/ownerDocument");
/* Use it instead of .includes method for IE support */
function arrayIncludes(array, itemOrItems) {
    if (Array.isArray(itemOrItems)) {
        return itemOrItems.every(function (item) { return array.indexOf(item) !== -1; });
    }
    return array.indexOf(itemOrItems) !== -1;
}
var onSpaceOrEnter = function (innerFn, externalEvent) {
    return function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            innerFn(event);
            // prevent any side effects
            event.preventDefault();
            event.stopPropagation();
        }
        if (externalEvent) {
            externalEvent(event);
        }
    };
};
exports.onSpaceOrEnter = onSpaceOrEnter;
var executeInTheNextEventLoopTick = function (fn) {
    setTimeout(fn, 0);
};
exports.executeInTheNextEventLoopTick = executeInTheNextEventLoopTick;
// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
var getActiveElementInternal = function (root) {
    if (root === void 0) { root = document; }
    var activeEl = root.activeElement;
    if (!activeEl) {
        return null;
    }
    if (activeEl.shadowRoot) {
        return getActiveElementInternal(activeEl.shadowRoot);
    }
    return activeEl;
};
/**
 * Gets the currently active element within a given node's document.
 * This function traverses shadow DOM if necessary.
 * @param node - The node from which to get the active element.
 * @returns The currently active element, or null if none is found.
 */
var getActiveElement = function (node) {
    return getActiveElementInternal((0, ownerDocument_1.default)(node));
};
exports.getActiveElement = getActiveElement;
/**
 * Gets the index of the focused list item in a given ul list element.
 *
 * @param {HTMLUListElement} listElement - The list element to search within.
 * @returns {number} The index of the focused list item, or -1 if none is focused.
 */
var getFocusedListItemIndex = function (listElement) {
    var children = Array.from(listElement.children);
    return children.indexOf((0, exports.getActiveElement)(listElement));
};
exports.getFocusedListItemIndex = getFocusedListItemIndex;
exports.DEFAULT_DESKTOP_MODE_MEDIA_QUERY = '@media (pointer: fine)';
function mergeSx() {
    var sxProps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sxProps[_i] = arguments[_i];
    }
    return sxProps.reduce(function (acc, sxProp) {
        if (Array.isArray(sxProp)) {
            acc.push.apply(acc, sxProp);
        }
        else if (sxProp != null) {
            acc.push(sxProp);
        }
        return acc;
    }, []);
}

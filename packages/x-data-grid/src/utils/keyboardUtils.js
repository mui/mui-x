"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHideMenuKey = exports.isKeyboardEvent = exports.isNavigationKey = exports.isCellEditCommitKeys = exports.isCellExitEditModeKeys = exports.isCellEnterEditModeKeys = exports.isMultipleKey = exports.GRID_CELL_EDIT_COMMIT_KEYS = exports.GRID_CELL_EXIT_EDIT_MODE_KEYS = exports.GRID_MULTIPLE_SELECTION_KEYS = void 0;
exports.isPrintableKey = isPrintableKey;
exports.isPasteShortcut = isPasteShortcut;
exports.isCopyShortcut = isCopyShortcut;
// Non printable keys have a name, for example "ArrowRight", see the whole list:
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
// So event.key.length === 1 is often enough.
//
// However, we also need to ignore shortcuts, for example: select all:
// - Windows: Ctrl+A, event.ctrlKey is true
// - macOS: ⌘ Command+A, event.metaKey is true
function isPrintableKey(event) {
    return event.key.length === 1 && !event.ctrlKey && !event.metaKey;
}
exports.GRID_MULTIPLE_SELECTION_KEYS = ['Meta', 'Control', 'Shift'];
exports.GRID_CELL_EXIT_EDIT_MODE_KEYS = ['Enter', 'Escape', 'Tab'];
exports.GRID_CELL_EDIT_COMMIT_KEYS = ['Enter', 'Tab'];
var isMultipleKey = function (key) {
    return exports.GRID_MULTIPLE_SELECTION_KEYS.indexOf(key) > -1;
};
exports.isMultipleKey = isMultipleKey;
var isCellEnterEditModeKeys = function (event) {
    return isPrintableKey(event) ||
        event.key === 'Enter' ||
        event.key === 'Backspace' ||
        event.key === 'Delete';
};
exports.isCellEnterEditModeKeys = isCellEnterEditModeKeys;
var isCellExitEditModeKeys = function (key) {
    return exports.GRID_CELL_EXIT_EDIT_MODE_KEYS.indexOf(key) > -1;
};
exports.isCellExitEditModeKeys = isCellExitEditModeKeys;
var isCellEditCommitKeys = function (key) {
    return exports.GRID_CELL_EDIT_COMMIT_KEYS.indexOf(key) > -1;
};
exports.isCellEditCommitKeys = isCellEditCommitKeys;
var isNavigationKey = function (key) {
    return key.indexOf('Arrow') === 0 ||
        key.indexOf('Page') === 0 ||
        key === ' ' ||
        key === 'Home' ||
        key === 'End';
};
exports.isNavigationKey = isNavigationKey;
var isKeyboardEvent = function (event) {
    return !!event.key;
};
exports.isKeyboardEvent = isKeyboardEvent;
var isHideMenuKey = function (key) { return key === 'Tab' || key === 'Escape'; };
exports.isHideMenuKey = isHideMenuKey;
// In theory, on macOS, ctrl + v doesn't trigger a paste, so the function should return false.
// However, maybe it's overkill to fix, so let's be lazy.
function isPasteShortcut(event) {
    return ((event.ctrlKey || event.metaKey) &&
        // We can't use event.code === 'KeyV' as event.code assumes a QWERTY keyboard layout,
        // for example, it would be another letter on a Dvorak physical keyboard.
        // We can't use event.key === 'v' as event.key is not stable with key modifiers and keyboard layouts,
        // for example, it would be ה on a Hebrew keyboard layout.
        // https://github.com/w3c/uievents/issues/377 could be a long-term solution
        String.fromCharCode(event.keyCode) === 'V' &&
        !event.shiftKey &&
        !event.altKey);
}
// Checks if the keyboard event corresponds to the copy shortcut (CTRL+C or CMD+C) across different localization keyboards.
function isCopyShortcut(event) {
    return ((event.ctrlKey || event.metaKey) &&
        String.fromCharCode(event.keyCode) === 'C' &&
        !event.shiftKey &&
        !event.altKey);
}

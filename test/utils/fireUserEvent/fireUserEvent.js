"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mousePress = void 0;
exports.touch = touch;
exports.keyPress = keyPress;
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
/**
 * @deprecated Use `pointer` from `@testing-library/user-event` instead.
 */
function touch(target) {
    createRenderer_1.fireEvent.touchStart(target);
    createRenderer_1.fireEvent.touchEnd(target);
}
/**
 * @param {...any} args The arguments to pass to `fireEvent.mouseDown`, `fireEvent.mouseUp`, and `fireEvent.click`.
 * @deprecated Use `click` from `@testing-library/user-event` instead.
 */
var mousePress = function (target, options) {
    createRenderer_1.fireEvent.mouseDown(target, options);
    createRenderer_1.fireEvent.mouseUp(target, options);
    createRenderer_1.fireEvent.click(target, options);
};
exports.mousePress = mousePress;
/**
 * @deprecated Use `keyboard` or `type` from `@testing-library/user-event` instead.
 */
function keyPress(target, options) {
    createRenderer_1.fireEvent.keyDown(target, options);
    createRenderer_1.fireEvent.keyUp(target, options);
}

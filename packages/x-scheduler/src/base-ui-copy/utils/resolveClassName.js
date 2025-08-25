"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveClassName = resolveClassName;
/**
 * If the provided className is a string, it will be returned as is.
 * Otherwise, the function will call the className function with the state as the first argument.
 *
 * @param className
 * @param state
 */
function resolveClassName(className, state) {
    return typeof className === 'function' ? className(state) : className;
}

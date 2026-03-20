"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffectAfterFirstRender = useEffectAfterFirstRender;
var React = require("react");
/**
 * Run an effect only after the first render.
 *
 * @param effect The effect to run after the first render
 * @param deps The dependencies for the effect
 */
function useEffectAfterFirstRender(effect, deps) {
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return undefined;
        }
        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

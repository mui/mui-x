import * as React from 'react';
/**
 * Resolves the rendering logic for a component.
 * Handles three scenarios:
 * 1. A render function that receives props and state
 * 2. A React element
 * 3. A default element
 *
 * @ignore - internal hook.
 */
export function useComponentRenderer(defaultElement, render, props, state = {}) {
    if (typeof render === 'function') {
        return render(props, state);
    }
    if (render) {
        if (render.props.className) {
            props.className = mergeClassNames(render.props.className, props.className);
        }
        if (render.props.style || props.style) {
            props.style = { ...props.style, ...render.props.style };
        }
        return React.cloneElement(render, props);
    }
    return React.createElement(defaultElement, props);
}
function mergeClassNames(className, otherClassName) {
    if (!className || !otherClassName) {
        return className || otherClassName;
    }
    return `${className} ${otherClassName}`;
}

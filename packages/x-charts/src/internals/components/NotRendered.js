"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotRendered = NotRendered;
/**
 * This component is used to assert that a certain component should not be rendered.
 * It is used in cases where we want to apply styles to a component that is not rendered because we use the `as` prop (introduced by `styled`) to replace the rendered component.
 * We need it because we don't know the component that will be rendered at the time of writing the styles.
 *
 * @param _props Not used
 */
function NotRendered(_props) {
    throw new Error('Failed assertion: should not be rendered');
}

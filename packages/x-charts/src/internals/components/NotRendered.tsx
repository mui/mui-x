import type * as React from 'react';

/**
 * This component is used to assert that a certain component should not be rendered.
 * It is used in cases where we want to apply styles to a component that is not rendered because we use the `as` prop (introduced by `styled`) to replace the rendered component.
 * We need it because we don't know the component that will be rendered at the time of writing the styles.
 *
 * @param _props Not used
 */
export function NotRendered<T>(_props: T): React.ReactNode {
  throw new Error('Failed assertion: should not be rendered');
}

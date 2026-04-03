import * as React from 'react';
import { useId } from '@base-ui/utils/useId';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { CalendarGridRootContext } from './CalendarGridRootContext';

export const CalendarGridRoot = React.forwardRef(function CalendarGridRoot(
  componentProps: CalendarGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    id: idProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const id = useId(idProp);

  const contextValue: CalendarGridRootContext = React.useMemo(() => ({ id }), [id]);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, { role: 'grid', id }],
  });

  return (
    <CalendarGridRootContext.Provider value={contextValue}>
      {element}
    </CalendarGridRootContext.Provider>
  );
});

export namespace CalendarGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

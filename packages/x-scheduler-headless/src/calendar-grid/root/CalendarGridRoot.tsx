import * as React from 'react';
import { useId } from '@base-ui/utils/useId';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
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

  const [focusedCell, setFocusedCellState] =
    React.useState<CalendarGridRootContext['focusedCell']>(null);

  const setFocusedCell: CalendarGridRootContext['setFocusedCell'] = React.useCallback(
    (rowType, columnIndex) => {
      setFocusedCellState({ rowType, columnIndex });
    },
    [],
  );

  const contextValue: CalendarGridRootContext = React.useMemo(
    () => ({ id, focusedCell, setFocusedCell }),
    [id, focusedCell, setFocusedCell],
  );

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

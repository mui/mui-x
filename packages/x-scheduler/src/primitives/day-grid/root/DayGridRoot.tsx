import * as React from 'react';
import { useId } from '@base-ui-components/utils/useId';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { DayGridRootContext } from './DayGridRootContext';
import { CalendarDraggedOccurrence } from '../../models/event';

export const DayGridRoot = React.forwardRef(function DayGridRoot(
  componentProps: DayGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    onOccurrenceDrop,
    id: idProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const id = useId(idProp);
  const props = React.useMemo(() => ({ role: 'grid', id }), [id]);

  const contextValue: DayGridRootContext = React.useMemo(
    () => ({ dropOccurrence: onOccurrenceDrop ?? (() => {}), id }),
    [onOccurrenceDrop, id],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return <DayGridRootContext.Provider value={contextValue}>{element}</DayGridRootContext.Provider>;
});

export namespace DayGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * Event handler called when an occurrence is dropped inside the day grid.
     * Provides the occurrence data as an argument.
     */
    onOccurrenceDrop?: (data: CalendarDraggedOccurrence) => void;
  }
}

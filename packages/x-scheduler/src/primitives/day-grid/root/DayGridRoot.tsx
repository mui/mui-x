import * as React from 'react';
import { useId } from '@base-ui-components/utils/useId';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { DayGridRootContext } from './DayGridRootContext';

export const DayGridRoot = React.forwardRef(function DayGridRoot(
  componentProps: DayGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    id: idProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const id = useId(idProp);
  const props = React.useMemo(() => ({ role: 'grid', id }), [id]);

  const contextValue: DayGridRootContext = React.useMemo(() => ({ id }), [id]);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return <DayGridRootContext.Provider value={contextValue}>{element}</DayGridRootContext.Provider>;
});

export namespace DayGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { usePickersFieldRoot } from './usePickersFieldRoot';
import { InferFieldInternalProps, PickerController } from '../../models';
import { PickersFieldProvider } from './PickersFieldProvider';
import { useSplitFieldProps } from '../../hooks';

const PickersFieldRoot = React.forwardRef(function PickersFieldRoot<
  TController extends PickerController<any, any, any, any, any>,
>(props: PickersFieldRoot.Props<TController>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const { render, className, controller, ...otherProps } = props;

  const { internalProps, forwardedProps } = useSplitFieldProps(otherProps, controller.valueType);

  const { getRootProps, contextValue } = usePickersFieldRoot({
    controller,
    internalProps,
  });
  const ownerState: PickersFieldRoot.OwnerState = {};

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'div',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: forwardedProps,
  });

  return <PickersFieldProvider value={contextValue}>{renderElement()}</PickersFieldProvider>;
});

namespace PickersFieldRoot {
  export interface OwnerState {}

  export type Props<TController extends PickerController<any, any, any, any, any>> =
    BaseUIComponentProps<'div', OwnerState> &
      InferFieldInternalProps<TController> & {
        controller: TController;
      };
}

export { PickersFieldRoot };

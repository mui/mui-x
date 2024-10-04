import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { UsePickersFieldRoot, usePickersFieldRoot } from './usePickersFieldRoot';
import { PickerAnyAccessibleValueManagerV8, PickerManagerProperties } from '../../models';
import { PickersFieldProvider } from './PickersFieldProvider';
import { useSplitFieldProps } from '../../hooks';

const PickersFieldRoot = React.forwardRef(function PickersFieldRoot<
  TManager extends PickerAnyAccessibleValueManagerV8,
>(props: PickersFieldRoot.Props<TManager>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const { render, className, valueManager, inputRef, ...otherProps } = props;

  const { internalProps, forwardedProps } = useSplitFieldProps(otherProps, valueManager.valueType);

  const { getRootProps, contextValue, status } = usePickersFieldRoot({
    valueManager,
    internalProps,
    inputRef,
  });
  const ownerState: PickersFieldRoot.OwnerState = status;

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
  export interface OwnerState extends UsePickersFieldRoot.Status {}

  export type Props<TManager extends PickerAnyAccessibleValueManagerV8> = BaseUIComponentProps<
    'div',
    OwnerState
  > &
    PickerManagerProperties<TManager>['internalProps'] & {
      valueManager: TManager;
      inputRef?: React.Ref<HTMLInputElement>;
    };
}

export { PickersFieldRoot };

import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { usePickersFieldRoot } from './usePickersFieldRoot';
import { PickerAnyAccessibleValueManagerV8, PickerValueManagerProperties } from '../../models';
import { PickersFieldProvider } from './PickersFieldProvider';
import { useSplitFieldProps } from '../../hooks';

const PickersFieldRoot = React.forwardRef(function PickersFieldRoot<
  TValueManager extends PickerAnyAccessibleValueManagerV8,
>(props: PickersFieldRoot.Props<TValueManager>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const { render, className, valueManager, ...otherProps } = props;

  const { internalProps, forwardedProps } = useSplitFieldProps(otherProps, valueManager.valueType);

  const { getRootProps, contextValue } = usePickersFieldRoot({
    valueManager,
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

  export type Props<TValueManager extends PickerAnyAccessibleValueManagerV8> = BaseUIComponentProps<
    'div',
    OwnerState
  > &
    PickerValueManagerProperties<TValueManager>['internalProps'] & {
      valueManager: TValueManager;
    };
}

export { PickersFieldRoot };

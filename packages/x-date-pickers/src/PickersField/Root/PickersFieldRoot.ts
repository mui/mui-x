import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { usePickersFieldRoot } from './usePickersFieldRoot';
import {
  FieldValueType,
  PickerValidDate,
  InferValueFromDate,
  InferFieldSection,
  InferFieldInternalProps,
} from '../../models';
import type { PickerValueManager } from '../../internals/hooks/usePicker';
import type { Validator } from '../../validation';
import { FieldValueManager, UseFieldInternalProps } from '../../internals/hooks/useField';

const PickersFieldRoot = React.forwardRef(function PickersFieldRoot<
  TController extends PickersFieldRoot.Controller<any, any, any, any>,
>(props: PickersFieldRoot.Props<TController>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const { render, className, ...otherProps } = props;
  const { getRootProps } = usePickersFieldRoot({});
  const ownerState: PickersFieldRoot.OwnerState = {};

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'div',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace PickersFieldRoot {
  export interface OwnerState {}

  export type Props<TController extends PickersFieldRoot.Controller<any, any, any, any>> =
    BaseUIComponentProps<'div', OwnerState> &
      InferFieldInternalProps<TController> & {
        controller: TController;
      };

  export interface Controller<
    TDate extends PickerValidDate,
    TIsRange extends boolean,
    TError,
    TInternalProps extends UseFieldInternalProps<any, any, any, true, any>,
  > {
    valueManager: PickerValueManager<InferValueFromDate<TDate, TIsRange>, TDate, TError>;
    fieldValueManager: FieldValueManager<
      InferValueFromDate<TDate, TIsRange>,
      TDate,
      InferFieldSection<TIsRange>
    >;
    validator: Validator<InferValueFromDate<TDate, TIsRange>, TDate, TError, TInternalProps>;
    valueType: FieldValueType;
  }
}

export { PickersFieldRoot };

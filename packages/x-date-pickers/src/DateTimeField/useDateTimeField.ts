'use client';
import * as React from 'react';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { useSplitFieldProps } from '../hooks';
import { PickerValidDate } from '../models';
import { getDateTimeValueManager } from '../valueManagers';

export const useDateTimeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

  const valueManager = React.useMemo(
    () =>
      getDateTimeValueManager<TDate, TEnableAccessibleFieldDOMStructure>(
        props.enableAccessibleFieldDOMStructure,
      ),
    [props.enableAccessibleFieldDOMStructure],
  );

  return useField<typeof valueManager, typeof forwardedProps>({
    forwardedProps,
    internalProps,
    valueManager,
  });
};

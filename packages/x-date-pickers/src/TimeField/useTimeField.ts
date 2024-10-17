'use client';
import * as React from 'react';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { useSplitFieldProps } from '../hooks';
import { PickerValidDate } from '../models';
import { getTimeValueManager } from '../valueManagers';

export const useTimeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'time');

  const valueManager = React.useMemo(
    () =>
      getTimeValueManager<TDate, TEnableAccessibleFieldDOMStructure>(
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

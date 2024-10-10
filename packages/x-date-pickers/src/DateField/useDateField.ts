'use client';
import * as React from 'react';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { useSplitFieldProps } from '../hooks';
import { PickerValidDate } from '../models';
import { getDateValueManager } from '../valueManagers';

export const useDateField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

  const valueManager = React.useMemo(
    () =>
      getDateValueManager<TDate, TEnableAccessibleFieldDOMStructure>(
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

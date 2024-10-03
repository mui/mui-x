'use client';
import * as React from 'react';
import { useField } from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { getTimeRangeValueManager } from '../valueManagers';

export const useSingleInputTimeRangeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

  const valueManager = React.useMemo(
    () =>
      getTimeRangeValueManager<TDate, TEnableAccessibleFieldDOMStructure>({
        enableAccessibleFieldDOMStructure: props.enableAccessibleFieldDOMStructure,
        dateSeparator: props.dateSeparator,
      }),
    [props.enableAccessibleFieldDOMStructure, props.dateSeparator],
  );

  return useField<typeof valueManager, typeof forwardedProps>({
    forwardedProps,
    internalProps,
    valueManager,
  });
};

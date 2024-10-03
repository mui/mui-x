'use client';
import * as React from 'react';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { useSplitFieldProps } from '../hooks';
import { PickerValidDate } from '../models';
import { getDateTimeValueManager } from '../valueManagers';
import { useLocalizationContext } from '../internals/hooks/useUtils';

export const useDateTimeField = <
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const localizationContext = useLocalizationContext<TDate>();
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

  const valueManager = React.useMemo(
    () =>
      getDateTimeValueManager<TDate, TEnableAccessibleFieldDOMStructure>(
        props.enableAccessibleFieldDOMStructure,
      ),
    [props.enableAccessibleFieldDOMStructure],
  );

  const internalPropsWithDefaults = valueManager.applyDefaultsToFieldInternalProps({
    ...localizationContext,
    internalProps,
  });

  return useField<typeof valueManager, typeof forwardedProps>({
    forwardedProps,
    internalProps: internalPropsWithDefaults,
    valueManager,
  });
};

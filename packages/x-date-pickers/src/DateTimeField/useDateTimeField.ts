'use client';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateTimeFieldProps } from './DateTimeField.types';
import { validateDateTime } from '../validation';
import { useSplitFieldProps } from '../hooks';
import { useDefaultizedDateTimeField } from '../internals/hooks/defaultizedFieldProps';
import { PickerValue } from '../internals/models';
import { useGetOpenDialogAriaLabel } from '../internals/hooks/useGetOpenDialogAriaLabel';

export const useDateTimeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateTimeField<
    UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date-time');

  const getOpenDialogAriaLabel = useGetOpenDialogAriaLabel({
    formatKey: 'fullDate',
    translationKey: 'openDatePickerDialogue',
  });

  return useField<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalProps
  >({
    forwardedProps,
    internalProps,
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateDateTime,
    valueType: 'date-time',
    getOpenDialogAriaLabel,
  });
};

'use client';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.types';
import { validateDate } from '../validation';
import { useSplitFieldProps } from '../hooks';
import { useDefaultizedDateField } from '../internals/hooks/defaultizedFieldProps';
import { PickerValue } from '../internals/models';
import { useGetOpenDialogAriaLabel } from '../internals/hooks/useGetOpenDialogAriaLabel';

export const useDateField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedDateField<
    UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');

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
    validator: validateDate,
    valueType: 'date',
    getOpenDialogAriaLabel,
  });
};

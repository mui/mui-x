import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import { UseMobilePickerParams, UseMobilePickerProps } from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { onSpaceOrEnter } from '../../utils/utils';
import { PickersLayout } from '../../../PickersLayout';
import { FieldRef, InferError } from '../../../models';
import { BaseSingleInputFieldProps, DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import { PickerProvider } from '../../components/PickerProvider';

/**
 * Hook managing all the single-date mobile pickers:
 * - MobileDatePicker
 * - MobileDateTimePicker
 * - MobileTimePicker
 */
export const useMobilePicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseMobilePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
>({
  props,
  getOpenDialogAriaText,
  ...pickerParams
}: UseMobilePickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    format,
    formatDensity,
    enableAccessibleFieldDOMStructure,
    selectedSections,
    onSelectedSectionsChange,
    timezone,
    name,
    label,
    inputRef,
    readOnly,
    disabled,
    localeText,
  } = props;

  const fieldRef = React.useRef<FieldRef<PickerValue>>(null);

  const labelId = useId();
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const {
    providerProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
    ownerState,
  } = usePicker<PickerValue, TView, TExternalProps>({
    ...pickerParams,
    props,
    fieldRef,
    localeText,
    autoFocusView: true,
    variant: 'mobile',
  });

  const Field = slots.field;
  const fieldProps: BaseSingleInputFieldProps<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      // Internal props
      readOnly: readOnly ?? true,
      disabled,
      format,
      formatDensity,
      enableAccessibleFieldDOMStructure,
      selectedSections,
      onSelectedSectionsChange,
      timezone,
      ...pickerFieldProps, // onChange and value

      // Forwarded props
      className,
      sx,
      label,
      name,
      ...(isToolbarHidden && { id: labelId }),
      ...(!(disabled || readOnly) && {
        // These direct access to `providerProps` will go away in https://github.com/mui/mui-x/pull/15671
        onClick: (event: React.UIEvent) => {
          event.preventDefault();
          providerProps.contextValue.setOpen(true);
        },
        onKeyDown: onSpaceOrEnter(() => providerProps.contextValue.setOpen(true)),
      }),
      ...(!!inputRef && { inputRef }),
    },
    ownerState,
  });

  // TODO: Move to `useSlotProps` when https://github.com/mui/material-ui/pull/35088 will be merged
  fieldProps.inputProps = {
    ...fieldProps.inputProps,
    'aria-label': getOpenDialogAriaText(pickerFieldProps.value),
  } as typeof fieldProps.inputProps;

  const slotsForField = {
    textField: slots.textField,
    ...fieldProps.slots,
  };

  const Layout = slots.layout ?? PickersLayout;

  let labelledById = labelId;
  if (isToolbarHidden) {
    if (label) {
      labelledById = `${labelId}-label`;
    } else {
      labelledById = undefined;
    }
  }
  const slotProps = {
    ...innerSlotProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
    },
    mobilePaper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.mobilePaper,
    },
  };

  const handleFieldRef = useForkRef(fieldRef, fieldProps.unstableFieldRef);

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <Field
        {...fieldProps}
        slots={slotsForField}
        slotProps={slotProps}
        unstableFieldRef={handleFieldRef}
      />
      <PickersModalDialog slots={slots} slotProps={slotProps}>
        <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
          {renderCurrentView()}
        </Layout>
      </PickersModalDialog>
    </PickerProvider>
  );

  return { renderPicker };
};

import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import {
  UseMobilePickerParams,
  UseMobilePickerProps,
  UseMobilePickerSlotProps,
} from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { onSpaceOrEnter } from '../../utils/utils';
import { PickersLayout } from '../../../PickersLayout';
import {
  FieldSection,
  BaseSingleInputFieldProps,
  PickerValidDate,
  FieldRef,
  InferError,
  PickerOwnerState,
} from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';
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

  const fieldRef = React.useRef<FieldRef<FieldSection>>(null);

  const labelId = useId();
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const {
    open,
    actions,
    layoutProps,
    providerProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
    ownerState,
  } = usePicker<PickerValidDate | null, TView, FieldSection, TExternalProps, {}>({
    ...pickerParams,
    props,
    fieldRef,
    localeText,
    autoFocusView: true,
    additionalViewProps: {},
    wrapperVariant: 'mobile',
  });

  const Field = slots.field;
  const fieldProps = useSlotProps<
    typeof Field,
    UseMobilePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>['field'],
    Partial<
      BaseSingleInputFieldProps<
        PickerValidDate | null,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        InferError<TExternalProps>
      >
    >,
    PickerOwnerState
  >({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      ...(isToolbarHidden && { id: labelId }),
      ...(!(disabled || readOnly) && {
        onClick: actions.onOpen,
        onKeyDown: onSpaceOrEnter(actions.onOpen),
      }),
      readOnly: readOnly ?? true,
      disabled,
      className,
      sx,
      format,
      formatDensity,
      enableAccessibleFieldDOMStructure,
      selectedSections,
      onSelectedSectionsChange,
      timezone,
      label,
      name,
      ...(inputRef ? { inputRef } : {}),
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
      <PickersModalDialog {...actions} open={open} slots={slots} slotProps={slotProps}>
        <Layout {...layoutProps} {...slotProps?.layout} slots={slots} slotProps={slotProps}>
          {renderCurrentView()}
        </Layout>
      </PickersModalDialog>
    </PickerProvider>
  );

  return { renderPicker };
};

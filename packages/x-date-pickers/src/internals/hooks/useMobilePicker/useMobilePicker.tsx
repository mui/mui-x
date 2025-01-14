import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import { UseMobilePickerParams, UseMobilePickerProps } from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { PickersLayout } from '../../../PickersLayout';
import { FieldRef, InferError } from '../../../models';
import { BaseSingleInputFieldProps, DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import { PickerProvider } from '../../components/PickerProvider';
import { PickerFieldUIContextProvider } from '../../components/PickerFieldUI';

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
  ...pickerParams
}: UseMobilePickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    name,
    label,
    inputRef,
    readOnly,
    autoFocus,
    localeText,
  } = props;

  const fieldRef = React.useRef<FieldRef<PickerValue>>(null);

  const labelId = useId();
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const { providerProps, renderCurrentView, ownerState } = usePicker<
    PickerValue,
    TView,
    TExternalProps
  >({
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
      readOnly,
      autoFocus: autoFocus && !props.open,

      // Forwarded props
      className,
      sx,
      label,
      name,
      focused: providerProps.contextValue.open ? true : undefined,
      ...(isToolbarHidden && { id: labelId }),
      ...(!!inputRef && { inputRef }),
    },
    ownerState,
  });

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
      <PickerFieldUIContextProvider slots={slots} slotProps={slotProps}>
        <Field {...fieldProps} unstableFieldRef={handleFieldRef} />
        <PickersModalDialog slots={slots} slotProps={slotProps}>
          <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
            {renderCurrentView()}
          </Layout>
        </PickersModalDialog>
      </PickerFieldUIContextProvider>
    </PickerProvider>
  );

  return { renderPicker };
};

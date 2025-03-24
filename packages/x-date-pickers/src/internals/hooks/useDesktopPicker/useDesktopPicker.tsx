import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { PickerPopper } from '../../components/PickerPopper/PickerPopper';
import { UseDesktopPickerParams, UseDesktopPickerProps } from './useDesktopPicker.types';
import { usePicker } from '../usePicker';
import { PickersLayout } from '../../../PickersLayout';
import { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import { PickerProvider } from '../../components/PickerProvider';
import { PickerFieldUIContextProvider } from '../../components/PickerFieldUI';
import { useNonRangePickerStepNavigation } from '../useNonRangePickerStepNavigation';

/**
 * Hook managing all the single-date desktop pickers:
 * - DesktopDatePicker
 * - DesktopDateTimePicker
 * - DesktopTimePicker
 */
export const useDesktopPicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopPickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
>({
  props,
  steps,
  ...pickerParams
}: UseDesktopPickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  const { slots, slotProps: innerSlotProps, label, inputRef, localeText } = props;

  const getStepNavigation = useNonRangePickerStepNavigation({ steps });

  const { providerProps, renderCurrentView, ownerState } = usePicker<
    PickerValue,
    TView,
    TExternalProps
  >({
    ...pickerParams,
    props,
    localeText,
    autoFocusView: true,
    viewContainerRole: 'dialog',
    variant: 'desktop',
    getStepNavigation,
  });

  const labelId = providerProps.privateContextValue.labelId;
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const Field = slots.field;
  const { ownerState: fieldOwnerState, ...fieldProps } = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      // Forwarded props
      ...(isToolbarHidden && { id: labelId }),
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
    popper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.popper,
    },
  };

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <PickerFieldUIContextProvider slots={slots} slotProps={slotProps} inputRef={inputRef}>
        <Field {...fieldProps} />
        <PickerPopper slots={slots} slotProps={slotProps}>
          <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
            {renderCurrentView()}
          </Layout>
        </PickerPopper>
      </PickerFieldUIContextProvider>
    </PickerProvider>
  );

  return { renderPicker };
};

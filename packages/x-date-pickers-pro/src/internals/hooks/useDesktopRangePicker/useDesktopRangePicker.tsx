import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useLicenseVerifier } from '@mui/x-license';
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  PickerPopper,
  DateOrTimeViewWithMeridiem,
  PickerProvider,
  PickerRangeValue,
  PickerFieldUIContextProvider,
} from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerParams,
  UseDesktopRangePickerProps,
} from './useDesktopRangePicker.types';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { useRangePosition } from '../useRangePosition';
import { PickerRangePositionContext } from '../../../hooks/usePickerRangePositionContext';
import { getRangeFieldType } from '../../utils/date-fields-utils';

const releaseInfo = getReleaseInfo();

export const useDesktopRangePicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopRangePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
>({
  props,
  ...pickerParams
}: UseDesktopRangePickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const { slots, slotProps, inputRef, localeText } = props;

  const fieldType = getRangeFieldType(slots.field);
  const viewContainerRole = fieldType === 'single-input' ? 'dialog' : 'tooltip';
  const rangePositionResponse = useRangePosition(props);

  const { providerProps, renderCurrentView, ownerState } = usePicker<
    PickerRangeValue,
    TView,
    TExternalProps
  >({
    ...pickerParams,
    props,
    variant: 'desktop',
    autoFocusView: viewContainerRole === 'dialog',
    viewContainerRole,
    localeText,
    goToNextStep,
    goToPreviousStep,
  });

  function goToNextStep() {
    if (rangePositionResponse.rangePosition === 'start') {
      rangePositionResponse.setRangePosition('end');
      providerProps.actionsContextValue.setView(providerProps.contextValue.views[0]);
    }
  }

  function goToPreviousStep() {
    if (rangePositionResponse.rangePosition === 'end') {
      rangePositionResponse.setRangePosition('start');
      providerProps.actionsContextValue.setView(providerProps.contextValue.views[0]);
    }
  }

  const Field = slots.field;

  const { ownerState: fieldOwnerState, ...fieldProps } = useSlotProps({
    elementType: Field,
    externalSlotProps: slotProps?.field,
    ownerState,
  });

  const Layout = slots?.layout ?? PickersLayout;

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <PickerFieldUIContextProvider slots={slots} slotProps={slotProps} inputRef={inputRef}>
        <PickerRangePositionContext.Provider value={rangePositionResponse}>
          <Field {...fieldProps} />
          <PickerPopper slots={slots} slotProps={slotProps}>
            <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
              {renderCurrentView()}
            </Layout>
          </PickerPopper>
        </PickerRangePositionContext.Provider>
      </PickerFieldUIContextProvider>
    </PickerProvider>
  );

  return {
    renderPicker,
  };
};

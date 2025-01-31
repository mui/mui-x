import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useLicenseVerifier } from '@mui/x-license';
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  PickersModalDialog,
  ExportedBaseToolbarProps,
  DateOrTimeViewWithMeridiem,
  PickerProvider,
  PickerRangeValue,
  PickerFieldUIContextProvider,
} from '@mui/x-date-pickers/internals';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import useId from '@mui/utils/useId';
import {
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { useRangePosition } from '../useRangePosition';
import { PickerRangePositionContext } from '../../../hooks/usePickerRangePositionContext';

const releaseInfo = getReleaseInfo();

export const useMobileRangePicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseMobileRangePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
>({
  props,
  ...pickerParams
}: UseMobileRangePickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const { slots, slotProps: innerSlotProps, label, inputRef, localeText } = props;

  const fieldType = (slots.field as any).fieldType ?? 'multi-input';
  const rangePositionResponse = useRangePosition(props);
  const labelId = useId();
  const contextTranslations = usePickerTranslations();

  const { providerProps, renderCurrentView, ownerState } = usePicker<
    PickerRangeValue,
    TView,
    TExternalProps
  >({
    ...pickerParams,
    props,
    variant: 'mobile',
    autoFocusView: true,
    viewContainerRole: 'dialog',
    localeText,
  });

  const Field = slots.field;
  const { ownerState: fieldOwnerState, ...fieldProps } = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      ...(fieldType === 'single-input' && {
        id: labelId,
      }),
    },
    ownerState,
  });

  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const Layout = slots?.layout ?? PickersLayout;

  const finalLocaleText = {
    ...contextTranslations,
    ...localeText,
  };
  let labelledById =
    pickerParams.valueType === 'date-time'
      ? `${labelId}-start-toolbar ${labelId}-end-toolbar`
      : labelId;
  if (isToolbarHidden) {
    const labels: string[] = [];
    if (fieldType === 'multi-input') {
      if (finalLocaleText.start) {
        labels.push(`${labelId}-start-label`);
      }
      if (finalLocaleText.end) {
        labels.push(`${labelId}-end-label`);
      }
    } else if (label != null) {
      labels.push(`${labelId}-label`);
    }

    labelledById = labels.length > 0 ? labels.join(' ') : undefined;
  }
  const slotProps = {
    ...innerSlotProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
    } as ExportedBaseToolbarProps,
    mobilePaper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.mobilePaper,
    },
  };

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <PickerFieldUIContextProvider slots={slots} slotProps={slotProps} inputRef={inputRef}>
        <PickerRangePositionContext.Provider value={rangePositionResponse}>
          <Field {...fieldProps} />
          <PickersModalDialog slots={slots} slotProps={slotProps}>
            <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
              {renderCurrentView()}
            </Layout>
          </PickersModalDialog>
        </PickerRangePositionContext.Provider>
      </PickerFieldUIContextProvider>
    </PickerProvider>
  );

  return {
    renderPicker,
  };
};

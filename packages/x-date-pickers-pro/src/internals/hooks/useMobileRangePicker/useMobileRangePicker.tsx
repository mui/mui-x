import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
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
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import {
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { useRangePosition } from '../useRangePosition';
import { PickerRangePositionContext } from '../../../hooks/usePickerRangePositionContext';
import { getRangeFieldType } from '../../utils/date-fields-utils';
import { useRangePickerStepNavigation } from '../useRangePickerStepNavigation';

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
  steps,
  ...pickerParams
}: UseMobileRangePickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const { slots, slotProps: innerSlotProps, label, inputRef, localeText } = props;

  const fieldType = getRangeFieldType(slots.field);
  const rangePositionResponse = useRangePosition(props);
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
    goToNextStep,
    goToPreviousStep,
  });

  const stepNavigation = useRangePickerStepNavigation({
    steps,
    rangePositionResponse,
    contextValue: providerProps.contextValue,
  });

  function goToNextStep() {
    stepNavigation.goToNextStep();
  }

  function goToPreviousStep() {
    stepNavigation.goToPreviousStep();
  }

  const labelId = providerProps.privateContextValue.labelId;
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const Field = slots.field;
  const { ownerState: fieldOwnerState, ...fieldProps } = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      ...(fieldType === 'single-input' &&
        isToolbarHidden && {
          id: labelId,
        }),
    },
    ownerState,
  });

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
    ...((fieldType === 'multi-input' && {
      textField: (slotOwnerState: FieldOwnerState & { position: 'start' | 'end' }) => {
        return {
          ...resolveComponentProps(innerSlotProps?.textField, slotOwnerState),
          id: `${labelId}-${slotOwnerState.position}`,
        };
      },
    }) as any),
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

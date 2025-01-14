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
  PickerValue,
  PickerFieldUIContextProvider,
} from '@mui/x-date-pickers/internals';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { FieldRef, InferError } from '@mui/x-date-pickers/models';
import useId from '@mui/utils/useId';
import {
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import {
  RangePickerPropsForFieldSlot,
  useEnrichedRangePickerField,
} from '../useEnrichedRangePickerField';
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

  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    label,
    inputRef,
    name,
    readOnly,
    disableOpenPicker,
    localeText,
  } = props;

  const startFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const endFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const singleInputFieldRef = React.useRef<FieldRef<PickerRangeValue>>(null);

  const fieldType = (slots.field as any).fieldType ?? 'multi-input';
  const rangePositionResponse = useRangePosition(
    props,
    fieldType === 'single-input' ? singleInputFieldRef : undefined,
  );
  const labelId = useId();
  const contextTranslations = usePickerTranslations();

  let fieldRef: React.Ref<FieldRef<PickerValue> | FieldRef<PickerRangeValue>>;
  if (fieldType === 'single-input') {
    fieldRef = singleInputFieldRef;
  } else if (rangePositionResponse.rangePosition === 'start') {
    fieldRef = startFieldRef;
  } else {
    fieldRef = endFieldRef;
  }

  const { providerProps, renderCurrentView, ownerState } = usePicker<
    PickerRangeValue,
    TView,
    TExternalProps
  >({
    ...pickerParams,
    props,
    variant: 'mobile',
    autoFocusView: true,
    fieldRef,
    localeText,
  });

  // Temporary hack to hide the opening button on the range pickers until we have migrate them to the new opening logic.
  providerProps.contextValue.triggerStatus = 'hidden';

  const Field = slots.field;
  const fieldProps: RangePickerPropsForFieldSlot<
    boolean,
    TEnableAccessibleFieldDOMStructure,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      // Internal props
      readOnly: readOnly ?? true,

      // Forwarded props
      className,
      sx,
      ...(fieldType === 'single-input' && !!inputRef && { inputRef }),
      ...(fieldType === 'single-input' && { name }),
    },
    ownerState,
  });

  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const enrichedFieldResponse = useEnrichedRangePickerField<
    TView,
    TEnableAccessibleFieldDOMStructure,
    InferError<TExternalProps>
  >({
    variant: 'mobile',
    fieldType,
    // These direct access to `providerProps` will go away once the range fields handle the picker opening
    contextValue: providerProps.contextValue,
    fieldPrivateContextValue: providerProps.fieldPrivateContextValue,
    readOnly,
    labelId,
    disableOpenPicker,
    label,
    localeText,
    pickerSlots: slots,
    pickerSlotProps: innerSlotProps,
    fieldProps,
    startFieldRef,
    endFieldRef,
    singleInputFieldRef,
    ...rangePositionResponse,
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
  };

  const renderPicker = () => (
    <PickerProvider
      {...providerProps}
      // This override will go away once the range fields handle the picker opening
      fieldPrivateContextValue={{
        ...providerProps.fieldPrivateContextValue,
        ...enrichedFieldResponse.fieldPrivateContextValue,
      }}
    >
      <PickerFieldUIContextProvider slots={slots} slotProps={slotProps}>
        <PickerRangePositionContext.Provider value={rangePositionResponse}>
          <Field {...enrichedFieldResponse.fieldProps} />
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

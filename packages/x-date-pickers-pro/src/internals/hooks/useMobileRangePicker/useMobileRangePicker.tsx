import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useLicenseVerifier } from '@mui/x-license';
import { PickersLayout, PickersLayoutSlotProps } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  PickersModalDialog,
  ExportedBaseToolbarProps,
  DateOrTimeViewWithMeridiem,
  ExportedBaseTabsProps,
  PickerProvider,
  PickerRangeValue,
  PickerValue,
} from '@mui/x-date-pickers/internals';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { FieldRef, InferError } from '@mui/x-date-pickers/models';
import useId from '@mui/utils/useId';
import {
  MobileRangePickerAdditionalViewProps,
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import {
  RangePickerPropsForFieldSlot,
  useEnrichedRangePickerFieldProps,
} from '../useEnrichedRangePickerFieldProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { useRangePosition } from '../useRangePosition';

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
    format,
    formatDensity,
    enableAccessibleFieldDOMStructure,
    selectedSections,
    onSelectedSectionsChange,
    timezone,
    label,
    inputRef,
    name,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
  } = props;

  const startFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const endFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const singleInputFieldRef = React.useRef<FieldRef<PickerRangeValue>>(null);

  const fieldType = (slots.field as any).fieldType ?? 'multi-input';
  const { rangePosition, onRangePositionChange } = useRangePosition(
    props,
    fieldType === 'single-input' ? singleInputFieldRef : undefined,
  );
  const labelId = useId();
  const contextTranslations = usePickerTranslations();

  let fieldRef: React.Ref<FieldRef<PickerValue> | FieldRef<PickerRangeValue>>;
  if (fieldType === 'single-input') {
    fieldRef = singleInputFieldRef;
  } else if (rangePosition === 'start') {
    fieldRef = startFieldRef;
  } else {
    fieldRef = endFieldRef;
  }

  const {
    open,
    actions,
    layoutProps,
    providerProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
    ownerState,
  } = usePicker<PickerRangeValue, TView, TExternalProps, MobileRangePickerAdditionalViewProps>({
    ...pickerParams,
    props,
    variant: 'mobile',
    autoFocusView: true,
    fieldRef,
    localeText,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
  });

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
      ...(fieldType === 'single-input' && !!inputRef && { inputRef }),
      ...(fieldType === 'single-input' && { name }),
    },
    ownerState,
  });

  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const enrichedFieldProps = useEnrichedRangePickerFieldProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    InferError<TExternalProps>
  >({
    variant: 'mobile',
    fieldType,
    open,
    actions,
    readOnly,
    labelId,
    disableOpenPicker,
    label,
    localeText,
    rangePosition,
    onRangePositionChange,
    pickerSlots: slots,
    pickerSlotProps: innerSlotProps,
    fieldProps,
    startFieldRef,
    endFieldRef,
    singleInputFieldRef,
  });

  const slotPropsForLayout: PickersLayoutSlotProps<PickerRangeValue, TView> = {
    ...innerSlotProps,
    tabs: {
      ...innerSlotProps?.tabs,
      rangePosition,
      onRangePositionChange,
    } as ExportedBaseTabsProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
      rangePosition,
      onRangePositionChange,
    } as ExportedBaseToolbarProps,
  };

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
    mobilePaper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.mobilePaper,
    },
  };

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <Field {...enrichedFieldProps} />
      <PickersModalDialog {...actions} open={open} slots={slots} slotProps={slotProps}>
        <Layout
          {...layoutProps}
          {...slotProps?.layout}
          slots={slots}
          slotProps={slotPropsForLayout}
        >
          {renderCurrentView()}
        </Layout>
      </PickersModalDialog>
    </PickerProvider>
  );

  return {
    renderPicker,
  };
};

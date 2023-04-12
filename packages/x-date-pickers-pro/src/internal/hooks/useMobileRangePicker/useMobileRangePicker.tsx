import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersLayout,
  PickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  PickersModalDialog,
  InferError,
  ExportedBaseToolbarProps,
  useLocaleText,
} from '@mui/x-date-pickers/internals';
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import useId from '@mui/utils/useId';
import {
  MobileRangePickerAdditionalViewProps,
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { useEnrichedRangePickerFieldProps } from '../useEnrichedRangePickerFieldProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../models/range';
import { BaseMultiInputFieldProps, RangeFieldSection } from '../../models/fields';
import { useRangePosition } from '../useRangePosition';

const releaseInfo = getReleaseInfo();

export const useMobileRangePicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  validator,
}: UseMobileRangePickerParams<TDate, TView, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    format,
    formatDensity,
    label,
    inputRef,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
  } = props;

  const { rangePosition, onRangePositionChange, singleInputFieldRef } = useRangePosition(props);
  const labelId = useId();
  const contextLocaleText = useLocaleText();

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
  } = usePicker<
    DateRange<TDate>,
    TDate,
    TView,
    RangeFieldSection,
    TExternalProps,
    MobileRangePickerAdditionalViewProps
  >({
    props,
    valueManager,
    wrapperVariant: 'mobile',
    validator,
    autoFocusView: true,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
  });

  const Field = slots.field;
  const fieldType = (Field as any).fieldType ?? 'multi-input';

  const fieldProps: BaseMultiInputFieldProps<
    DateRange<TDate>,
    RangeFieldSection,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly: readOnly ?? true,
      disabled,
      className,
      sx,
      format,
      formatDensity,
      ...(fieldType === 'single-input' && { inputRef }),
    },
    ownerState: props,
  });

  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const enrichedFieldProps = useEnrichedRangePickerFieldProps<
    TDate,
    TView,
    InferError<TExternalProps>
  >({
    wrapperVariant: 'mobile',
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
    singleInputFieldRef,
    pickerSlots: slots,
    pickerSlotProps: innerSlotProps,
    fieldProps,
  });

  const slotPropsForLayout: PickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView> = {
    ...innerSlotProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
      rangePosition,
      onRangePositionChange,
    } as ExportedBaseToolbarProps,
  };

  const Layout = slots?.layout ?? PickersLayout;

  const finalLocaleText = {
    ...contextLocaleText,
    ...localeText,
  };
  let labelledById = labelId;
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
    <LocalizationProvider localeText={localeText}>
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
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};

import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersLayout, PickersLayoutSlotProps } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  PickersModalDialog,
  InferError,
  ExportedBaseToolbarProps,
  useLocaleText,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import useId from '@mui/utils/useId';
import { UsePickerValueFieldResponse } from '@mui/x-date-pickers/internals/hooks/usePicker';
import {
  MobileRangePickerAdditionalViewProps,
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
  UseMobileRangePickerSlotProps,
} from './useMobileRangePicker.types';
import { useEnrichedRangePickerFieldProps } from '../useEnrichedRangePickerFieldProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../../models';
import { BaseMultiInputFieldProps, RangeFieldSection } from '../../models/fields';
import { useRangePosition } from '../useRangePosition';

const releaseInfo = getReleaseInfo();

export const useMobileRangePicker = <
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  ...pickerParams
}: UseMobileRangePickerParams<TDate, TView, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    format,
    formatDensity,
    timezone,
    label,
    inputRef,
    name,
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
    ...pickerParams,
    props,
    wrapperVariant: 'mobile',
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
    TDate,
    RangeFieldSection,
    InferError<TExternalProps>
  > = useSlotProps<
    typeof Field,
    UseMobileRangePickerSlotProps<TDate, TView>['field'],
    UsePickerValueFieldResponse<DateRange<TDate>, RangeFieldSection, InferError<TExternalProps>> &
      Partial<
        Pick<
          UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
          | 'readOnly'
          | 'disabled'
          | 'className'
          | 'sx'
          | 'format'
          | 'formatDensity'
          | 'timezone'
          | 'label'
          | 'name'
          | 'autoFocus'
        >
      >,
    TExternalProps
  >({
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
      timezone,
      ...(fieldType === 'single-input' && { inputRef, name }),
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

  const slotPropsForLayout: PickersLayoutSlotProps<DateRange<TDate>, TDate, TView> = {
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

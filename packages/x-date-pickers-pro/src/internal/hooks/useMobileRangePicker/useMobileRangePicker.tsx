import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersLayout,
  PickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  DateOrTimeView,
  usePicker,
  WrapperVariantContext,
  PickersModalDialog,
  InferError,
  ExportedBaseToolbarProps,
  useLocaleText,
} from '@mui/x-date-pickers/internals';
import useId from '@mui/utils/useId';
import {
  MobileRangePickerAdditionalViewProps,
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { useRangePickerInputProps } from '../useRangePickerInputProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../models/range';
import { BaseMultiInputFieldProps } from '../../models/fields';
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
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
  } = props;

  const { rangePosition, onRangePositionChange } = useRangePosition(props);
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

  const fieldSlotProps = useRangePickerInputProps({
    wrapperVariant: 'mobile',
    open,
    actions,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
    rangePosition,
    onRangePositionChange,
  });

  const Field = slots.field;
  const fieldProps: BaseMultiInputFieldProps<
    DateRange<TDate>,
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
    },
    ownerState: props,
  });

  const slotsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slots'] = {
    textField: slots.textField,
    ...fieldProps.slots,
  };

  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const slotPropsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slotProps'] = {
    ...fieldProps.slotProps,
    textField: (ownerState) => {
      const externalInputProps = resolveComponentProps(innerSlotProps?.textField, ownerState);
      return {
        ...(isToolbarHidden && { id: `${labelId}-${ownerState.position}` }),
        ...externalInputProps,
        ...(ownerState.position === 'start' ? fieldSlotProps.startInput : fieldSlotProps.endInput),
      };
    },
    root: (ownerState) => {
      const externalRootProps = resolveComponentProps(innerSlotProps?.fieldRoot, ownerState);
      return {
        ...externalRootProps,
        ...fieldSlotProps.root,
      };
    },
    separator: (ownerState) => {
      const externalSeparatorProps = resolveComponentProps(
        innerSlotProps?.fieldSeparator,
        ownerState,
      );
      return {
        ...externalSeparatorProps,
        ...fieldSlotProps.root,
      };
    },
  };

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
    if (finalLocaleText.start) {
      labels.push(`${labelId}-start-label`);
    }
    if (finalLocaleText.end) {
      labels.push(`${labelId}-end-label`);
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
      <WrapperVariantContext.Provider value="mobile">
        <Field {...fieldProps} slots={slotsForField} slotProps={slotPropsForField} />
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
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};

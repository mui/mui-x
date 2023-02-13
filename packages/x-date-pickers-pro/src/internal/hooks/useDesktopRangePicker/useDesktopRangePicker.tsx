import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersLayout,
  PickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  DateOrTimeView,
  executeInTheNextEventLoopTick,
  getActiveElement,
  usePicker,
  WrapperVariantContext,
  PickersPopper,
  InferError,
  ExportedBaseToolbarProps,
} from '@mui/x-date-pickers/internals';
import {
  DesktopRangePickerAdditionalViewProps,
  UseDesktopRangePickerParams,
  UseDesktopRangePickerProps,
} from './useDesktopRangePicker.types';
import { useRangePickerFieldSlotProps } from '../useRangePickerFieldSlotProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../models/range';
import { BaseMultiInputFieldProps } from '../../models/fields';
import { useRangePosition } from '../useRangePosition';

const releaseInfo = getReleaseInfo();

export const useDesktopRangePicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  validator,
}: UseDesktopRangePickerParams<TDate, TView, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    slots,
    slotProps,
    className,
    sx,
    format,
    readOnly,
    disabled,
    autoFocus,
    disableOpenPicker,
    localeText,
  } = props;

  const fieldRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);

  const { rangePosition, onRangePositionChange } = useRangePosition(props);

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
  } = usePicker<
    DateRange<TDate>,
    TDate,
    TView,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  >({
    props,
    valueManager,
    wrapperVariant: 'desktop',
    validator,
    autoFocusView: true,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
  });

  const handleBlur = () => {
    executeInTheNextEventLoopTick(() => {
      if (
        fieldRef.current?.contains(getActiveElement(document)) ||
        popperRef.current?.contains(getActiveElement(document))
      ) {
        return;
      }

      actions.onDismiss();
    });
  };

  const Field = slots.field;
  const fieldProps: BaseMultiInputFieldProps<
    DateRange<TDate>,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: slotProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly,
      disabled,
      className,
      sx,
      format,
      autoFocus: autoFocus && !props.open,
      ref: fieldRef,
    },
    ownerState: props,
  });

  const fieldType = (Field as any).isSingleInput ? 'single-input' : 'multi-input';

  const slotPropsForField = useRangePickerFieldSlotProps({
    wrapperVariant: 'desktop',
    fieldType,
    open,
    actions,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
    onBlur: handleBlur,
    rangePosition,
    onRangePositionChange,
    pickerSlotProps: slotProps,
    fieldSlotProps: fieldProps.slotProps,
  });

  const slotsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slots'] = {
    textField: slots.textField,
    root: slots.fieldRoot,
    separator: slots.fieldSeparator,
    ...fieldProps.slots,
  };

  const slotPropsForLayout: PickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView> = {
    ...slotProps,
    toolbar: {
      ...slotProps?.toolbar,
      rangePosition,
      onRangePositionChange,
    } as ExportedBaseToolbarProps,
  };
  const Layout = slots?.layout ?? PickersLayout;

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field {...fieldProps} slots={slotsForField} slotProps={slotPropsForField} />
        <PickersPopper
          role="tooltip"
          containerRef={popperRef}
          anchorEl={fieldRef.current}
          onBlur={handleBlur}
          {...actions}
          open={open}
          slots={slots}
          slotProps={slotProps}
          shouldRestoreFocus={shouldRestoreFocus}
        >
          <Layout
            {...layoutProps}
            {...slotProps?.layout}
            slots={slots}
            slotProps={slotPropsForLayout}
          >
            {renderCurrentView()}
          </Layout>
        </PickersPopper>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};

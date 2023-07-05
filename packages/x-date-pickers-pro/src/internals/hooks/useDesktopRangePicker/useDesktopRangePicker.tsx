import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersLayout,
  PickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  executeInTheNextEventLoopTick,
  getActiveElement,
  usePicker,
  PickersPopper,
  InferError,
  ExportedBaseToolbarProps,
  BaseFieldProps,
  isInternalTimeView,
} from '@mui/x-date-pickers/internals';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import { FieldRef } from '@mui/x-date-pickers/models';
import {
  DesktopRangePickerAdditionalViewProps,
  UseDesktopRangePickerParams,
  UseDesktopRangePickerProps,
} from './useDesktopRangePicker.types';
import { useEnrichedRangePickerFieldProps } from '../useEnrichedRangePickerFieldProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../models/range';
import { RangeFieldSection } from '../../models/fields';
import { useRangePosition } from '../useRangePosition';

const releaseInfo = getReleaseInfo();

export const useDesktopRangePicker = <
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  ...pickerParams
}: UseDesktopRangePickerParams<TDate, TView, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    slots,
    slotProps: inSlotProps,
    className,
    sx,
    format,
    formatDensity,
    timezone,
    label,
    inputRef,
    readOnly,
    disabled,
    autoFocus,
    disableOpenPicker,
    localeText,
    onViewChange,
    views,
  } = props;

  const fieldContainerRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);

  const { rangePosition, onRangePositionChange, singleInputFieldRef } = useRangePosition(props);

  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);
  const startFieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);
  const endFieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);

  const slotProps = {
    ...inSlotProps,
    textField: (ownerState) => ({
      ...inSlotProps?.textField,
      inputRef: ownerState.position === 'start' ? startInputRef : endInputRef,
    }),
  };

  const handleViewChange = React.useCallback(
    (view: TView) => {
      let inputToFocus = rangePosition === 'start' ? startInputRef.current : endInputRef.current;
      let currentFieldRef = rangePosition === 'start' ? startFieldRef.current : endFieldRef.current;
      let newView = view;
      if (view === 'day' && rangePosition === 'start') {
        onRangePositionChange('end');
        inputToFocus = endInputRef.current;
        currentFieldRef = endFieldRef.current;
        newView = views.filter(isInternalTimeView)[0];
      }
      if (view === 'hours' && rangePosition === 'end') {
        onRangePositionChange('start');
        inputToFocus = startInputRef.current;
        currentFieldRef = startFieldRef.current;
      }
      onViewChange?.(newView);
      inputToFocus?.focus();
      currentFieldRef?.setSelectedSections(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition, views],
  );

  const finalProps = React.useMemo(
    () => ({
      ...props,
      onViewChange: handleViewChange,
    }),
    [handleViewChange, props],
  );

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
    RangeFieldSection,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  >({
    ...pickerParams,
    props: finalProps,
    wrapperVariant: 'desktop',
    autoFocusView: false,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
  });

  const handleBlur = () => {
    executeInTheNextEventLoopTick(() => {
      if (
        fieldContainerRef.current?.contains(getActiveElement(document)) ||
        popperRef.current?.contains(getActiveElement(document))
      ) {
        return;
      }

      actions.onDismiss();
    });
  };

  const Field = slots.field;
  const fieldType = (Field as any).fieldType ?? 'multi-input';

  const fieldProps: BaseFieldProps<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
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
      formatDensity,
      timezone,
      autoFocus: autoFocus && !props.open,
      ref: fieldContainerRef,
      unstableStartFieldRef: startFieldRef,
      unstableEndFieldRef: endFieldRef,
      ...(fieldType === 'single-input' && { inputRef }),
    },
    ownerState: props,
  });

  const enrichedFieldProps = useEnrichedRangePickerFieldProps<
    TDate,
    TView,
    InferError<TExternalProps>
  >({
    wrapperVariant: 'desktop',
    fieldType,
    open,
    actions,
    readOnly,
    disableOpenPicker,
    label,
    localeText,
    onBlur: handleBlur,
    rangePosition,
    onRangePositionChange,
    singleInputFieldRef,
    pickerSlotProps: slotProps,
    pickerSlots: slots,
    fieldProps,
  });

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
      <Field {...enrichedFieldProps} />
      <PickersPopper
        role="tooltip"
        containerRef={popperRef}
        anchorEl={fieldContainerRef.current}
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
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};

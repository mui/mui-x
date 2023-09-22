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
} from '@mui/x-date-pickers/internals';
import { FieldRef } from '@mui/x-date-pickers/models';
import {
  DesktopDateTimeRangePickerAdditionalViewProps,
  UseDesktopDateTimeRangePickerParams,
  UseDesktopDateTimeRangePickerProps,
} from './useDesktopDateTimeRangePicker.types';
import { useEnrichedRangePickerFieldProps } from '../useEnrichedRangePickerFieldProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../models/range';
import { RangeFieldSection } from '../../models/fields';
import { useRangePosition } from '../useRangePosition';
import { DateTimeRangePickerViews } from '../../models/dateTimeRange';

const releaseInfo = getReleaseInfo();

export const useDesktopDateTimeRangePicker = <
  TDate,
  TExternalProps extends UseDesktopDateTimeRangePickerProps<TDate, any, TExternalProps>,
>({
  props,
  ...pickerParams
}: UseDesktopDateTimeRangePickerParams<TDate, TExternalProps>) => {
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
    reduceAnimations,
  } = props;

  const fieldContainerRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);

  const { rangePosition, onRangePositionChange, singleInputFieldRef } = useRangePosition(props);

  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);
  const startFieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);
  const endFieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);

  const slotProps: TExternalProps['slotProps'] = {
    ...inSlotProps,
    textField: (ownerState) => ({
      ...inSlotProps?.textField,
      inputRef: ownerState.position === 'start' ? startInputRef : endInputRef,
    }),
  };

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
    DateTimeRangePickerViews,
    RangeFieldSection,
    TExternalProps,
    DesktopDateTimeRangePickerAdditionalViewProps
  >({
    ...pickerParams,
    props,
    wrapperVariant: 'desktop',
    autoFocusView: false,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
  });

  React.useEffect(() => {
    const view = layoutProps.view;
    if (!view || !open) {
      return;
    }
    // handle field re-focusing and section selection after view and/or range position change
    const inputToFocus = rangePosition === 'start' ? startInputRef.current : endInputRef.current;
    const currentFieldRef = rangePosition === 'start' ? startFieldRef.current : endFieldRef.current;
    inputToFocus?.focus();
    currentFieldRef?.setSelectedSections(view);
  }, [layoutProps.view, open, rangePosition]);

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
    DateTimeRangePickerViews,
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
    anchorRef,
  });

  const slotPropsForLayout: PickersLayoutSlotsComponentsProps<
    DateRange<TDate>,
    TDate,
    DateTimeRangePickerViews
  > = {
    ...slotProps,
    tabs: {
      ...slotProps?.tabs,
      rangePosition,
      onRangePositionChange,
    },
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
        placement="bottom-start"
        containerRef={popperRef}
        anchorEl={anchorRef.current}
        onBlur={handleBlur}
        {...actions}
        open={open}
        slots={slots}
        slotProps={slotProps}
        shouldRestoreFocus={shouldRestoreFocus}
        reduceAnimations={reduceAnimations}
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

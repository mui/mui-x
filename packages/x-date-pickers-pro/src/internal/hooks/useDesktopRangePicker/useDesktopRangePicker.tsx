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
  isDatePickerView,
  isInternalTimeView,
} from '@mui/x-date-pickers/internals';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import Box from '@mui/material/Box';
import { multiSectionDigitalClockSectionClasses } from '@mui/x-date-pickers/MultiSectionDigitalClock/multiSectionDigitalClockSectionClasses';
import Divider from '@mui/material/Divider';
import { VIEW_HEIGHT } from '@mui/x-date-pickers/internals/constants/dimensions';
import { DateTimeRangePickerTimeWrapper } from '../../../DateTimeRangePicker/DateTimeRangePickerTimeWrapper';
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
    slotProps,
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
  } = props;

  const fieldContainerRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);

  const { rangePosition, onRangePositionChange, singleInputFieldRef } = useRangePosition(props);

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
    props,
    wrapperVariant: 'desktop',
    autoFocusView: true,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
    rendererInterceptor(viewRenderers, popperView, rendererProps) {
      const finalProps = {
        ...rendererProps,
        focusedView: null,
        sx: {
          borderBottom: 0,
          width: 'auto',
          [`.${multiSectionDigitalClockSectionClasses.root}`]: {
            // subtract time range position controls height with it's border
            maxHeight: VIEW_HEIGHT - 33,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        },
      };
      return (
        <Box sx={{ display: 'flex', margin: '0 auto' }}>
          {isInternalTimeView(popperView) ? (
            <React.Fragment>
              {viewRenderers['day' as DateOrTimeViewWithMeridiem]?.({
                ...rendererProps,
                view: isDatePickerView(popperView) ? popperView : 'day',
              })}
              <Divider orientation="vertical" />
            </React.Fragment>
          ) : null}
          {isInternalTimeView(popperView) ? (
            <DateTimeRangePickerTimeWrapper
              {...finalProps}
              viewRenderer={viewRenderers[popperView]}
            />
          ) : (
            viewRenderers[popperView]?.(finalProps)
          )}
          {isDatePickerView(popperView) ? (
            <React.Fragment>
              <Divider orientation="vertical" />
              <DateTimeRangePickerTimeWrapper
                {...finalProps}
                view={isInternalTimeView(popperView) ? popperView : 'hours'}
                viewRenderer={viewRenderers['hours' as DateOrTimeViewWithMeridiem]}
              />
            </React.Fragment>
          ) : null}
        </Box>
      );
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

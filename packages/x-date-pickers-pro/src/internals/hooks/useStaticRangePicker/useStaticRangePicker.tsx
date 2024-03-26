import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersLayout, PickersLayoutSlotProps } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  DIALOG_WIDTH,
  ExportedBaseToolbarProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  UseStaticRangePickerParams,
  UseStaticRangePickerProps,
} from './useStaticRangePicker.types';
import { DateRange, RangeFieldSection } from '../../../models';
import { useRangePosition } from '../useRangePosition';

const PickerStaticLayout = styled(PickersLayout)(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  backgroundColor: (theme.vars || theme).palette.background.paper,
})) as unknown as typeof PickersLayout;

/**
 * Hook managing all the range static pickers:
 * - StaticDateRangePicker
 */
export const useStaticRangePicker = <
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  ref,
  ...pickerParams
}: UseStaticRangePickerParams<TDate, TView, TExternalProps>) => {
  const { localeText, slots, slotProps, className, sx, displayStaticWrapperAs, autoFocus } = props;

  const { rangePosition, onRangePositionChange } = useRangePosition(props);

  const { layoutProps, renderCurrentView } = usePicker<
    DateRange<TDate>,
    TDate,
    TView,
    RangeFieldSection,
    TExternalProps,
    {}
  >({
    ...pickerParams,
    props,
    autoFocusView: autoFocus ?? false,
    fieldRef: undefined,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
    wrapperVariant: displayStaticWrapperAs,
  });

  const Layout = slots?.layout ?? PickerStaticLayout;
  const slotPropsForLayout: PickersLayoutSlotProps<DateRange<TDate>, TDate, TView> = {
    ...slotProps,
    toolbar: {
      ...slotProps?.toolbar,
      rangePosition,
      onRangePositionChange,
    } as ExportedBaseToolbarProps,
  };

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <Layout
        {...layoutProps}
        {...slotProps?.layout}
        slots={slots}
        slotProps={slotPropsForLayout}
        sx={[
          ...(Array.isArray(sx) ? sx : [sx]),
          ...(Array.isArray(slotProps?.layout?.sx)
            ? slotProps!.layout!.sx
            : [slotProps?.layout?.sx]),
        ]}
        className={clsx(className, slotProps?.layout?.className)}
        ref={ref}
      >
        {renderCurrentView()}
      </Layout>
    </LocalizationProvider>
  );

  return { renderPicker };
};

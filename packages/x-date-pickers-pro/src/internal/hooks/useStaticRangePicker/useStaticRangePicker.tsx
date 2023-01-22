import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersLayout,
  PickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  DateOrTimeView,
  usePicker,
  WrapperVariantContext,
  DIALOG_WIDTH,
  ExportedBaseToolbarProps,
} from '@mui/x-date-pickers/internals';
import {
  UseStaticRangePickerParams,
  UseStaticRangePickerProps,
} from './useStaticRangePicker.types';
import { DateRange, RangePosition } from '../../models/range';

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
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  validator,
  ref,
}: UseStaticRangePickerParams<TDate, TView, TExternalProps>) => {
  const { localeText, slots, slotProps, className, sx, displayStaticWrapperAs, autoFocus } = props;

  const [rangePosition, setRangePosition] = React.useState<RangePosition>('start');

  const { layoutProps, renderCurrentView } = usePicker<
    DateRange<TDate>,
    TDate,
    TView,
    TExternalProps,
    {}
  >({
    props,
    valueManager,
    validator,
    autoFocusView: autoFocus ?? false,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange: setRangePosition,
    },
    wrapperVariant: displayStaticWrapperAs,
  });

  const Layout = slots?.layout ?? PickerStaticLayout;
  const slotPropsForLayout: PickersLayoutSlotsComponentsProps<DateRange<TDate>, TView> = {
    ...slotProps,
    toolbar: {
      ...slotProps?.toolbar,
      rangePosition,
      onRangePositionChange: setRangePosition,
    } as ExportedBaseToolbarProps,
  };

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
        <Layout
          {...layoutProps}
          {...slotProps?.layout}
          slots={slots}
          slotProps={slotPropsForLayout}
          sx={sx}
          className={clsx(className, slotProps?.layout?.className)}
          ref={ref}
        >
          {renderCurrentView()}
        </Layout>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};

import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { PickersLayout, PickersLayoutSlotProps } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  DIALOG_WIDTH,
  ExportedBaseToolbarProps,
  DateOrTimeViewWithMeridiem,
  PickerProvider,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import {
  UseStaticRangePickerParams,
  UseStaticRangePickerProps,
} from './useStaticRangePicker.types';
import { useRangePosition } from '../useRangePosition';

const PickerStaticLayout = styled(PickersLayout)(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  backgroundColor: (theme.vars || theme).palette.background.paper,
})) as typeof PickersLayout;

/**
 * Hook managing all the range static pickers:
 * - StaticDateRangePicker
 */
export const useStaticRangePicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticRangePickerProps<TView, any, TExternalProps>,
>({
  props,
  ref,
  ...pickerParams
}: UseStaticRangePickerParams<TView, TExternalProps>) => {
  const { localeText, slots, slotProps, className, sx, displayStaticWrapperAs, autoFocus } = props;

  const { rangePosition, onRangePositionChange } = useRangePosition(props);

  const { layoutProps, providerProps, renderCurrentView } = usePicker<
    PickerRangeValue,
    TView,
    TExternalProps,
    {}
  >({
    ...pickerParams,
    props,
    autoFocusView: autoFocus ?? false,
    fieldRef: undefined,
    localeText,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange,
    },
    variant: displayStaticWrapperAs,
  });

  const Layout = slots?.layout ?? PickerStaticLayout;
  const slotPropsForLayout: PickersLayoutSlotProps<PickerRangeValue, TView> = {
    ...slotProps,
    toolbar: {
      ...slotProps?.toolbar,
      rangePosition,
      onRangePositionChange,
    } as ExportedBaseToolbarProps,
  };

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
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
    </PickerProvider>
  );

  return { renderPicker };
};

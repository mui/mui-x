import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  DIALOG_WIDTH,
  DateOrTimeViewWithMeridiem,
  PickerProvider,
  PickerRangeValue,
  mergeSx,
} from '@mui/x-date-pickers/internals';
import {
  UseStaticRangePickerParams,
  UseStaticRangePickerProps,
} from './useStaticRangePicker.types';
import { useRangePosition } from '../useRangePosition';
import { PickerRangePositionContext } from '../../../hooks/usePickerRangePositionContext';

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
  ...pickerParams
}: UseStaticRangePickerParams<TView, TExternalProps>) => {
  const { localeText, slots, slotProps, displayStaticWrapperAs, autoFocus } = props;

  const rangePositionResponse = useRangePosition(props);

  const { providerProps, renderCurrentView } = usePicker<PickerRangeValue, TView, TExternalProps>({
    ...pickerParams,
    props,
    variant: displayStaticWrapperAs,
    autoFocusView: autoFocus ?? false,
    viewContainerRole: null,
    localeText,
  });

  const Layout = slots?.layout ?? PickerStaticLayout;

  const renderPicker = () => (
    <PickerRangePositionContext.Provider value={rangePositionResponse}>
      <PickerProvider {...providerProps}>
        <Layout
          {...slotProps?.layout}
          slots={slots}
          slotProps={slotProps}
          sx={mergeSx(providerProps.contextValue.rootSx, slotProps?.layout?.sx)}
          className={clsx(providerProps.contextValue.rootClassName, slotProps?.layout?.className)}
          ref={providerProps.contextValue.rootRef}
        >
          {renderCurrentView()}
        </Layout>
      </PickerProvider>
    </PickerRangePositionContext.Provider>
  );

  return { renderPicker };
};

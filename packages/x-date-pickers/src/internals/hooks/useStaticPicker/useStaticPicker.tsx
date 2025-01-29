import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { UseStaticPickerParams, UseStaticPickerProps } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { PickerProvider } from '../../components/PickerProvider';
import { PickersLayout } from '../../../PickersLayout';
import { DIALOG_WIDTH } from '../../constants/dimensions';
import { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import { mergeSx } from '../../utils/utils';

const PickerStaticLayout = styled(PickersLayout)(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  backgroundColor: (theme.vars || theme).palette.background.paper,
})) as unknown as typeof PickersLayout;

/**
 * Hook managing all the single-date static pickers:
 * - StaticDatePicker
 * - StaticDateTimePicker
 * - StaticTimePicker
 */
export const useStaticPicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticPickerProps<TView, any, TExternalProps>,
>({
  props,
  ...pickerParams
}: UseStaticPickerParams<TView, TExternalProps>) => {
  const { localeText, slots, slotProps, displayStaticWrapperAs, autoFocus } = props;

  const { providerProps, renderCurrentView } = usePicker<PickerValue, TView, TExternalProps>({
    ...pickerParams,
    props,
    autoFocusView: autoFocus ?? false,
    localeText,
    variant: displayStaticWrapperAs,
  });

  const Layout = slots?.layout ?? PickerStaticLayout;

  const renderPicker = () => (
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
  );

  return { renderPicker };
};

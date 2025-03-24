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
import { useNonRangePickerStepNavigation } from '../useNonRangePickerStepNavigation';

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
  steps,
  ...pickerParams
}: UseStaticPickerParams<TView, TExternalProps>) => {
  const { localeText, slots, slotProps, displayStaticWrapperAs, autoFocus } = props;

  const getStepNavigation = useNonRangePickerStepNavigation({ steps });

  const { providerProps, renderCurrentView } = usePicker<PickerValue, TView, TExternalProps>({
    ...pickerParams,
    props,
    variant: displayStaticWrapperAs,
    autoFocusView: autoFocus ?? false,
    viewContainerRole: null,
    localeText,
    getStepNavigation,
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

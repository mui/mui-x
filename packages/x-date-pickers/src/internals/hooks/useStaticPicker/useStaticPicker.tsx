'use client';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import type { UseStaticPickerParams, UseStaticPickerProps } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { PickerProvider } from '../../components/PickerProvider';
import { PickersLayout } from '../../../PickersLayout';
import { DIALOG_WIDTH, DIALOG_WIDTH_COMPACT } from '../../constants/dimensions';
import type { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import { extractRootForwardedProps, mergeSx } from '../../utils/utils';
import { createNonRangePickerStepNavigation } from '../../utils/createNonRangePickerStepNavigation';

const PickerStaticLayout = styled(PickersLayout, {
  slot: 'internal',
})(({ theme }) => ({
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
  const { localeText, slots, slotProps, displayStaticWrapperAs, autoFocus, compact } = props;

  const getStepNavigation = createNonRangePickerStepNavigation({ steps });

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
        {...extractRootForwardedProps(props)}
        {...slotProps?.layout}
        slots={slots}
        slotProps={slotProps}
        sx={mergeSx(
          compact ? { minWidth: DIALOG_WIDTH_COMPACT } : undefined,
          providerProps.contextValue.rootSx,
          slotProps?.layout?.sx,
        )}
        className={clsx(providerProps.contextValue.rootClassName, slotProps?.layout?.className)}
        ref={providerProps.contextValue.rootRef}
      >
        {renderCurrentView()}
      </Layout>
    </PickerProvider>
  );

  return { renderPicker };
};

import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { DateOrTimeView } from '../../models/views';
import { UseStaticPickerParams, UseStaticPickerProps } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { PickersLayout } from '../../../PickersLayout';
import { DIALOG_WIDTH } from '../../constants/dimensions';

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
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticPickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  validator,
  ref,
}: UseStaticPickerParams<TDate, TView, TExternalProps>) => {
  const { localeText, slots, slotProps, className, sx, displayStaticWrapperAs, autoFocus } = props;

  const { layoutProps, renderCurrentView } = usePicker<
    TDate | null,
    TDate,
    TView,
    TExternalProps,
    {}
  >({
    props,
    valueManager,
    validator,
    autoFocusView: autoFocus ?? false,
    additionalViewProps: {},
    wrapperVariant: displayStaticWrapperAs!,
  });

  const Layout = slots?.layout ?? PickerStaticLayout;

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs!}>
        <Layout
          {...layoutProps}
          {...slotProps?.layout}
          slots={slots}
          slotProps={slotProps}
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

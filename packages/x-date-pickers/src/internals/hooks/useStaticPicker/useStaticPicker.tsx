import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { UseStaticPickerParams, UseStaticPickerProps } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { PickersLayout } from '../../../PickersLayout';
import { DIALOG_WIDTH } from '../../constants/dimensions';
import { FieldSection, PickerValidDate } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';

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
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticPickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  ref,
  ...pickerParams
}: UseStaticPickerParams<TDate, TView, TExternalProps>) => {
  const { localeText, slots, slotProps, className, sx, displayStaticWrapperAs, autoFocus } = props;

  const { layoutProps, renderCurrentView } = usePicker<
    TDate | null,
    TDate,
    TView,
    FieldSection,
    TExternalProps,
    {}
  >({
    ...pickerParams,
    props,
    autoFocusView: autoFocus ?? false,
    fieldRef: undefined,
    additionalViewProps: {},
    wrapperVariant: displayStaticWrapperAs,
  });

  const Layout = slots?.layout ?? PickerStaticLayout;

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <Layout
        {...layoutProps}
        {...slotProps?.layout}
        slots={slots}
        slotProps={slotProps}
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

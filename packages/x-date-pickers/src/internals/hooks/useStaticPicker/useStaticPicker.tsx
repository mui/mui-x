import * as React from 'react';
import { styled } from '@mui/material/styles';
import { CalendarOrClockPickerView } from '../../models/views';
import { UseStaticPickerParams, UseStaticPickerProps } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { PickerViewLayout } from '../../components/PickerViewLayout';
import { DIALOG_WIDTH } from '../../constants/dimensions';

const PickerStaticViewLayout = styled(PickerViewLayout)(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  backgroundColor: theme.palette.background.paper,
})) as unknown as typeof PickerViewLayout;

/**
 * Hook managing all the single-date static pickers:
 * - StaticDatePicker
 * - StaticDateTimePicker
 * - StaticTimePicker
 */
export const useStaticPicker = <
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UseStaticPickerProps<TDate, TView>,
>({
  props,
  valueManager,
  viewLookup,
  ref,
}: UseStaticPickerParams<TDate, TView, TExternalProps>) => {
  const { localeText, components, componentsProps, displayStaticWrapperAs } = props;

  const { layoutProps, renderCurrentView } = usePicker({
    props,
    viewLookup,
    valueManager,
    additionalViewProps: {},
    wrapperVariant: displayStaticWrapperAs,
  });

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
        <PickerStaticViewLayout
          {...layoutProps}
          components={components}
          componentsProps={componentsProps}
          ref={ref}
        >
          {renderCurrentView()}
        </PickerStaticViewLayout>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};

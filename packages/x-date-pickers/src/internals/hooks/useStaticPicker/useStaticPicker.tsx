import * as React from 'react';
import { styled } from '@mui/material/styles';
import { CalendarOrClockPickerView } from '../../models/views';
import { UseStaticPickerParams } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { PickerViewLayout } from '../../components/PickerViewLayout';
import { DIALOG_WIDTH } from '../../constants/dimensions';

const PickerStaticViewLayout = styled(PickerViewLayout)(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  backgroundColor: theme.palette.background.paper,
})) as typeof PickerViewLayout;

/**
 * Hook managing all the single-date static pickers:
 * - StaticDatePicker
 * - StaticDateTimePicker
 * - StaticTimePicker
 */
export const useStaticPicker = <TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  renderViews: renderViewsParam,
}: UseStaticPickerParams<TDate, TView>) => {
  const { localeText, components, componentsProps, displayStaticWrapperAs } = props;

  const { layoutProps, renderViews } = usePicker({
    props,
    valueManager,
    wrapperVariant: displayStaticWrapperAs,
    renderViews: renderViewsParam,
    additionalViewProps: {},
  });

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
        <PickerStaticViewLayout
          {...layoutProps}
          components={components}
          componentsProps={componentsProps}
        >
          {renderViews()}
        </PickerStaticViewLayout>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};

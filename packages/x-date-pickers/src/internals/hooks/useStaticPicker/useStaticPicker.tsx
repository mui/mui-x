import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models/views';
import { UseStaticPickerParams } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { PickerViewLayout } from '../../components/PickerViewLayout';

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
        <PickerViewLayout
          {...layoutProps}
          components={components}
          componentsProps={componentsProps}
        >
          {renderViews()}
        </PickerViewLayout>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};

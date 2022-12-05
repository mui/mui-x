import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DateOrTimeView } from '../../models/views';
import { UseStaticPickerParams, UseStaticPickerProps } from './useStaticPicker.types';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { PickersViewLayout } from '../../components/PickersViewLayout';
import { DIALOG_WIDTH } from '../../constants/dimensions';

const PickerStaticViewLayout = styled(PickersViewLayout)(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  backgroundColor: (theme.vars || theme).palette.background.paper,
})) as unknown as typeof PickersViewLayout;

/**
 * Hook managing all the single-date static pickers:
 * - StaticDatePicker
 * - StaticDateTimePicker
 * - StaticTimePicker
 */
export const useStaticPicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticPickerProps<TDate, TView, any>,
>({
  props,
  valueManager,
  viewLookup,
  validator,
  ref,
}: UseStaticPickerParams<TDate, TView, TExternalProps>) => {
  const { localeText, components, componentsProps, displayStaticWrapperAs } = props;

  const { layoutProps, renderCurrentView } = usePicker({
    props,
    viewLookup,
    valueManager,
    validator,
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

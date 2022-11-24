import * as React from 'react';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DateOrTimeView,
  usePicker,
  WrapperVariantContext,
  PickersViewLayout,
  DIALOG_WIDTH,
  PickersViewLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { UseStaticPickerParams, UseStaticPickerProps } from './useStaticRangePicker.types';

const PickerStaticViewLayout = styled(PickersViewLayout)(({ theme }) => ({
  overflow: 'hidden',
  minWidth: DIALOG_WIDTH,
  backgroundColor: (theme.vars || theme).palette.background.paper,
})) as unknown as typeof PickersViewLayout;

/**
 * Hook managing all the range static pickers:
 * - StaticDateRangePicker
 */
export const useStaticRangePicker = <
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

  const [currentDatePosition, setCurrentDatePosition] = React.useState<'start' | 'end'>('start');

  const { layoutProps, renderCurrentView } = usePicker({
    props,
    viewLookup,
    valueManager,
    validator,
    additionalViewProps: {},
    wrapperVariant: displayStaticWrapperAs,
  });

  const componentsPropsForLayout: PickersViewLayoutSlotsComponentsProps = {
    ...componentsProps,
    toolbar: {
      ...componentsProps?.toolbar,
      currentlySelectingRangeEnd: currentDatePosition,
      setCurrentlySelectingRangeEnd: setCurrentDatePosition,
    },
  };

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
        <PickerStaticViewLayout
          {...layoutProps}
          components={components}
          componentsProps={componentsPropsForLayout}
          ref={ref}
        >
          {renderCurrentView()}
        </PickerStaticViewLayout>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};

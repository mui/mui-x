import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
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
  const { localeText, components, componentsProps, displayStaticWrapperAs, autoFocus } = props;

  const { renderCurrentView, layoutProps: pickerLayoutProps } = usePicker<
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
    wrapperVariant: displayStaticWrapperAs,
  });

  const Layout = components?.Layout ?? PickerStaticLayout;
  const layoutProps = useSlotProps({
    elementType: Layout,
    externalSlotProps: componentsProps?.layout,
    additionalProps: {
      ...pickerLayoutProps,
      components,
      componentsProps,
      ref,
    },
    ownerState: {},
  });

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value={displayStaticWrapperAs}>
        <Layout {...layoutProps}>{renderCurrentView()}</Layout>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};

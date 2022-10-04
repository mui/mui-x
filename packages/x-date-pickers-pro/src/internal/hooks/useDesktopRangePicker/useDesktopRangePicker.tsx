import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  CalendarOrClockPickerView,
  executeInTheNextEventLoopTick,
  usePicker,
  WrapperVariantContext,
  PickersPopper,
} from '@mui/x-date-pickers/internals';
import { UseDesktopRangePickerParams } from './useDesktopRangePicker.types';
import { useRangePickerField } from './useRangePickerField';
import { getReleaseInfo } from '../../utils/releaseInfo';

const releaseInfo = getReleaseInfo();

export const useDesktopRangePicker = <TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  renderViews: renderViewsParam,
  getOpenDialogAriaText,
  sectionModeLookup,
}: UseDesktopRangePickerParams<TDate, TView>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    components,
    componentsProps = {},
    className,
    inputFormat,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
  } = props;

  const fieldRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);
  const [currentDatePosition, setCurrentDatePosition] = React.useState<'start' | 'end'>('start');

  const {
    field: headlessPickerFieldResponse,
    renderViews,
    actions,
    open,
    shouldRestoreFocus,
  } = usePicker({
    props,
    valueManager,
    wrapperVariant: 'desktop',
    renderViews: renderViewsParam,
    sectionModeLookup,
    additionalViewProps: {
      currentDatePosition,
      onCurrentDatePositionChange: setCurrentDatePosition,
    },
  });

  const handleBlur = () => {
    executeInTheNextEventLoopTick(() => {
      if (
        fieldRef.current?.contains(document.activeElement) ||
        popperRef.current?.contains(document.activeElement)
      ) {
        return;
      }

      actions.onDismiss();
    });
  };

  const { inputProps } = useRangePickerField({
    open,
    actions,
    readOnly,
    disableOpenPicker,
    Input: components.Input!,
    externalInputProps: componentsProps.input,
    onBlur: handleBlur,
    currentDatePosition,
    onCurrentDatePositionChange: setCurrentDatePosition,
  });

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: {
      ...headlessPickerFieldResponse,
      readOnly,
      disabled,
      className,
      format: inputFormat,
      ref: fieldRef,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field
          {...fieldProps}
          components={{
            ...(fieldProps as any).components,
            Input: components.Input,
          }}
          componentsProps={{ ...(fieldProps as any).componentsProps, input: inputProps }}
        />
        <PickersPopper
          role="tooltip"
          containerRef={popperRef}
          anchorEl={fieldRef.current}
          onBlur={handleBlur}
          {...actions}
          open={open}
          components={components}
          componentsProps={componentsProps}
          shouldRestoreFocus={shouldRestoreFocus}
        >
          {renderViews()}
        </PickersPopper>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};

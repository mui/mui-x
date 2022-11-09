import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  CalendarOrClockPickerView,
  usePicker,
  WrapperVariantContext,
  PickerViewLayout,
  PickersModalDialog,
  InferError,
} from '@mui/x-date-pickers/internals';
import {
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { useRangePickerInputProps } from '../useRangePickerInputProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../models/range';
import { BaseMultiInputFieldProps } from '../../models/fields';

const releaseInfo = getReleaseInfo();

export const useMobileRangePicker = <
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any>,
>({
  props,
  valueManager,
  viewLookup,
  validator,
}: UseMobileRangePickerParams<TDate, TView, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    components,
    componentsProps = {},
    className,
    format,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
  } = props;

  const fieldRef = React.useRef<HTMLDivElement>(null);
  const [currentDatePosition, setCurrentDatePosition] = React.useState<'start' | 'end'>('start');

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
  } = usePicker({
    props,
    valueManager,
    wrapperVariant: 'mobile',
    viewLookup,
    validator,
    additionalViewProps: {
      currentDatePosition,
      onCurrentDatePositionChange: setCurrentDatePosition,
    },
  });

  const { startInputProps, endInputProps } = useRangePickerInputProps({
    wrapperVariant: 'mobile',
    open,
    actions,
    readOnly,
    disabled,
    disableOpenPicker,
    Input: components.Input!,
    externalInputProps: componentsProps.input,
    onBlur: undefined,
    currentDatePosition,
    onCurrentDatePositionChange: setCurrentDatePosition,
  });

  const Field = components.Field;
  const fieldProps: BaseMultiInputFieldProps<
    DateRange<TDate>,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly,
      disabled,
      className,
      format,
      ref: fieldRef,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const componentsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['components'] = {
    ...fieldProps.components,
    Input: components.Input,
  };

  const componentsPropsForField: BaseMultiInputFieldProps<
    DateRange<TDate>,
    unknown
  >['componentsProps'] = {
    ...fieldProps.componentsProps,
    input: (ownerState) => {
      const externalInputProps = resolveComponentProps(componentsProps.input, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.componentsProps?.input,
        ownerState,
      );

      return {
        ...inputPropsPassedByField,
        ...externalInputProps,
        ...(ownerState.position === 'start' ? startInputProps : endInputProps),
      };
    },
  };

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="mobile">
        <Field
          {...fieldProps}
          components={componentsForField}
          componentsProps={componentsPropsForField}
        />
        <PickersModalDialog
          {...actions}
          open={open}
          components={{
            ...components,
            // Avoids to render 2 action bar, will be removed once `PickersModalDialog` stop displaying the action bar.
            ActionBar: () => null,
          }}
          componentsProps={componentsProps}
        >
          <PickerViewLayout
            {...layoutProps}
            components={components}
            componentsProps={componentsProps}
          >
            {renderCurrentView()}
          </PickerViewLayout>
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};

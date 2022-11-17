import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DateOrTimeView,
  executeInTheNextEventLoopTick,
  usePicker,
  WrapperVariantContext,
  PickersPopper,
  PickersViewLayout,
  InferError,
} from '@mui/x-date-pickers/internals';
import {
  UseDesktopRangePickerParams,
  UseDesktopRangePickerProps,
} from './useDesktopRangePicker.types';
import { useRangePickerInputProps } from '../useRangePickerInputProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange } from '../../models/range';
import { BaseMultiInputFieldProps } from '../../models/fields';

const releaseInfo = getReleaseInfo();

export const useDesktopRangePicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any>,
>({
  props,
  valueManager,
  viewLookup,
  validator,
}: UseDesktopRangePickerParams<TDate, TView, TExternalProps>) => {
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
  const popperRef = React.useRef<HTMLDivElement>(null);
  const [currentDatePosition, setCurrentDatePosition] = React.useState<'start' | 'end'>('start');

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
  } = usePicker({
    props,
    valueManager,
    wrapperVariant: 'desktop',
    viewLookup,
    validator,
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

  const fieldSlotsProps = useRangePickerInputProps({
    wrapperVariant: 'mobile',
    open,
    actions,
    readOnly,
    disabled,
    disableOpenPicker,
    onBlur: handleBlur,
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
    ownerState: props,
  });

  const componentsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['components'] = {
    ...fieldProps.components,
    Input: components.Input,
    Root: components.FieldRoot,
    Separator: components.FieldSeparator,
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
      const inputPropsPassedByPicker =
        ownerState.position === 'start' ? fieldSlotsProps.startInput : fieldSlotsProps.endInput;

      return {
        ...externalInputProps,
        ...inputPropsPassedByField,
        ...inputPropsPassedByPicker,
        inputProps: {
          ...externalInputProps?.inputProps,
          ...inputPropsPassedByField?.inputProps,
          ...inputPropsPassedByPicker?.inputProps,
        },
      };
    },
    root: (ownerState) => {
      const externalRootProps = resolveComponentProps(componentsProps.fieldRoot, ownerState);
      const rootPropsPassedByField = resolveComponentProps(
        fieldProps.componentsProps?.root,
        ownerState,
      );
      return {
        ...externalRootProps,
        ...rootPropsPassedByField,
        ...fieldSlotsProps.root,
      };
    },
    separator: (ownerState) => {
      const externalSeparatorProps = resolveComponentProps(
        componentsProps.fieldSeparator,
        ownerState,
      );
      const separatorPropsPassedByField = resolveComponentProps(
        fieldProps.componentsProps?.separator,
        ownerState,
      );
      return {
        ...externalSeparatorProps,
        ...separatorPropsPassedByField,
        ...fieldSlotsProps.root,
      };
    },
  };

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field
          {...fieldProps}
          components={componentsForField}
          componentsProps={componentsPropsForField}
        />
        <PickersPopper
          role="tooltip"
          containerRef={popperRef}
          anchorEl={fieldRef.current}
          onBlur={handleBlur}
          {...actions}
          open={open}
          components={{
            ...components,
            // Avoids to render 2 action bar, will be removed once `PickersPopper` stop displaying the action bar.
            ActionBar: () => null,
          }}
          componentsProps={componentsProps}
          shouldRestoreFocus={shouldRestoreFocus}
        >
          <PickersViewLayout
            {...layoutProps}
            components={components}
            componentsProps={componentsProps}
          >
            {renderCurrentView()}
          </PickersViewLayout>
        </PickersPopper>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};

import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  OnErrorProps,
  PickerChangeImportance,
  PickerValidDate,
  TimeValidationError,
  TimezoneProps,
} from '../../../../models';
import { useTimeManager } from '../../../../managers';
import { ExportedValidateTimeProps, ValidateTimeProps } from '../../../../validation/validateTime';
import { useLocalizationContext } from '../../../hooks/useUtils';
import { FormProps, PickerValue } from '../../../models';
import { useControlledValueWithTimezone } from '../../../hooks/useValueWithTimezone';
import { ClockSection } from '../utils/types';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { ClockRootContext } from './ClockRootContext';

export function useClockRoot(parameters: useClockRoot.Parameters) {
  const {
    // Form props
    readOnly = false,
    disabled = false,
    // Value props
    defaultValue,
    onValueChange,
    value: valueProp,
    timezone: timezoneProp,
    referenceDate: referenceDateProp,
    // Validation props
    onError,
    minTime,
    maxTime,
    disablePast,
    disableFuture,
    shouldDisableTime,
    // Children
    children,
  } = parameters;

  const manager = useTimeManager();
  const adapter = useLocalizationContext();

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'Clock',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange: onValueChange,
    valueManager: manager.internal_valueManager,
  });

  const validationProps = React.useMemo<ValidateTimeProps>(
    () => ({
      disablePast: disablePast ?? false,
      disableFuture: disableFuture ?? false,
      minTime,
      maxTime,
      shouldDisableTime,
    }),
    [disableFuture, disablePast, maxTime, minTime, shouldDisableTime],
  );

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({});
    }

    return children;
  }, [children]);

  const getRootProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, { children: resolvedChildren });
    },
    [resolvedChildren],
  );

  const isEmpty = value == null;

  const setValue: ClockRootContext['setValue'] = useEventCallback((newValue, options) => {
    const context: useClockRoot.ValueChangeHandlerContext = {
      section: options.section,
      validationError: manager.validator({
        adapter,
        value: newValue,
        timezone,
        props: { ...validationProps, onError },
      }),
    };
    console.log('NEW VALUE', newValue, options);
    handleValueChange(newValue, context);
  });

  const context: ClockRootContext = React.useMemo(
    () => ({ timezone, disabled, readOnly, validationProps, value, setValue }),
    [timezone, disabled, readOnly, validationProps, value, setValue],
  );

  return React.useMemo(
    () => ({ getRootProps, isEmpty, context }),
    [getRootProps, isEmpty, context],
  );
}

export namespace useClockRoot {
  export interface Parameters
    extends TimezoneProps,
      FormProps,
      OnErrorProps<PickerValue, TimeValidationError>,
      ExportedValidateTimeProps {
    /**
     * The controlled value that should be selected.
     * To render an uncontrolled Clock, use the `defaultValue` prop instead.
     */
    value?: PickerValue;
    /**
     * The uncontrolled value that should be initially selected.
     * To render a controlled Clock, use the `value` prop instead.
     */
    defaultValue?: PickerValue;
    /**
     * Event handler called when the selected value changes.
     * Provides the new value as an argument.
     * @param {TValue} value The new selected value.
     * @param {ValueChangeHandlerContext} context Additional context information.
     */
    onValueChange?: (value: PickerValue, context: ValueChangeHandlerContext) => void;
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
     */
    referenceDate?: PickerValidDate;
    /**
     * The children of the component.
     * If a function is provided, it will be called with the public context as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ValueChangeHandlerContext {
    /**
     * The section handled by the UI that triggered the change.
     */
    section: ClockSection | 'unknown';
    /**
     * The validation error associated to the new value.
     */
    validationError: TimeValidationError;
    /**
     * The importance of the change.
     */
    changeImportance: PickerChangeImportance;
  }

  export interface ChildrenParameters {}
}

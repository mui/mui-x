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
import { FormProps, PickerValue } from '../../../models';
import { useControlledValueWithTimezone } from '../../../hooks/useValueWithTimezone';
import { ClockSection } from '../utils/types';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { ClockRootContext } from './ClockRootContext';
import { useValidation } from '../../../../validation';
import { useUtils } from '../../../hooks/useUtils';
import { SECTION_TYPE_GRANULARITY } from '../../../utils/getDefaultReferenceDate';
import { getTodayDate } from '../../../utils/date-utils';
import { useIsOptionInvalid } from './useIsOptionInvalid';

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
  const utils = useUtils();

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

  const referenceDate = React.useMemo(
    () =>
      manager.internal_valueManager.getInitialReferenceValue({
        value,
        utils,
        props: validationProps,
        referenceDate: referenceDateProp,
        // TODO: Check if this is the right granularity
        granularity: SECTION_TYPE_GRANULARITY.day,
        timezone,
        getTodayDate: () => getTodayDate(utils, timezone, 'date'),
      }),
    // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [referenceDateProp, timezone],
  );

  const isOptionInvalid = useIsOptionInvalid({ validationProps, timezone });

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

  const { getValidationErrorForNewValue } = useValidation({
    props: { ...validationProps, onError },
    validator: manager.validator,
    timezone,
    value,
    onError,
  });

  const setValue: ClockRootContext['setValue'] = useEventCallback((newValue, options) => {
    const context: useClockRoot.ValueChangeHandlerContext = {
      section: options.section,
      validationError: getValidationErrorForNewValue(newValue),
      changeImportance: 'accept',
    };
    handleValueChange(newValue, context);
  });

  const context: ClockRootContext = React.useMemo(
    () => ({
      timezone,
      disabled,
      readOnly,
      validationProps,
      value,
      setValue,
      referenceDate: value ?? referenceDate,
      isOptionInvalid,
    }),
    [
      timezone,
      disabled,
      readOnly,
      validationProps,
      value,
      setValue,
      referenceDate,
      isOptionInvalid,
    ],
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
    section: ClockSection;
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

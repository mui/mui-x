import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import { UseTimeFieldProps } from './TimeField.types';
import { validateTime } from '../internals/utils/validation/validateTime';
import { useUtils } from '../internals/hooks/useUtils';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';
import { BaseTimeValidationProps } from '../internals/models/validation';
import { DefaultizedProps } from '../internals/models/helpers';

interface UseDefaultizedTimeFieldBaseProps extends BaseTimeValidationProps {
  format?: string;
}

export const useDefaultizedTimeField = <
  TDate,
  TKnownProps extends UseDefaultizedTimeFieldBaseProps & { ampm?: boolean },
  TAllProps extends {},
>(
  props: TKnownProps & TAllProps,
): TAllProps & DefaultizedProps<TKnownProps, keyof UseDefaultizedTimeFieldBaseProps> => {
  const utils = useUtils<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
  };
};

export const useTimeField = <
  TDate,
  TUseV6TextField extends boolean,
  TAllProps extends UseTimeFieldProps<TDate, TUseV6TextField>,
>(
  inProps: TAllProps,
) => {
  const props = useDefaultizedTimeField<
    TDate,
    UseTimeFieldProps<TDate, TUseV6TextField>,
    TAllProps
  >(inProps);

  const { forwardedProps, internalProps } = splitFieldInternalAndForwardedProps<
    typeof props,
    keyof UseTimeFieldProps<any, TUseV6TextField>
  >(props, 'time');

  return useField<
    TDate | null,
    TDate,
    FieldSection,
    TUseV6TextField,
    typeof forwardedProps,
    typeof internalProps
  >({
    forwardedProps,
    internalProps,
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateTime,
    valueType: 'time',
  });
};

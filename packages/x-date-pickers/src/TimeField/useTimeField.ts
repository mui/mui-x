import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import {
  UseTimeFieldProps,
  UseTimeFieldDefaultizedProps,
  UseTimeFieldParams,
} from './TimeField.types';
import { validateTime } from '../internals/hooks/validation/useTimeValidation';
import { useUtils } from '../internals/hooks/useUtils';
import { extractFieldInternalProps } from '../internals/utils/fields';

const useDefaultizedTimeField = <TDate, AdditionalProps extends {}>(
  props: UseTimeFieldProps<TDate>,
): AdditionalProps & UseTimeFieldDefaultizedProps<TDate> => {
  const utils = useUtils<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
  } as any;
};

export const useTimeField = <TDate, TChildProps extends {}>({
  props: inProps,
  inputRef,
}: UseTimeFieldParams<TDate, TChildProps>) => {
  const props = useDefaultizedTimeField<TDate, TChildProps>(inProps);

  const { forwardedProps, internalProps } = extractFieldInternalProps<
    typeof props,
    keyof UseTimeFieldProps<any>
  >(props, 'time');

  return useField({
    inputRef,
    forwardedProps,
    internalProps,
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateTime,
    valueType: 'time',
  });
};

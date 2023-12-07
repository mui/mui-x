import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import {
  UseTimeFieldProps,
  UseTimeFieldDefaultizedProps,
  UseTimeFieldComponentProps,
} from './TimeField.types';
import { validateTime } from '../internals/utils/validation/validateTime';
import { useUtils } from '../internals/hooks/useUtils';
import { splitFieldInternalAndForwardedProps } from '../internals/utils/fields';
import { FieldSection } from '../models';

const useDefaultizedTimeField = <
  TDate,
  TUseV6TextField extends boolean,
  AdditionalProps extends {},
>(
  props: UseTimeFieldProps<TDate, TUseV6TextField>,
): AdditionalProps & UseTimeFieldDefaultizedProps<TDate, TUseV6TextField> => {
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

export const useTimeField = <TDate, TUseV6TextField extends boolean, TChildProps extends {}>(
  inProps: UseTimeFieldComponentProps<TDate, TUseV6TextField, TChildProps>,
) => {
  const props = useDefaultizedTimeField<TDate, TUseV6TextField, TChildProps>(inProps);

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

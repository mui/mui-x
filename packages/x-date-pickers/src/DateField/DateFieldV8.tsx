import * as React from 'react';
import * as PickersField from '../PickersField';
import { PickerValidDate } from '../models/pickers';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { validateDate } from '../validation';
import { buildFieldControllerGetter } from '../internals/utils/controller';
import { applyDefaultDate } from '../internals/utils/date-utils';

const getDateFieldController = buildFieldControllerGetter({
  isRange: false,
  valueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateDate,
  valueType: 'date',
  getDefaultInternalProps: (adapter, inputProps: { disablePast: boolean }) => ({
    ...inputProps,
    disablePast: inputProps.disablePast ?? false,
    disableFuture: inputProps.disableFuture ?? false,
    format: inputProps.format ?? adapter.utils.formats.keyboardDate,
    minDate: applyDefaultDate(adapter.utils, inputProps.minDate, adapter.defaultDates.minDate),
    maxDate: applyDefaultDate(adapter.utils, inputProps.maxDate, adapter.defaultDates.maxDate),
  }),
});

export function DateFieldV8<TDate extends PickerValidDate>(props: any) {
  const controller = React.useMemo(() => getDateFieldController<TDate>(), []);

  return (
    <PickersField.Root controller={controller} {...props}>
      <PickersField.Content />
    </PickersField.Root>
  );
}

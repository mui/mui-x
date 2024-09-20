import * as React from 'react';
import * as PickersField from '../PickersField';
import { PickerValidDate } from '../models/pickers';
import { DateValidationError } from '../models/validation';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { validateDate, ValidateDateProps } from '../validation';
import { UseFieldInternalProps } from '../internals/hooks/useField';

const getDateFieldController = <TDate extends PickerValidDate>(): PickersField.Root.Controller<
  TDate,
  false,
  DateValidationError,
  UseFieldInternalProps<any, any, any, true, any> & ValidateDateProps<TDate>
> => ({
  valueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateDate,
  valueType: 'date',
});

export function DateFieldV8<TDate extends PickerValidDate>() {
  const controller = React.useMemo(() => getDateFieldController<TDate>(), []);

  return (
    <PickersField.Root controller={controller}>
      <PickersField.Content />
    </PickersField.Root>
  );
}

import * as React from 'react';
import * as PickersField from '../PickersField';
import { PickerValidDate } from '../models/pickers';
import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { validateDate } from '../validation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { UseDateFieldProps } from './DateField.types';
import { DateValidationError } from '../models/validation';
import { DefaultizedProps } from '../internals/models/helpers';
import { BaseDateValidationProps } from '../internals/models/validation';
import { PickerController } from '../models/fields';

const getDateFieldController = <TDate extends PickerValidDate>(): PickerController<
  TDate,
  false,
  DateValidationError,
  UseDateFieldProps<TDate, true>,
  DefaultizedProps<UseDateFieldProps<TDate, true>, keyof BaseDateValidationProps<TDate> | 'format'>
> => ({
  valueManager: singleItemValueManager,
  fieldValueManager: singleItemFieldValueManager,
  validator: validateDate,
  valueType: 'date',
  applyDefaultFieldInternalProps: (adapter, inputProps) => ({
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
      <PickersField.Content>
        {(section) => (
          <PickersField.Section section={section}>
            <PickersField.SectionSeparator position="before" />
            <PickersField.SectionContent />
            <PickersField.SectionSeparator position="after" />
          </PickersField.Section>
        )}
      </PickersField.Content>
    </PickersField.Root>
  );
}

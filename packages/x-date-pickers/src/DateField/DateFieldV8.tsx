import * as React from 'react';
import * as PickersField from '../PickersField';
import { PickerValidDate } from '../models/pickers';
import { getDateController } from '../controllers';

export function DateFieldV8<TDate extends PickerValidDate>(props: any) {
  const controller = React.useMemo(() => getDateController<TDate>(), []);

  return (
    <PickersField.Root controller={controller} {...props}>
      <PickersField.Content>
        {(index) => (
          <PickersField.Section index={index}>
            <PickersField.SectionSeparator position="before" />
            <PickersField.SectionContent />
            <PickersField.SectionSeparator position="after" />
          </PickersField.Section>
        )}
      </PickersField.Content>
    </PickersField.Root>
  );
}

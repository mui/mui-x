import * as React from 'react';
import * as PickersField from '../PickersField';
import { PickerValidDate } from '../models/pickers';
import { getDateValueManager } from '../valueManagers';

export function DateFieldV8<TDate extends PickerValidDate>(props: any) {
  const valueManager = React.useMemo(() => getDateValueManager<TDate>(), []);

  return (
    <PickersField.Root valueManager={valueManager} {...props}>
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

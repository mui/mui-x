import * as React from 'react';
import * as Field from '@base_ui/react/Field';
import { PickersField } from '../PickersField';
import { PickerValidDate } from '../models/pickers';
import { getDateValueManager } from '../valueManagers';
import classes from './DateFieldV8.module.css';

export function DateFieldRaw<TDate extends PickerValidDate>(props: any) {
  const valueManager = React.useMemo(() => getDateValueManager<TDate, true>(true), []);

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

export function DateFieldBase<TDate extends PickerValidDate>(props: any) {
  const { label, ...other } = props;
  const valueManager = React.useMemo(() => getDateValueManager<TDate, true>(true), []);

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Field.Control
        render={({ ref, ...otherRootProps }) => (
          <PickersField.Root
            valueManager={valueManager}
            inputRef={ref}
            {...otherRootProps}
            className={classes.root}
          >
            <PickersField.Content>
              {(index) => (
                <PickersField.Section index={index}>
                  <PickersField.SectionSeparator position="before" />
                  <PickersField.SectionContent className={classes.sectionContent} />
                  <PickersField.SectionSeparator position="after" />
                </PickersField.Section>
              )}
            </PickersField.Content>
          </PickersField.Root>
        )}
      />
    </Field.Root>
  );
}

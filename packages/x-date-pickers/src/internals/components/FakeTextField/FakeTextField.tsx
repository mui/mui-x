import * as React from 'react';
import Stack from '@mui/material/Stack';
import { FieldSection } from '../../../models';

interface FakeTextFieldProps {
  sections: FieldSection[];
}

export function FakeTextField(props: FakeTextFieldProps) {
  const { sections } = props;

  return (
    <Stack direction="row" spacing={1}>
      {sections.map((section) => (
        <React.Fragment>
          {section.startSeparator}
          <input value={section.value} onChange={() => {}} />
          {section.endSeparator}
        </React.Fragment>
      ))}
    </Stack>
  );
}

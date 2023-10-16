import * as React from 'react';
import Stack from '@mui/material/Stack';

export interface FakeTextFieldElement extends React.HTMLAttributes<HTMLDivElement> {
  before: string;
  after: string;
}

interface FakeTextFieldProps {
  elements: FakeTextFieldElement[];
}

export const FakeTextField = React.forwardRef(function FakeTextField(
  props: FakeTextFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { elements } = props;

  return (
    <Stack direction="row" spacing={1} ref={ref}>
      {elements.map(({ before, after, ...otherElementProps }, elementIndex) => (
        <React.Fragment key={elementIndex}>
          {before}
          <input {...otherElementProps} />
          {after}
        </React.Fragment>
      ))}
    </Stack>
  );
});

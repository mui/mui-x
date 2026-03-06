import * as React from 'react';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { createPickerRenderer } from 'test/utils/pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<MultiInputDateRangeField /> - fieldRef', () => {
  const { render } = createPickerRenderer();

  it('should return the sections of the start field with startFieldRef', () => {
    const startFieldRef = React.createRef<FieldRef<PickerValue>>();
    render(<MultiInputDateRangeField startFieldRef={startFieldRef} />);

    const sections = startFieldRef.current?.getSections();
    expect(sections).to.have.length(3);
    expect(sections?.[0].type).to.equal('month');
  });

  it('should return the sections of the end field with endFieldRef', () => {
    const endFieldRef = React.createRef<FieldRef<PickerValue>>();
    render(<MultiInputDateRangeField endFieldRef={endFieldRef} />);

    const sections = endFieldRef.current?.getSections();
    expect(sections).to.have.length(3);
    expect(sections?.[0].type).to.equal('month');
  });
});

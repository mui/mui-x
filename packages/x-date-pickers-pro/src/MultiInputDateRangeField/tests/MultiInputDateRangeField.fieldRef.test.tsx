import * as React from 'react';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { createPickerRenderer } from 'test/utils/pickers';
import { PickerRangeValue } from '@mui/x-date-pickers/internals';

describe('<MultiInputDateRangeField /> - fieldRef', () => {
  const { render } = createPickerRenderer();

  it('should return the sections of the start field with startFieldRef', () => {
    const startFieldRef = React.createRef<FieldRef<PickerRangeValue>>();
    render(<MultiInputDateRangeField slotProps={{ textField: { position: 'start' } }} startFieldRef={startFieldRef} />);

    const sections = startFieldRef.current?.getSections();
    expect(sections).to.have.length(3);
    expect(sections?.[0].type).to.equal('month');
  });

  it('should return the sections of the end field with endFieldRef', () => {
    const endFieldRef = React.createRef<FieldRef<PickerRangeValue>>();
    render(<MultiInputDateRangeField slotProps={{ textField: { position: 'end' } }} endFieldRef={endFieldRef} />);

    const sections = endFieldRef.current?.getSections();
    expect(sections).to.have.length(3);
    expect(sections?.[0].type).to.equal('month');
  });
});

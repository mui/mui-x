import * as React from 'react';
import { spy } from 'sinon';
import { act } from '@mui/internal-test-utils';
import { DateField } from '@mui/x-date-pickers/DateField';
import { FieldRef } from '@mui/x-date-pickers/models';
import {
  createPickerRenderer,
  adapterToUse,
  getFieldInputRoot,
  expectFieldValueV7,
} from 'test/utils/pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<DateField /> - fieldRef', () => {
  const { render } = createPickerRenderer();

  it('should allow to clear the value programmatically', () => {
    const onChange = spy();
    const fieldRef = React.createRef<FieldRef<PickerValue>>();
    render(
      <DateField
        fieldRef={fieldRef}
        defaultValue={adapterToUse.date('2022-04-17')}
        onChange={onChange}
      />,
    );
    const fieldRoot = getFieldInputRoot();
    expectFieldValueV7(fieldRoot, '04/17/2022');

    act(() => {
      fieldRef.current?.clearValue();
    });

    expect(onChange.calledOnce).to.equal(true);
    expect(onChange.lastCall.args[0]).to.equal(null);
    expectFieldValueV7(fieldRoot, 'MM/DD/YYYY');
  });

  it('should return the sections with getSections', () => {
    const fieldRef = React.createRef<FieldRef<PickerValue>>();
    render(<DateField fieldRef={fieldRef} />);

    const sections = fieldRef.current?.getSections();
    expect(sections).to.have.length(3);
    expect(sections?.[0].type).to.equal('month');
    expect(sections?.[1].type).to.equal('day');
    expect(sections?.[2].type).to.equal('year');
  });

  it('should allow to focus the field and update the selected section with focusField', () => {
    const fieldRef = React.createRef<FieldRef<PickerValue>>();
    render(<DateField fieldRef={fieldRef} />);

    act(() => {
      fieldRef.current?.focusField(1);
    });

    expect(fieldRef.current?.isFieldFocused()).to.equal(true);
    expect(fieldRef.current?.getActiveSectionIndex()).to.equal(1);
  });

  it('should allow to update the selected sections with setSelectedSections', () => {
    const fieldRef = React.createRef<FieldRef<PickerValue>>();
    render(<DateField fieldRef={fieldRef} />);

    act(() => {
      fieldRef.current?.focusField();
    });

    expect(fieldRef.current?.isFieldFocused()).to.equal(true);

    act(() => {
      fieldRef.current?.setSelectedSections('all');
    });

    expect(fieldRef.current?.isFieldFocused()).to.equal(true);
  });
});

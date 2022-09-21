import * as React from 'react';
import { expect } from 'chai';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { screen } from '@mui/monorepo/test/utils';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<DateField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  it('should select all on <Tab> focus', () => {
    render(<DateField />);
    const input = screen.getByRole('textbox');
    // Simulate a <Tab> focus interaction on desktop
    input.focus();
    input.select();

    expect(input.value).to.equal('month/day/year');
    expect(input.selectionStart).to.equal(0);
    expect(input.selectionEnd).to.equal(input.value.length);
  });

  it('should select day on mobile', () => {
    render(<DateField />);
    const input: HTMLInputElement = screen.getByRole('textbox');
    // Simulate a touch focus interaction on mobile
    input.focus();
    input.setSelectionRange(7, 9);
    clock.runToLast();

    expect(input.value).to.equal('month/day/year');
    expect(input.selectionStart).to.equal(6);
    expect(input.selectionEnd).to.equal(9);
  });

  it('should select day on desktop', () => {
    render(<DateField />);
    const input = screen.getByRole('textbox');
    // Simulate a click focus interaction on desktop
    input.focus();
    input.setSelectionRange(7, 7);
    clock.runToLast();

    expect(input.value).to.equal('month/day/year');
    expect(input.selectionStart).to.equal(6);
    expect(input.selectionEnd).to.equal(9);
  });
});

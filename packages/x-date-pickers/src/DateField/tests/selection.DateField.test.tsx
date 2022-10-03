import * as React from 'react';
import { expect } from 'chai';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { screen, act } from '@mui/monorepo/test/utils';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<DateField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  it('should select all on <Tab> focus', () => {
    render(<DateField />);
    const input = screen.getByRole('textbox');
    // Simulate a <Tab> focus interaction on desktop
    act(() => {
      input.focus();
      input.select();
    });

    expect(input.value).to.equal('MM / DD / YYYY');
    expect(input.selectionStart).to.equal(0);
    expect(input.selectionEnd).to.equal(input.value.length);
  });

  it('should select day on mobile', () => {
    render(<DateField />);
    const input: HTMLInputElement = screen.getByRole('textbox');
    // Simulate a touch focus interaction on mobile
    act(() => {
      input.focus();
      input.setSelectionRange(6, 8);
      clock.runToLast();
    });

    expect(input.value).to.equal('MM / DD / YYYY');
    expect(input.selectionStart).to.equal(5);
    expect(input.selectionEnd).to.equal(7);
  });

  it('should select day on desktop', () => {
    render(<DateField />);
    const input = screen.getByRole('textbox');
    // Simulate a click focus interaction on desktop
    act(() => {
      input.focus();
      input.setSelectionRange(6, 6);
      clock.runToLast();
    });

    expect(input.value).to.equal('MM / DD / YYYY');
    expect(input.selectionStart).to.equal(5);
    expect(input.selectionEnd).to.equal(7);
  });
});

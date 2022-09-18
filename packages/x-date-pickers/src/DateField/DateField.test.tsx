import * as React from 'react';
import { expect } from 'chai';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { screen, act } from '@mui/monorepo/test/utils';
import { createPickerRenderer } from 'test/utils/pickers-utils';

describe('<DateField />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describe('selection', () => {
    it('should select all on <Tab> focus', () => {
      render(<DateField label="Basic date field" />);
      const input = screen.getByRole('textbox');
      // Simulate a <Tab> focus interaction on desktop
      input.select();
      act(() => {
        input.focus();
        clock.runToLast();
      });
      expect(input.value).to.equal('month/day/year');
      expect(input.selectionStart).to.equal(0);
      expect(input.selectionEnd).to.equal(input.value.length);
    });

    it('should select day on mobile', () => {
      render(<DateField label="Basic date field" />);
      const input = screen.getByRole('textbox');
      // Simulate a touch focus interaction on mobile
      input.setSelectionRange(7, 9);
      act(() => {
        input.focus();
        clock.runToLast();
      });
      expect(input.value).to.equal('month/day/year');
      expect(input.selectionStart).to.equal(6);
      expect(input.selectionEnd).to.equal(9);
    });

    it('should select day on desktop', () => {
      render(<DateField label="Basic date field" />);
      const input = screen.getByRole('textbox');
      // Simulate a clic focus interaction on desktop
      input.setSelectionRange(7, 7);
      act(() => {
        input.focus();
        clock.runToLast();
      });
      expect(input.value).to.equal('month/day/year');
      expect(input.selectionStart).to.equal(6);
      expect(input.selectionEnd).to.equal(9);
    });
  });
});

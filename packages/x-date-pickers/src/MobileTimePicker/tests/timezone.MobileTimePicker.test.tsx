import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { describeAdapters } from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { expect } from 'chai';

describe('<MobileTimePicker /> - Timezone', () => {
  describeAdapters('Timezone prop', MobileTimePicker, ({ adapter, render }) => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    it('should use the timezone prop for the value displayed in the toolbar', () => {
      render(
        <MobileTimePicker
          timezone="America/New_York"
          value={adapter.date('2022-04-17T15:30', 'default')}
          open
        />,
      );

      expect(screen.getByMuiTest('hours')).to.have.text('11');
    });
  });
});

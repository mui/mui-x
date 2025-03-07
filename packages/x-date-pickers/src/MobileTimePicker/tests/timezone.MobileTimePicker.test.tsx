import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { describeAdapters } from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { expect } from 'chai';
import { describeSkipIf } from 'test/utils/skipIf';

describe('<MobileTimePicker /> - Timezone', () => {
  describeAdapters('Timezone prop', MobileTimePicker, ({ adapter, render }) => {
    describeSkipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
      it('should use the timezone prop for the value displayed in the toolbar', () => {
        render(
          <MobileTimePicker
            timezone="America/New_York"
            value={adapter.date('2022-04-17T15:30', 'default')}
            open
          />,
        );

        expect(screen.getByTestId('hours')).to.have.text('11');
      });

      it('should use the updated timezone prop for the value displayed in the toolbar', () => {
        const { setProps } = render(
          <MobileTimePicker
            timezone="default"
            defaultValue={adapter.date('2022-04-17T15:30')}
            open
          />,
        );

        expect(screen.getByTestId('hours')).to.have.text('03');

        setProps({ timezone: 'America/New_York' });

        expect(screen.getByTestId('hours')).to.have.text('11');
      });
    });
  });
});

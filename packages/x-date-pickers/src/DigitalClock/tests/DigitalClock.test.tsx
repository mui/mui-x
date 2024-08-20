import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import {
  adapterToUse,
  createPickerRenderer,
  digitalClockHandler,
  formatFullTimeValue,
} from 'test/utils/pickers';
import { screen } from '@mui/internal-test-utils';

describe('<DigitalClock />', () => {
  const { render } = createPickerRenderer();

  describe('Reference date', () => {
    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();
      const referenceDate = '2018-01-01T12:30:00';

      render(<DigitalClock onChange={onChange} referenceDate={adapterToUse.date(referenceDate)} />);

      // the first item should not be initially focusable when `referenceDate` is defined
      expect(
        screen.getByRole('option', {
          name: formatFullTimeValue(adapterToUse, adapterToUse.date('2018-01-01T00:00:00')),
        }),
      ).to.have.attribute('tabindex', '-1');
      // check that the relevant time based on the `referenceDate` is focusable
      expect(
        screen.getByRole('option', {
          name: formatFullTimeValue(adapterToUse, adapterToUse.date(referenceDate)),
        }),
      ).to.have.attribute('tabindex', '0');

      digitalClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
    });

    it('should fallback to making the first entry focusable when `referenceDate` does not map to any option', () => {
      const referenceDate = '2018-01-01T12:33:00';

      render(<DigitalClock referenceDate={adapterToUse.date(referenceDate)} />);

      expect(
        screen.getByRole('option', {
          name: formatFullTimeValue(adapterToUse, new Date(2018, 0, 1, 0, 0, 0)),
        }),
      ).to.have.attribute('tabindex', '0');
    });

    it('should not use `referenceDate` when a value is defined', () => {
      const onChange = spy();

      render(
        <DigitalClock
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      digitalClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });

    it('should not use `referenceDate` when a defaultValue is defined', () => {
      const onChange = spy();

      render(
        <DigitalClock
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      digitalClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });
  });

  it('forwards list class to MenuList', () => {
    render(<DigitalClock classes={{ list: 'foo' }} />);

    expect(screen.getByRole('listbox')).to.have.class('foo');
  });

  it('forwards item class to clock item', () => {
    render(<DigitalClock classes={{ item: 'bar' }} />);

    const options = screen.getAllByRole('option');
    expect(options[0]).to.have.class('bar');
  });
});

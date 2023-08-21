import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { adapterToUse, createPickerRenderer, digitalClockHandler } from 'test/utils/pickers';

describe('<DigitalClock />', () => {
  const { render } = createPickerRenderer();

  describe('Reference date', () => {
    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();

      render(
        <DigitalClock
          onChange={onChange}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 12, 30))}
        />,
      );

      digitalClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
    });

    it('should not use `referenceDate` when a value is defined', () => {
      const onChange = spy();

      render(
        <DigitalClock
          onChange={onChange}
          value={adapterToUse.date(new Date(2019, 0, 1, 12, 30))}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 15, 30))}
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
          defaultValue={adapterToUse.date(new Date(2019, 0, 1, 12, 30))}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 15, 30))}
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
    const { getByRole } = render(<DigitalClock classes={{ list: 'foo' }} />);

    const list = getByRole('listbox');
    expect(list).to.have.class('foo');
  });

  it('forwards item class to clock item', () => {
    const { getAllByRole } = render(<DigitalClock classes={{ item: 'bar' }} />);

    const options = getAllByRole('option');
    expect(options[0]).to.have.class('bar');
  });
});

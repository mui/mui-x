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
    it('should use `referenceDate` when no value defined', async () => {
      const onChange = spy();
      const referenceDate = '2018-01-01T12:30:00';

      const { user } = render(
        <DigitalClock onChange={onChange} referenceDate={adapterToUse.date(referenceDate)} />,
      );

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

      await digitalClockHandler.setViewValue(
        user,
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

    it('should not use `referenceDate` when a value is defined', async () => {
      const onChange = spy();

      const { user } = render(
        <DigitalClock
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      await digitalClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });

    it('should not use `referenceDate` when a defaultValue is defined', async () => {
      const onChange = spy();

      const { user } = render(
        <DigitalClock
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      await digitalClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });
  });

  describe('Keyboard support', () => {
    it('should move focus up by 5 on PageUp press', async () => {
      const handleChange = spy();
      const { user } = render(<DigitalClock autoFocus onChange={handleChange} />);
      const options = screen.getAllByRole('option');
      const lastOptionIndex = options.length - 1;

      await user.keyboard('{End}'); // moves focus to last element
      await user.keyboard('{PageUp}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(options[lastOptionIndex - 5]);

      await user.keyboard('{PageUp}');
      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(options[lastOptionIndex - 10]);
    });

    it('should move focus to first item on PageUp press when current focused item index is among the first 5 items', async () => {
      const handleChange = spy();
      const { user } = render(<DigitalClock autoFocus onChange={handleChange} />);
      const options = screen.getAllByRole('option');

      // moves focus to 4th element using arrow down
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

      await user.keyboard('{PageUp}');
      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(options[0]);
    });

    it('should move focus down by 5 on PageDown press', async () => {
      const handleChange = spy();
      const { user } = render(<DigitalClock autoFocus onChange={handleChange} />);
      const options = screen.getAllByRole('option');

      await user.keyboard('{PageDown}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(options[5]);

      await user.keyboard('{PageDown}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(options[10]);
    });

    it('should move focus to last item on PageDown press when current focused item index is among the last 5 items', async () => {
      const handleChange = spy();
      const { user } = render(<DigitalClock autoFocus onChange={handleChange} />);
      const options = screen.getAllByRole('option');
      const lastOptionIndex = options.length - 1;

      const lastElement = options[lastOptionIndex];

      await user.keyboard('{End}'); // moves focus to last element
      // moves focus 4 steps above last item using arrow up
      await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
      await user.keyboard('{PageDown}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(lastElement);
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

import * as React from 'react';
import { spy } from 'sinon';
import {
  MultiSectionDigitalClock,
  MultiSectionDigitalClockProps,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import {
  createPickerRenderer,
  adapterToUse,
  multiSectionDigitalClockHandler,
} from 'test/utils/pickers';
import { screen, within } from '@mui/internal-test-utils';

describe('<MultiSectionDigitalClock />', () => {
  const { render } = createPickerRenderer();

  describe('Reference date', () => {
    it('should use `referenceDate` when no value defined', async () => {
      const onChange = spy();
      const referenceDate = '2018-01-01T13:30:00';

      const { user } = render(
        <MultiSectionDigitalClock
          onChange={onChange}
          referenceDate={adapterToUse.date(referenceDate)}
        />,
      );

      // the first section items should not be initially focusable when `referenceDate` is defined
      expect(screen.getByRole('option', { name: '12 hours' })).to.have.attribute('tabindex', '-1');
      expect(screen.getByRole('option', { name: '0 minutes' })).to.have.attribute('tabindex', '-1');
      expect(screen.getByRole('option', { name: 'AM' })).to.have.attribute('tabindex', '-1');
      // check that the relevant time based on the `referenceDate` is focusable
      expect(screen.getByRole('option', { name: '1 hours' })).to.have.attribute('tabindex', '0');
      expect(screen.getByRole('option', { name: '30 minutes' })).to.have.attribute('tabindex', '0');
      expect(screen.getByRole('option', { name: 'PM' })).to.have.attribute('tabindex', '0');

      await multiSectionDigitalClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
    });

    it('should fallback to making the first entry focusable when `referenceDate` does not map to an option', () => {
      const referenceDate = '2018-01-01T13:33:00';

      render(<MultiSectionDigitalClock referenceDate={adapterToUse.date(referenceDate)} />);

      expect(screen.getByRole('option', { name: '0 minutes' })).to.have.attribute('tabindex', '0');
    });

    it('should not use `referenceDate` when a value is defined', async () => {
      const onChange = spy();

      function ControlledMultiSectionDigitalClock(props: MultiSectionDigitalClockProps) {
        const [value, setValue] = React.useState(props.value);

        return (
          <MultiSectionDigitalClock
            {...props}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              props.onChange?.(newValue);
            }}
          />
        );
      }

      const { user } = render(
        <ControlledMultiSectionDigitalClock
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      await multiSectionDigitalClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });

    it('should not use `referenceDate` when a defaultValue is defined', async () => {
      const onChange = spy();

      const { user } = render(
        <MultiSectionDigitalClock
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      await multiSectionDigitalClockHandler.setViewValue(
        user,
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });
  });

  describe('Keyboard support', () => {
    it('should move item focus up by 5 on PageUp press', async () => {
      const handleChange = spy();
      const { user } = render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');
      const lastOptionIndex = hoursOptions.length - 1;

      await user.keyboard('{End}'); // moves focus to last element
      await user.keyboard('{PageUp}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[lastOptionIndex - 5]);

      await user.keyboard('{PageUp}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[lastOptionIndex - 10]);
    });

    it('should move focus to first item on PageUp press when current focused item index is among the first 5 items', async () => {
      const handleChange = spy();
      const { user } = render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');

      // moves focus to 4th element using arrow down
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

      await user.keyboard('{PageUp}');
      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[0]);
    });

    it('should move item focus down by 5 on PageDown press', async () => {
      const handleChange = spy();
      const { user } = render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');

      await user.keyboard('{PageDown}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[5]);

      await user.keyboard('{PageDown}');

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[10]);
    });

    it('should move focus to last item on PageDown press when current focused item index is among the last 5 items', async () => {
      const handleChange = spy();
      const { user } = render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');
      const lastOptionIndex = hoursOptions.length - 1;

      const lastElement = hoursOptions[lastOptionIndex];

      await user.keyboard('{End}'); // moves focus to last element
      // moves focus 4 steps above last item using arrow up
      await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');

      await user.keyboard('{PageDown}');
      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(lastElement);
    });
  });

  describe('focus behavior', () => {
    it('should not steal focus from external input on value re-render', async () => {
      function ControlledMultiSectionClock() {
        const [value, setValue] = React.useState(adapterToUse.date('2018-01-01T12:30:00'));
        const [inputValue, setInputValue] = React.useState('');

        return (
          <React.Fragment>
            <input
              aria-label="decoy"
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                setValue(
                  adapterToUse.setHours(
                    value!,
                    Math.min(
                      23,
                      Number.isNaN(Number(event.target.value)) ? 0 : Number(event.target.value),
                    ),
                  ),
                );
              }}
            />
            <MultiSectionDigitalClock
              autoFocus
              value={value}
              onChange={(newValue) => {
                if (newValue !== null) {
                  setValue(newValue);
                }
              }}
            />
          </React.Fragment>
        );
      }

      const { user } = render(<ControlledMultiSectionClock />);
      const input = screen.getByRole('textbox', { name: 'decoy' });

      await user.click(input);
      await user.keyboard('1');

      expect(document.activeElement).to.equal(input);
      expect((input as HTMLInputElement).value).to.equal('1');
    });
  });
});

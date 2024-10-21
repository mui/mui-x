/* eslint-disable material-ui/disallow-active-element-as-key-event-target */
import * as React from 'react';
import { expect } from 'chai';
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
import { fireEvent, screen, within } from '@mui/internal-test-utils';

describe('<MultiSectionDigitalClock />', () => {
  const { render } = createPickerRenderer();

  describe('Reference date', () => {
    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();
      const referenceDate = '2018-01-01T13:30:00';

      render(
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

      multiSectionDigitalClockHandler.setViewValue(
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

    it('should not use `referenceDate` when a value is defined', () => {
      const onChange = spy();

      function ControlledMultiSectionDigitalClock(props: MultiSectionDigitalClockProps<any>) {
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

      render(
        <ControlledMultiSectionDigitalClock
          onChange={onChange}
          value={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      multiSectionDigitalClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });

    it('should not use `referenceDate` when a defaultValue is defined', () => {
      const onChange = spy();

      render(
        <MultiSectionDigitalClock
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01T12:30:00')}
          referenceDate={adapterToUse.date('2018-01-01T15:30:00')}
        />,
      );

      multiSectionDigitalClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 1, 15, 30));
    });
  });

  describe('Keyboard support', () => {
    it('should move item focus up by 5 on PageUp press', () => {
      const handleChange = spy();
      render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');
      const lastOptionIndex = hoursOptions.length - 1;

      fireEvent.keyDown(document.activeElement!, { key: 'End' }); // moves focus to last element
      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[lastOptionIndex - 5]);

      fireEvent.keyDown(hoursOptions[lastOptionIndex - 5], { key: 'PageUp' });

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[lastOptionIndex - 10]);
    });

    it('should move focus to first item on PageUp press when current focused item index is among the first 5 items', () => {
      const handleChange = spy();
      render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');

      // moves focus to 4th element using arrow down
      [0, 1, 2].forEach((index) => {
        fireEvent.keyDown(hoursOptions[index], { key: 'ArrowDown' });
      });

      fireEvent.keyDown(hoursOptions[3], { key: 'PageUp' });
      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[0]);
    });

    it('should move item focus down by 5 on PageDown press', () => {
      const handleChange = spy();
      render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');

      fireEvent.keyDown(hoursOptions[0], { key: 'PageDown' });

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[5]);

      fireEvent.keyDown(hoursOptions[5], { key: 'PageDown' });

      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(hoursOptions[10]);
    });

    it('should move focus to last item on PageDown press when current focused item index is among the last 5 items', () => {
      const handleChange = spy();
      render(<MultiSectionDigitalClock autoFocus onChange={handleChange} />);
      const hoursSectionListbox = screen.getAllByRole('listbox')[0]; // get only hour section
      const hoursOptions = within(hoursSectionListbox).getAllByRole('option');
      const lastOptionIndex = hoursOptions.length - 1;

      const lastElement = hoursOptions[lastOptionIndex];

      fireEvent.keyDown(document.activeElement!, { key: 'End' }); // moves focus to last element
      // moves focus 4 steps above last item using arrow up
      [0, 1, 2].forEach((index) => {
        fireEvent.keyDown(hoursOptions[lastOptionIndex - index], { key: 'ArrowUp' });
      });

      fireEvent.keyDown(hoursOptions[lastOptionIndex - 3], { key: 'PageDown' });
      expect(handleChange.callCount).to.equal(0);
      expect(document.activeElement).to.equal(lastElement);
    });
  });
});

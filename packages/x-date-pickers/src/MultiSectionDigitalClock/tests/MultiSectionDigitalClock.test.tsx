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

describe('<MultiSectionDigitalClock />', () => {
  const { render } = createPickerRenderer();

  describe('Reference date', () => {
    it('should use `referenceDate` when no value defined', () => {
      const onChange = spy();

      render(
        <MultiSectionDigitalClock
          onChange={onChange}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 12, 30))}
        />,
      );

      multiSectionDigitalClockHandler.setViewValue(
        adapterToUse,
        adapterToUse.setMinutes(adapterToUse.setHours(adapterToUse.date(), 15), 30),
      );
      expect(onChange.callCount).to.equal(3);
      expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 0, 1, 15, 30));
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
          value={adapterToUse.date(new Date(2019, 0, 1, 12, 30))}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 15, 30))}
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
          defaultValue={adapterToUse.date(new Date(2019, 0, 1, 12, 30))}
          referenceDate={adapterToUse.date(new Date(2018, 0, 1, 15, 30))}
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
});

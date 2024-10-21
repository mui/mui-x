import { expect } from 'chai';
import moment from 'moment/moment';
import jMoment from 'moment-jalaali';
import { fireEvent } from '@mui/internal-test-utils';
import {
  buildFieldInteractions,
  getCleanedSelectedContent,
  getTextbox,
  createPickerRenderer,
  expectFieldValueV7,
} from 'test/utils/pickers';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { FieldSectionType, MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  getDateSectionConfigFromFormatToken,
  cleanLeadingZeros,
} from '../internals/hooks/useField/useField.utils';

const testDate = '2018-05-15T09:35:10';

function updateDate<TDate extends PickerValidDate>(
  date: TDate,
  adapter: MuiPickersAdapter<TDate>,
  sectionType: FieldSectionType,
  diff: number,
) {
  switch (sectionType) {
    case 'year':
      return adapter.addYears(date, diff);
    case 'month':
      return adapter.addMonths(date, diff);
    case 'day':
    case 'weekDay':
      return adapter.addDays(date, diff);
    case 'hours':
      return adapter.addHours(date, diff);
    case 'minutes':
      return adapter.addMinutes(date, diff);
    case 'seconds':
      return adapter.addSeconds(date, diff);
    case 'meridiem':
      return adapter.setHours(date, (adapter.getHours(date) + 12 * diff) % 24);
    default:
      return null;
  }
}

const adapterToTest = [
  'luxon',
  'date-fns',
  'dayjs',
  'moment',
  'date-fns-jalali',
  // 'moment-hijri',
  'moment-jalaali',
] as const;

describe(`RTL - test arrows navigation`, () => {
  const { render, clock, adapter } = createPickerRenderer({
    clock: 'fake',
    adapterName: 'moment-jalaali',
  });

  before(() => {
    jMoment.loadPersian();
  });

  after(() => {
    moment.locale('en');
  });

  const { renderWithProps } = buildFieldInteractions({ clock, render, Component: DateTimeField });

  it('should move selected section to the next section respecting RTL order in empty field', () => {
    const expectedValues = ['hh', 'mm', 'YYYY', 'MM', 'DD', 'DD'];

    // Test with v7 input
    let view = renderWithProps({ enableAccessibleFieldDOMStructure: true }, { direction: 'rtl' });

    view.selectSection('hours');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowRight' });
    });

    view.unmount();

    // Test with v6 input
    view = renderWithProps({ enableAccessibleFieldDOMStructure: false }, { direction: 'rtl' });

    const input = getTextbox();
    view.selectSection('hours');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(input, { key: 'ArrowRight' });
    });
  });

  it('should move selected section to the previous section respecting RTL order in empty field', () => {
    const expectedValues = ['DD', 'MM', 'YYYY', 'mm', 'hh', 'hh'];

    // Test with v7 input
    let view = renderWithProps({ enableAccessibleFieldDOMStructure: true }, { direction: 'rtl' });

    view.selectSection('day');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowLeft' });
    });

    view.unmount();

    // Test with v6 input
    view = renderWithProps({ enableAccessibleFieldDOMStructure: false }, { direction: 'rtl' });

    const input = getTextbox();
    view.selectSection('day');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
    });
  });

  it('should move selected section to the next section respecting RTL order in non-empty field', () => {
    // 25/04/2018 => 1397/02/05
    const expectedValues = ['11', '54', '1397', '02', '05', '05'];

    // Test with v7 input
    let view = renderWithProps(
      {
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2018-04-25T11:54:00'),
      },
      { direction: 'rtl' },
    );

    view.selectSection('hours');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowRight' });
    });

    view.unmount();

    // Test with v6 input
    view = renderWithProps(
      {
        defaultValue: adapter.date('2018-04-25T11:54:00'),
        enableAccessibleFieldDOMStructure: false,
      },
      { direction: 'rtl' },
    );

    const input = getTextbox();
    view.selectSection('hours');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(input, { key: 'ArrowRight' });
    });
  });

  it('should move selected section to the previous section respecting RTL order in non-empty field', () => {
    // 25/04/2018 => 1397/02/05
    const expectedValues = ['05', '02', '1397', '54', '11', '11'];

    // Test with v7 input
    let view = renderWithProps(
      {
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2018-04-25T11:54:00'),
      },
      { direction: 'rtl' },
    );

    view.selectSection('day');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(view.getActiveSection(undefined), { key: 'ArrowLeft' });
    });

    view.unmount();

    // Test with v6 input
    view = renderWithProps(
      {
        defaultValue: adapter.date('2018-04-25T11:54:00'),
        enableAccessibleFieldDOMStructure: false,
      },
      { direction: 'rtl' },
    );

    const input = getTextbox();
    view.selectSection('day');

    expectedValues.forEach((expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
    });
  });
});

adapterToTest.forEach((adapterName) => {
  describe(`test keyboard interaction with ${adapterName} adapter`, () => {
    const { render, clock, adapter } = createPickerRenderer({
      clock: 'fake',
      adapterName,
    });

    before(() => {
      if (adapterName === 'moment-jalaali') {
        jMoment.loadPersian();
      } else if (adapterName === 'moment') {
        moment.locale('en');
      }
    });

    after(() => {
      if (adapterName === 'moment-jalaali') {
        moment.locale('en');
      }
    });

    const { renderWithProps } = buildFieldInteractions({ clock, render, Component: DateTimeField });

    const cleanValueStr = (
      valueStr: string,
      sectionConfig: ReturnType<typeof getDateSectionConfigFromFormatToken>,
    ) => {
      if (sectionConfig.contentType === 'digit' && sectionConfig.maxLength != null) {
        return cleanLeadingZeros(valueStr, sectionConfig.maxLength);
      }

      return valueStr;
    };

    const testKeyPress = <TDate extends PickerValidDate>({
      key,
      format,
      initialValue,
      expectedValue,
      sectionConfig,
    }: {
      key: string;
      format: string;
      initialValue: TDate;
      expectedValue: TDate;
      sectionConfig: ReturnType<typeof getDateSectionConfigFromFormatToken>;
    }) => {
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: initialValue,
        format,
      });
      view.selectSection(sectionConfig.type);
      fireEvent.keyDown(view.getActiveSection(0), { key });

      expectFieldValueV7(
        view.getSectionsContainer(),
        cleanValueStr(adapter.formatByString(expectedValue, format), sectionConfig),
      );
    };

    const testKeyboardInteraction = (formatToken) => {
      const sectionConfig = getDateSectionConfigFromFormatToken(adapter, formatToken);

      it(`should increase "${sectionConfig.type}" when pressing ArrowUp on "${formatToken}" token`, () => {
        const initialValue = adapter.date(testDate);
        const expectedValue = updateDate(initialValue, adapter, sectionConfig.type, 1);

        testKeyPress({
          key: 'ArrowUp',
          initialValue,
          expectedValue,
          sectionConfig,
          format: formatToken,
        });
      });

      it(`should decrease "${sectionConfig.type}" when pressing ArrowDown on "${formatToken}" token`, () => {
        const initialValue = adapter.date(testDate);
        const expectedValue = updateDate(initialValue, adapter, sectionConfig.type, -1);

        testKeyPress({
          key: 'ArrowDown',
          initialValue,
          expectedValue,
          sectionConfig,
          format: formatToken,
        });
      });
    };

    Object.keys(adapter.formatTokenMap).forEach((formatToken) => {
      testKeyboardInteraction(formatToken);
    });
  });
});

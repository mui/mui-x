import { expect } from 'chai';
import moment from 'moment/moment';
import jMoment from 'moment-jalaali';
import {
  buildFieldInteractions,
  getCleanedSelectedContent,
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
    adapterName: 'moment-jalaali',
  });

  before(() => {
    jMoment.loadPersian();
  });

  after(() => {
    moment.locale('en');
  });

  const { renderWithProps } = buildFieldInteractions({ clock, render, Component: DateTimeField });

  const assertExpectedValues = async (
    expectedValues: string[],
    enableAccessibleFieldDOMStructure: boolean,
    key: string,
    defaultValue?: any,
  ) => {
    const view = renderWithProps({ enableAccessibleFieldDOMStructure, defaultValue });

    await view.selectSection('hours');

    expectedValues.forEach(async (expectedValue) => {
      expect(getCleanedSelectedContent()).to.equal(expectedValue);
      await view.user.keyboard(`{${key}}`);
    });
    view.unmount();
  };

  it('should move selected section to the next section respecting RTL order in empty field', () => {
    assertExpectedValues(['hh', 'mm', 'YYYY', 'MM', 'DD', 'DD'], true, 'ArrowRight');
  });

  it('should move selected section to the next section respecting RTL order in empty v6 field', () => {
    assertExpectedValues(['hh', 'mm', 'YYYY', 'MM', 'DD', 'DD'], false, 'ArrowRight');
  });

  it('should move selected section to the previous section respecting RTL order in empty field', () => {
    assertExpectedValues(['DD', 'MM', 'YYYY', 'mm', 'hh', 'hh'], true, 'ArrowLeft');
  });

  it('should move selected section to the previous section respecting RTL order in empty v6 field', () => {
    assertExpectedValues(['DD', 'MM', 'YYYY', 'mm', 'hh', 'hh'], false, 'ArrowLeft');
  });

  it('should move selected section to the next section respecting RTL order in non-empty field', () => {
    assertExpectedValues(
      // 25/04/2018 => 1397/02/05
      ['11', '54', '1397', '02', '05', '05'],
      true,
      'ArrowRight',
      adapter.date('2018-04-25T11:54:00'),
    );
  });

  it('should move selected section to the next section respecting RTL order in non-empty v6 field', () => {
    assertExpectedValues(
      // 25/04/2018 => 1397/02/05
      ['11', '54', '1397', '02', '05', '05'],
      false,
      'ArrowRight',
      adapter.date('2018-04-25T11:54:00'),
    );
  });

  it('should move selected section to the previous section respecting RTL order in non-empty field', () => {
    assertExpectedValues(
      // 25/04/2018 => 1397/02/05
      ['05', '02', '1397', '54', '11', '11'],
      true,
      'ArrowLeft',
      adapter.date('2018-04-25T11:54:00'),
    );
  });

  it('should move selected section to the previous section respecting RTL order in non-empty v6 field', () => {
    assertExpectedValues(
      // 25/04/2018 => 1397/02/05
      ['05', '02', '1397', '54', '11', '11'],
      false,
      'ArrowLeft',
      adapter.date('2018-04-25T11:54:00'),
    );
  });
});

adapterToTest.forEach((adapterName) => {
  describe(`test keyboard interaction with ${adapterName} adapter`, () => {
    const { render, clock, adapter } = createPickerRenderer({
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

    const testKeyPress = async <TDate extends PickerValidDate>({
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
      await view.selectSection(sectionConfig.type);
      await view.user.keyboard(`{${key}}`);

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

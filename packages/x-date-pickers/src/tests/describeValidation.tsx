/* eslint-env mocha */
import testDayViewValidation from './testValidation/testDayViewValidation';
import testMonthViewValidation from './testValidation/testMonthViewValidation';
import testTextFieldValidation from './testValidation/testTextFieldValidation';
import testYearViewValidation from './testValidation/testYearViewValidation';
import {
  BaseTimeValidationProps,
  TimeValidationProps,
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/hooks/validation/models';
import { CalendarOrClockPickerView } from '../internals/models/views';

type ValidationProps =
  | keyof (BaseTimeValidationProps &
      TimeValidationProps<any> &
      BaseDateValidationProps<any> &
      DayValidationProps<any> &
      MonthValidationProps<any> &
      YearValidationProps<any>)
  | 'minDateTime'
  | 'maxDateTime';

const defaultAvailableProps: ValidationProps[] = [
  // from now
  'disablePast',
  'disableFuture',
  // date range
  'minDate',
  'maxDate',
  // time range
  'minTime',
  'maxTime',
  // date time range
  'minDateTime',
  'maxDateTime',
  // specific moment
  'shouldDisableYear',
  'shouldDisableMonth',
  'shouldDisableDate',
  'shouldDisableTime',
  // other
  'minutesStep',
];

type AvailableTests = 'year' | 'month' | 'day' | 'textField';

const testsToRun = {
  year: testYearViewValidation,
  month: testMonthViewValidation,
  day: testDayViewValidation,
  textField: testTextFieldValidation,
};

interface ConformanceOptions {
  render: any;
  clock: any;
  after?: () => void;
  props?: any;
  views?: CalendarOrClockPickerView[];
  ignoredProps?: ValidationProps[];
  skip?: AvailableTests[];
  isLegacyPicker?: boolean;
}

/**
 * Tests various aspects of picker validation
 * components.
 * @param {React.ReactElement} minimalElement - the picker to test
 * @param {() => ConformanceOptions} getOptions
 */
export default function describeValidation(minimalElement, getOptions: () => ConformanceOptions) {
  describe('Pickers validation API', () => {
    const {
      after: runAfterHook = () => {},
      props = defaultAvailableProps,
      views = [],
      ignoredProps = [],
      skip = [],
    } = getOptions();

    const filteredTestsToRun = Object.keys(testsToRun).filter(
      (testKey) => skip.indexOf(testKey as AvailableTests) === -1,
    );

    after(runAfterHook);

    function getTestOptions() {
      return {
        ...getOptions(),
        views,
        withDate: views.includes('year') || views.includes('month') || views.includes('day'),
        withTime: views.includes('hours') || views.includes('minutes') || views.includes('seconds'),
      };
    }

    const propsToTest = props.filter((prop) => !ignoredProps.includes(prop));

    filteredTestsToRun.forEach((testKey) => {
      const test = testsToRun[testKey];
      test(minimalElement, propsToTest, getTestOptions);
    });
  });
}

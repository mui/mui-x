/* eslint-env mocha */
import {
  BaseDateValidationProps,
  TimeValidationProps,
  MonthValidationProps,
  YearValidationProps,
  DateOrTimeView,
} from '@mui/x-date-pickers/internals';
import testDayViewValidation from './testValidation/testDayViewValidation';
import testTextFieldValidation from './testValidation/testTextFieldValidation';
import { DayRangeValidationProps } from '../internal/models';

type ValidationProps =
  | keyof (DayRangeValidationProps<any> &
      BaseDateValidationProps<any> &
      MonthValidationProps<any> &
      YearValidationProps<any> &
      TimeValidationProps<any>)
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
  'shouldDisableDate',
  'shouldDisableMonth',
  'shouldDisableYear',
];

type AvailableTests = 'day' | 'textField';

const testsToRun = {
  day: testDayViewValidation,
  textField: testTextFieldValidation,
};

interface ConformanceOptions {
  render: any;
  clock: any;
  after?: () => void;
  props?: any;
  ignoredProps?: ValidationProps[];
  skip?: AvailableTests[];
  isLegacyPicker?: boolean;
  isSingleInput?: boolean;
  withDate?: boolean;
  withTime?: boolean;
  views?: DateOrTimeView[];
  mode?: 'mobile' | 'desktop';
}

/**
 * Tests various aspects of picker validation
 * components.
 * @param {React.ReactElement} minimalElement - the picker to test
 * @param {() => ConformanceOptions} getOptions
 */
export default function describeValidation(minimalElement, getOptions: () => ConformanceOptions) {
  describe('Range pickers validation API', () => {
    const {
      after: runAfterHook = () => {},
      props = defaultAvailableProps,
      ignoredProps = [],
      views = [],
      skip = [],
      withDate,
      withTime,
    } = getOptions();

    const filteredTestsToRun = Object.keys(testsToRun).filter(
      (testKey) => skip.indexOf(testKey as AvailableTests) === -1,
    );

    after(runAfterHook);

    function getTestOptions() {
      return {
        ...getOptions(),
        views,
        withDate:
          withDate ?? (views.includes('year') || views.includes('month') || views.includes('day')),
        withTime:
          withTime ??
          (views.includes('hours') || views.includes('minutes') || views.includes('seconds')),
      };
    }

    const propsToTest = props.filter((prop) => !ignoredProps.includes(prop));

    filteredTestsToRun.forEach((testKey) => {
      const test = testsToRun[testKey];
      test(minimalElement, propsToTest, getTestOptions);
    });
  });
}

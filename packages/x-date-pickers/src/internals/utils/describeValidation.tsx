/* eslint-env mocha */
import testDayViewValidation from './testValidation/testDayViewValidation';
import testMonthViewValidation from './testValidation/testMonthViewValidation';
import testTextFieldValidation from './testValidation/testTextFieldValidation';
import testYearViewValidation from './testValidation/testYearViewValidation';

const defaultAvailableProps = [
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

const testsToRun = {
  year: testYearViewValidation,
  month: testMonthViewValidation,
  day: testDayViewValidation,
  textField: testTextFieldValidation,
};

/**
 * Tests various aspects of picker validation
 * components.
 * @param {React.ReactElement} minimalElement - the picker to test
 * @param {() => ConformanceOptions} getOptions
 */
export default function describeValidation(minimalElement, getOptions) {
  describe('Pickers validation API', () => {
    const {
      after: runAfterHook = () => {},
      props = defaultAvailableProps,
      views = [],
      ignoredProps = [],
      skip = [],
    } = getOptions();

    const filteredTestsToRun = Object.keys(testsToRun).filter(
      (testKey) => skip.indexOf(testKey) === -1,
    );

    after(runAfterHook);

    function getTestOptions() {
      return {
        ...getOptions(),
        views,
        withDate: views.includes('year') || views.includes('month') || views.includes('day'),
        withTime: views.includes('hour') || views.includes('minutes') || views.includes('secondes'),
      };
    }

    const propsToTest = props.filter((prop) => !ignoredProps.includes(prop));

    filteredTestsToRun.forEach((testKey) => {
      const test = testsToRun[testKey];
      test(minimalElement, propsToTest, getTestOptions);
    });
  });
}

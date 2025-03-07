import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { PickersTimezone, PickerValidDate } from '@mui/x-date-pickers/models';
import { createPickerRenderer } from 'test/utils/pickers';
import { useValueWithTimezone } from './useValueWithTimezone';
import { singleItemValueManager } from '../utils/valueManagers';

describe('useValueWithTimezone', () => {
  const { render, adapter } = createPickerRenderer({
    clock: 'fake',
    adapterName: 'luxon',
  });

  function runTest(params: {
    timezone: PickersTimezone | undefined;
    value: PickerValidDate | null | undefined;
    defaultValue: PickerValidDate | null | undefined;
    referenceDate: PickerValidDate | undefined;
    expectedTimezone: PickersTimezone;
  }) {
    const { expectedTimezone, ...other } = params;

    function TestComponent(props: typeof other) {
      const { timezone } = useValueWithTimezone({
        ...props,
        valueManager: singleItemValueManager,
        onChange: () => {},
      });

      return <div data-testid="result">{timezone}</div>;
    }

    render(<TestComponent {...other} />);

    expect(screen.getByTestId('result').textContent).to.equal(expectedTimezone);
  }

  it('should use the timezone parameter when provided', () => {
    runTest({
      timezone: 'America/New_York',
      value: undefined,
      defaultValue: undefined,
      referenceDate: undefined,
      expectedTimezone: 'America/New_York',
    });
  });

  it('should use the timezone parameter over the value parameter when both are provided', () => {
    runTest({
      timezone: 'America/New_York',
      value: adapter.date(undefined, 'Europe/Paris'),
      defaultValue: undefined,
      referenceDate: undefined,
      expectedTimezone: 'America/New_York',
    });
  });

  it('should use the value parameter when provided', () => {
    runTest({
      timezone: undefined,
      value: adapter.date(undefined, 'America/New_York'),
      defaultValue: undefined,
      referenceDate: undefined,
      expectedTimezone: 'America/New_York',
    });
  });

  it('should use the value parameter over the defaultValue parameter when both are provided', () => {
    runTest({
      timezone: undefined,
      value: adapter.date(undefined, 'America/New_York'),
      defaultValue: adapter.date(undefined, 'Europe/Paris'),
      referenceDate: undefined,
      expectedTimezone: 'America/New_York',
    });
  });

  it('should use the defaultValue parameter when provided', () => {
    runTest({
      timezone: undefined,
      value: undefined,
      defaultValue: adapter.date(undefined, 'America/New_York'),
      referenceDate: undefined,
      expectedTimezone: 'America/New_York',
    });
  });

  it('should use the referenceDate parameter when provided', () => {
    runTest({
      timezone: undefined,
      value: undefined,
      defaultValue: undefined,
      referenceDate: adapter.date(undefined, 'America/New_York'),
      expectedTimezone: 'America/New_York',
    });
  });

  it('should use the "default" timezone is there is no way to deduce the user timezone', () => {
    runTest({
      timezone: undefined,
      value: undefined,
      defaultValue: undefined,
      referenceDate: undefined,
      expectedTimezone: 'default',
    });
  });
});

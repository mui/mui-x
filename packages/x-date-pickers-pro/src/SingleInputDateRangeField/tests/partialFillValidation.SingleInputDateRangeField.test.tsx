import * as React from 'react';
import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, getFieldInputRoot } from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - partiallyFilledDate validation', () => {
  const { render } = createPickerRenderer();

  it('should call onError with partiallyFilledDate for start when start is partially filled', async () => {
    const onError = spy();
    const { user } = render(<SingleInputDateRangeField onError={onError} />);

    const month = screen.getAllByRole('spinbutton', { name: 'Month' })[0];
    await user.click(month);
    await user.keyboard('01');

    expect(onError.callCount).to.equal(1);
    expect(onError.lastCall.args[0]).to.deep.equal(['partiallyFilledDate', null]);
  });

  it('should call onError with partiallyFilledDate for end when end is partially filled', async () => {
    const onError = spy();
    const { user } = render(<SingleInputDateRangeField onError={onError} />);

    const months = screen.getAllByRole('spinbutton', { name: 'Month' });
    const endMonth = months[1];
    await user.click(endMonth);
    await user.keyboard('01');

    expect(onError.callCount).to.equal(1);
    expect(onError.lastCall.args[0]).to.deep.equal([null, 'partiallyFilledDate']);
  });

  it('should call onError with null when partially filled start is fully cleared', async () => {
    const onError = spy();
    const { user } = render(<SingleInputDateRangeField onError={onError} />);

    const month = screen.getAllByRole('spinbutton', { name: 'Month' })[0];
    await user.click(month);
    await user.keyboard('01');
    expect(onError.lastCall.args[0]).to.deep.equal(['partiallyFilledDate', null]);

    await user.click(month);
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('{Delete}');

    expect(onError.lastCall.args[0]).to.deep.equal([null, null]);
  });

  it('should show field as invalid when start is partially filled', async () => {
    const { user } = render(<SingleInputDateRangeField />);

    const month = screen.getAllByRole('spinbutton', { name: 'Month' })[0];
    await user.click(month);
    await user.keyboard('01');

    expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
  });

  it('should return invalidDate error when start is fully filled but date is invalid', async () => {
    const onError = spy();
    const { user } = render(<SingleInputDateRangeField onError={onError} />);

    const months = screen.getAllByRole('spinbutton', { name: 'Month' });
    const days = screen.getAllByRole('spinbutton', { name: 'Day' });
    const years = screen.getAllByRole('spinbutton', { name: 'Year' });

    await user.click(months[0]);
    await user.keyboard('02');
    await user.click(days[0]);
    await user.keyboard('30');

    expect(onError.lastCall.args[0]).to.deep.equal(['partiallyFilledDate', null]);

    await user.click(years[0]);
    await user.keyboard('2024');

    expect(onError.lastCall.args[0][0]).not.to.equal('partiallyFilledDate');
    expect(onError.lastCall.args[0][0]).to.equal('invalidDate');
  });
});

import * as React from 'react';
import { spy } from 'sinon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, getFieldInputRoot } from 'test/utils/pickers';

describe('<DatePicker /> - partiallyFilledDate validation', () => {
  const { render } = createPickerRenderer();

  it('should call onError with partiallyFilledDate when date is partially filled', async () => {
    const onError = spy();
    const { user } = render(<DatePicker onError={onError} />);

    const month = screen.getByRole('spinbutton', { name: 'Month' });
    await user.click(month);
    await user.keyboard('01');

    expect(onError.callCount).to.equal(1);
    expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');
  });

  it('should call onError with null when partially filled field is fully cleared', async () => {
    const onError = spy();
    const { user } = render(<DatePicker onError={onError} />);

    const month = screen.getByRole('spinbutton', { name: 'Month' });
    await user.click(month);
    await user.keyboard('01');
    expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');

    await user.click(month);
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('{Delete}');

    expect(onError.lastCall.args[0]).to.equal(null);
  });

  it('should return invalidDate error when all sections filled but date is invalid', async () => {
    const onError = spy();
    const { user } = render(<DatePicker onError={onError} />);

    const month = screen.getByRole('spinbutton', { name: 'Month' });
    await user.click(month);
    await user.keyboard('02');

    const day = screen.getByRole('spinbutton', { name: 'Day' });
    await user.click(day);
    await user.keyboard('30');

    expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');

    const year = screen.getByRole('spinbutton', { name: 'Year' });
    await user.click(year);
    await user.keyboard('2024');

    expect(onError.lastCall.args[0]).not.to.equal('partiallyFilledDate');
    expect(onError.lastCall.args[0]).to.equal('invalidDate');
  });

  it('should show field as invalid when partially filled', async () => {
    const { user } = render(<DatePicker />);

    const month = screen.getByRole('spinbutton', { name: 'Month' });
    await user.click(month);
    await user.keyboard('01');

    expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
  });
});

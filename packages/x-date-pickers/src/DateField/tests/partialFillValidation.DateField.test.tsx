import { DateField } from '@mui/x-date-pickers/DateField';
import { describeAdapters, getFieldInputRoot } from 'test/utils/pickers';
import { spy } from 'sinon';

describeAdapters('DateField - partiallyFilledDate validation', DateField, ({ renderWithProps }) => {
  it('should call onError with partiallyFilledDate when date is partially filled', async () => {
    const onError = spy();
    const view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      onError,
    });

    await view.selectSectionAsync('month');
    await view.user.keyboard('01');

    expect(onError.callCount).to.equal(1);
    expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');
  });

  it('should call onError with null when partially filled field is fully cleared', async () => {
    const onError = spy();
    const view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      onError,
    });

    await view.selectSectionAsync('month');
    await view.user.keyboard('01');
    expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');

    await view.selectSectionAsync('month');
    await view.user.keyboard('{Control>}a{/Control}');
    await view.user.keyboard('{Delete}');

    expect(onError.lastCall.args[0]).to.equal(null);
  });
  it('should return invalidDate error when all sections filled but date is invalid', async () => {
    const onError = spy();
    const view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      onError,
    });

    await view.selectSectionAsync('month');
    await view.user.keyboard('02');
    await view.selectSectionAsync('day');
    await view.user.keyboard('30');

    expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');

    await view.selectSectionAsync('year');
    await view.user.keyboard('2024');

    expect(onError.lastCall.args[0]).not.to.equal('partiallyFilledDate');
    expect(onError.lastCall.args[0]).to.equal('invalidDate');
  });

  it('should show field as invalid when partially filled', async () => {
    const view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

    await view.selectSectionAsync('month');
    await view.user.keyboard('01');

    expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
  });
});

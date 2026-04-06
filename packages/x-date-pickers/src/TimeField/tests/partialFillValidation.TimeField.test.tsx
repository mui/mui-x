import { TimeField } from '@mui/x-date-pickers/TimeField';
import { describeAdapters, getFieldInputRoot, getTextbox } from 'test/utils/pickers';
import { fireEvent } from '@mui/internal-test-utils';
import { spy } from 'sinon';

describeAdapters(
  'TimeField - partiallyFilledDate validation',
  TimeField,
  ({ adapter, renderWithProps }) => {
    it('should call onError with partiallyFilledDate when date is partially filled', async () => {
      const onError = spy();
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onError,
      });

      await view.selectSectionAsync('hours');
      await view.user.keyboard('10');

      expect(onError.callCount).to.equal(1);
      expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');
    });

    it('should call onError with null when partially filled field is fully cleared', async () => {
      const onError = spy();
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onError,
      });

      await view.selectSectionAsync('hours');
      await view.user.keyboard('10');
      expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');

      await view.selectSectionAsync('hours');
      await view.user.keyboard('{Control>}a{/Control}');
      await view.user.keyboard('{Delete}');

      expect(onError.lastCall.args[0]).to.equal(null);
    });
    it('should return null error when all sections filled', async () => {
      const onError = spy();
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onError,
      });

      await view.selectSectionAsync('hours');
      await view.user.keyboard('10');
      await view.selectSectionAsync('minutes');
      await view.user.keyboard('10');

      expect(onError.lastCall.args[0]).to.equal('partiallyFilledDate');

      await view.selectSectionAsync('meridiem');
      await view.user.keyboard('AM');

      expect(onError.lastCall.args[0]).not.to.equal('partiallyFilledDate');
      expect(onError.lastCall.args[0]).to.equal(null);
    });

    it('should show field as invalid when partially filled', async () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      await view.selectSectionAsync('hours');
      await view.user.keyboard('10');

      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
    });
  },
);

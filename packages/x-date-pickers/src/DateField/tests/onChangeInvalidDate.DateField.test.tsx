import { spy } from 'sinon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { describeAdapters } from 'test/utils/pickers';

describeAdapters(
  'DateField - onChange receives correct value for invalid input',
  DateField,
  ({ adapter, renderWithProps }) => {
    it('should call onChange with Invalid Date (not null) when typing invalid month in valid field', async () => {
      const handleChange = spy();

      // start with VALID date
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2022-04-17'),
        onChange: handleChange,
      });

      await view.selectSectionAsync('month');
      view.pressKey(0, '0');

      expect(handleChange.callCount).to.be.greaterThan(0);

      const lastCall = handleChange.lastCall;
      const receivedValue = lastCall.args[0];

      expect(receivedValue).not.to.equal(null);
      expect(adapter.isValid(receivedValue)).to.equal(false);

      view.unmount();
    });

    it('should call onChange with Invalid Date consistently when changing year after typing invalid month', async () => {
      const handleChange = spy();

      // start with VALID date
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: adapter.date('2022-04-17'),
        onChange: handleChange,
      });

      await view.selectSectionAsync('month');
      view.pressKey(0, '0');

      handleChange.resetHistory();

      await view.selectSectionAsync('year');
      await view.user.keyboard('[ArrowUp]');

      expect(handleChange.callCount).to.be.greaterThan(0);
      let receivedValue = handleChange.lastCall.args[0];
      expect(receivedValue).not.to.equal(null);
      expect(receivedValue).not.to.equal(undefined);
      expect(adapter.isValid(receivedValue)).to.equal(false);

      // Press ArrowUp again should still give Invalid Date
      await view.user.keyboard('[ArrowUp]');

      receivedValue = handleChange.lastCall.args[0];
      expect(receivedValue).not.to.equal(null);
      expect(receivedValue).not.to.equal(undefined);
      expect(adapter.isValid(receivedValue)).to.equal(false);

      view.unmount();
    });
  },
);

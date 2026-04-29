import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { waitFor } from '@mui/internal-test-utils';
import { expectFieldValue, describeAdapters } from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Editing', () => {
  describeAdapters(
    'value props (value, defaultValue, onChange)',
    SingleInputDateRangeField,
    ({ adapter, renderWithProps }) => {
      it('should not render any value when no value and no default value are defined', () => {
        const view = renderWithProps({});

        expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY – MM/DD/YYYY');
      });

      it('should use the default value when defined', () => {
        const view = renderWithProps({
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValue(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
      });

      it('should use the controlled value instead of the default value when both are defined', () => {
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValue(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
      });

      it('should use the controlled value instead of the default value when both are defined and the controlled value has null dates', () => {
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), null],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValue(view.getSectionsContainer(), '06/04/2022 – MM/DD/YYYY');
      });

      it('should react to controlled value update (from a non null date to another non null date)', () => {
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValue(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });
        expectFieldValue(view.getSectionsContainer(), '06/04/2023 – 06/05/2023');
      });

      it('should react to controlled value update (from a non null date to a null date)', () => {
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValue(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [null, adapter.date('2022-06-05')],
        });
        expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');
      });

      it('should react to controlled value update (from a null date to a non null date)', () => {
        const view = renderWithProps({
          value: [null, adapter.date('2022-06-05')],
        });

        expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');

        view.setProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });
        expectFieldValue(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');
      });

      it('should call the onChange callback when the value is updated but should not change the displayed value if the value is controlled', async () => {
        const onChange = spy();
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange,
        });

        await view.selectSection('year');

        await view.pressKey('ArrowUp');
        expectFieldValue(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChange.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
      });

      it('should call the onChange callback when the value is updated and should change the displayed value if the value is not controlled', async () => {
        const onChange = spy();
        const view = renderWithProps({
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange,
        });

        await view.selectSection('year');

        await view.pressKey('ArrowUp');
        expectFieldValue(view.getSectionsContainer(), '06/04/2023 – 06/05/2022');

        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChange.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
      });

      it('should not call the onChange callback before filling the last section of the active date when starting from a null value', async () => {
        const onChange = spy();
        const view = renderWithProps({
          value: [null, null],
          onChange,
          format: `${adapter.formats.dayOfMonth} ${adapter.formats.monthShort}`,
        });

        await view.selectSection('day');

        await view.pressKey('4');
        expect(onChange.callCount).to.equal(0);
        expectFieldValue(view.getSectionsContainer(), '04 MMMM – DD MMMM');

        await view.pressKey('S');
        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.firstArg[0]).toEqualDateTime(new Date(2022, 8, 4));
        expect(onChange.lastCall.firstArg[1]).to.equal(null);
        await waitFor(() => {
          expectFieldValue(view.getSectionsContainer(), 'DD MMMM – DD MMMM');
        });
      });
    },
  );

  describeAdapters(`key: Delete`, SingleInputDateRangeField, ({ adapter, renderWithProps }) => {
    it('should clear all the sections when all sections are selected and all sections are completed', async () => {
      const view = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expectFieldValue(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', async () => {
      const view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      await view.selectSection('month');

      // Set a value for the "month" section
      await view.user.keyboard('j');
      expectFieldValue(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expectFieldValue(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
    });

    it('should not call `onChange` when clearing all sections and both dates are already empty', async () => {
      const onChange = spy();

      const view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange,
      });

      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(0);
    });

    it('should call `onChange` when clearing the first section of each date', async () => {
      const onChange = spy();

      const view = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange,
      });

      await view.selectSection('month');

      // Start date
      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.firstArg[0]).to.equal(null);
      expect(onChange.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(1);

      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(1);

      // End date
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.firstArg[0]).to.equal(null);
      expect(onChange.lastCall.firstArg[1]).to.equal(null);

      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(2);

      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(2);
    });

    it('should not call `onChange` if the section is already empty', async () => {
      const onChange = spy();

      const view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange,
      });

      await view.selectSection('month');

      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(1);

      await view.user.keyboard('{Delete}');
      expect(onChange.callCount).to.equal(1);
    });
  });

  describeAdapters(
    `Backspace editing`,
    SingleInputDateRangeField,
    ({ adapter, renderWithProps }) => {
      it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', async () => {
        const view = renderWithProps({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        await view.selectSection('month');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expectFieldValue(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', async () => {
        const view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        await view.selectSection('month');

        // Set a value for the "month" section
        await view.user.keyboard('j');
        expectFieldValue(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expectFieldValue(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');
      });

      it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', async () => {
        const onChange = spy();

        const view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          onChange,
        });

        await view.selectSection('month');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(0);
      });

      it('should call `onChange` when clearing the first section of each date (Backspace)', async () => {
        const onChange = spy();

        const view = renderWithProps({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange,
        });

        await view.selectSection('month');

        // Start date
        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.firstArg[0]).to.equal(null);
        expect(onChange.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(1);

        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(1);

        // End date
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(2);
        expect(onChange.lastCall.firstArg[0]).to.equal(null);
        expect(onChange.lastCall.firstArg[1]).to.equal(null);

        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(2);

        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(2);
      });

      it('should not call `onChange` if the section is already empty (Backspace)', async () => {
        const onChange = spy();

        const view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange,
        });

        await view.selectSection('month');

        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(1);

        await view.user.keyboard('{Backspace}');
        expect(onChange.callCount).to.equal(1);
      });
    },
  );
});

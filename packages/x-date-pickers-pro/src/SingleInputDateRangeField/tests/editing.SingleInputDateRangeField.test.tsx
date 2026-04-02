import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { fireEvent, waitFor } from '@mui/internal-test-utils';
import { expectFieldValueV7, describeAdapters } from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Editing', () => {
  describeAdapters(
    'value props (value, defaultValue, onChange)',
    SingleInputDateRangeField,
    ({ adapter, renderWithProps }) => {
      it('should not render any value when no value and no default value are defined', () => {
        // Test with accessible DOM structure
        const view = renderWithProps({});

        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY – MM/DD/YYYY');

        view.unmount();
      });

      it('should use the default value when defined', () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.unmount();
      });

      it('should use the controlled value instead of the default value when both are defined', () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.unmount();
      });

      it('should use the controlled value instead of the default value when both are defined and the controlled value has null dates', () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), null],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – MM/DD/YYYY');

        view.unmount();
      });

      it('should react to controlled value update (from a non null date to another non null date)', () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2023 – 06/05/2023');

        view.unmount();
      });

      it('should react to controlled value update (from a non null date to a null date)', () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [null, adapter.date('2022-06-05')],
        });
        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');

        view.unmount();
      });

      it('should react to controlled value update (from a null date to a non null date)', () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          value: [null, adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');

        view.setProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.unmount();
      });

      it('should call the onChange callback when the value is updated but should not change the displayed value if the value is controlled', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        const view = renderWithProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange: onChangeV7,
        });

        await view.selectSectionAsync('year');

        view.pressKey(2, 'ArrowUp');
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));

        view.unmount();
      });

      it('should call the onChange callback when the value is updated and should change the displayed value if the value is not controlled', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        const view = renderWithProps({
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange: onChangeV7,
        });

        await view.selectSectionAsync('year');

        view.pressKey(2, 'ArrowUp');
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2023 – 06/05/2022');

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));

        view.unmount();
      });

      it('should not call the onChange callback before filling the last section of the active date when starting from a null value', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        const view = renderWithProps({
          value: [null, null],
          onChange: onChangeV7,
          format: `${adapter.formats.dayOfMonth} ${adapter.formats.monthShort}`,
        });

        await view.selectSectionAsync('day');

        view.pressKey(0, '4');
        expect(onChangeV7.callCount).to.equal(0);
        expectFieldValueV7(view.getSectionsContainer(), '04 MMMM – DD MMMM');

        view.pressKey(1, 'S');
        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2022, 8, 4));
        expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);
        await waitFor(() => {
          expectFieldValueV7(view.getSectionsContainer(), 'DD MMMM – DD MMMM');
        });

        view.unmount();
      });
    },
  );

  describeAdapters(`key: Delete`, SingleInputDateRangeField, ({ adapter, renderWithProps }) => {
    it('should clear all the sections when all sections are selected and all sections are completed', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

      view.unmount();
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      await view.selectSectionAsync('month');

      // Set a value for the "month" section
      fireEvent.input(view.getActiveSection(0), { target: { innerHTML: 'j' } });
      expectFieldValueV7(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

      view.unmount();
    });

    it('should not call `onChange` when clearing all sections and both dates are already empty', async () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      const view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV7,
      });

      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();
    });

    it('should call `onChange` when clearing the first section of each date', async () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      const view = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV7,
      });

      await view.selectSectionAsync('month');

      // Start date
      fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);
      expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(1), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(2), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      // End date
      fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(3), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(2);
      expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);

      fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(4), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(2);

      fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(5), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(2);

      view.unmount();
    });

    it('should not call `onChange` if the section is already empty', async () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      const view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV7,
      });

      await view.selectSectionAsync('month');

      fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      view.unmount();
    });
  });

  describeAdapters(
    `Backspace editing`,
    SingleInputDateRangeField,
    ({ adapter, renderWithProps }) => {
      it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', async () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        await view.selectSectionAsync('month');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

        view.unmount();
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', async () => {
        // Test with accessible DOM structure
        const view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        await view.selectSectionAsync('month');

        // Set a value for the "month" section
        fireEvent.input(view.getActiveSection(0), { target: { innerHTML: 'j' } });
        expectFieldValueV7(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

        view.unmount();
      });

      it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();

        const view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          onChange: onChangeV7,
        });

        await view.selectSectionAsync('month');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });

        view.pressKey(null, '');
        expect(onChangeV7.callCount).to.equal(0);

        view.unmount();
      });

      it('should call `onChange` when clearing the first section of each date (Backspace)', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();

        const view = renderWithProps({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV7,
        });

        await view.selectSectionAsync('month');

        // Start date
        view.pressKey(0, '');
        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(
          adapter.addYears(adapter.date(), 1),
        );

        fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
        view.pressKey(1, '');
        expect(onChangeV7.callCount).to.equal(1);

        fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
        view.pressKey(2, '');
        expect(onChangeV7.callCount).to.equal(1);

        // End date
        fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
        view.pressKey(3, '');
        expect(onChangeV7.callCount).to.equal(2);
        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);

        fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
        view.pressKey(4, '');
        expect(onChangeV7.callCount).to.equal(2);

        fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
        view.pressKey(5, '');
        expect(onChangeV7.callCount).to.equal(2);

        view.unmount();
      });

      it('should not call `onChange` if the section is already empty (Backspace)', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();

        const view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV7,
        });

        await view.selectSectionAsync('month');

        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(1);

        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(1);

        view.unmount();
      });
    },
  );
});

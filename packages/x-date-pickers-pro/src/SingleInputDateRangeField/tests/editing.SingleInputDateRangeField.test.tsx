import { expect } from 'chai';
import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { fireEvent, waitFor } from '@mui/internal-test-utils';
import {
  expectFieldValueV7,
  expectFieldValueV6,
  describeAdapters,
  getTextbox,
} from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<SingleInputDateRangeField /> - Editing', () => {
  describeAdapters(
    'value props (value, defaultValue, onChange)',
    SingleInputDateRangeField,
    ({ adapter, renderWithProps }) => {
      it('should not render any value when no value and no default value are defined', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
        });

        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY – MM/DD/YYYY');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
        });

        expectFieldValueV6(getTextbox(), '');
      });

      it('should use the default value when defined', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV6(getTextbox(), '06/04/2022 – 06/05/2022');
      });

      it('should use the controlled value instead of the default value when both are defined', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValueV6(getTextbox(), '06/04/2022 – 06/05/2022');
      });

      it('should use the controlled value instead of the default value when both are defined and the controlled value has null dates', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: [adapter.date('2022-06-04'), null],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – MM/DD/YYYY');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: [adapter.date('2022-06-04'), null],
          defaultValue: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });

        expectFieldValueV6(getTextbox(), '06/04/2022 – MM/DD/YYYY');
      });

      it('should react to controlled value update (from a non null date to another non null date)', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2023 – 06/05/2023');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV6(getTextbox(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [adapter.date('2023-06-04'), adapter.date('2023-06-05')],
        });
        expectFieldValueV6(getTextbox(), '06/04/2023 – 06/05/2023');
      });

      it('should react to controlled value update (from a non null date to a null date)', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [null, adapter.date('2022-06-05')],
        });
        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });

        expectFieldValueV6(getTextbox(), '06/04/2022 – 06/05/2022');

        view.setProps({
          value: [null, adapter.date('2022-06-05')],
        });
        expectFieldValueV6(getTextbox(), 'MM/DD/YYYY – 06/05/2022');
      });

      it('should react to controlled value update (from a null date to a non null date)', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: [null, adapter.date('2022-06-05')],
        });

        expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY – 06/05/2022');

        view.setProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: [null, adapter.date('2022-06-05')],
        });

        expectFieldValueV6(getTextbox(), 'MM/DD/YYYY – 06/05/2022');

        view.setProps({
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
        });
        expectFieldValueV6(getTextbox(), '06/04/2022 – 06/05/2022');
      });

      it('should call the onChange callback when the value is updated but should not change the displayed value if the value is controlled', () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange: onChangeV7,
        });

        view.selectSection('year');

        view.pressKey(2, 'ArrowUp');
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2022 – 06/05/2022');

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));

        view.unmount();

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange: onChangeV6,
        });

        view.selectSection('year');
        const input = getTextbox();
        fireUserEvent.keyPress(input, { key: 'ArrowUp' });
        expectFieldValueV6(getTextbox(), '06/04/2022 – 06/05/2022');

        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
      });

      it('should call the onChange callback when the value is updated and should change the displayed value if the value is not controlled', () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange: onChangeV7,
        });

        view.selectSection('year');

        view.pressKey(2, 'ArrowUp');
        expectFieldValueV7(view.getSectionsContainer(), '06/04/2023 – 06/05/2022');

        expect(onChangeV7.callCount).to.equal(1);
        expect(onChangeV7.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));

        view.unmount();

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          defaultValue: [adapter.date('2022-06-04'), adapter.date('2022-06-05')],
          onChange: onChangeV6,
        });

        view.selectSection('year');
        const input = getTextbox();
        fireUserEvent.keyPress(input, { key: 'ArrowUp' });
        expectFieldValueV6(getTextbox(), '06/04/2023 – 06/05/2022');

        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg[0]).toEqualDateTime(new Date(2023, 5, 4));
        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(new Date(2022, 5, 5));
      });

      it('should not call the onChange callback before filling the last section of the active date when starting from a null value', async () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: [null, null],
          onChange: onChangeV7,
          format: `${adapter.formats.dayOfMonth} ${adapter.formats.monthShort}`,
        });

        view.selectSection('day');

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

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();
        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          value: [null, null],
          onChange: onChangeV6,
          format: `${adapter.formats.dayOfMonth} ${adapter.formats.monthShort}`,
        });

        view.selectSection('day');
        const input = getTextbox();

        fireEvent.change(input, { target: { value: '4 MMMM – DD MMMM' } }); // Press 4
        expect(onChangeV6.callCount).to.equal(0);
        expectFieldValueV6(input, '04 MMMM – DD MMMM');

        fireEvent.change(input, { target: { value: '04 S – DD MMMM' } }); // Press S
        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg[0]).toEqualDateTime(new Date(2022, 8, 4));
        expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
        // // We reset the value displayed because the `onChange` callback did not update the controlled value.
        await waitFor(() => {
          expectFieldValueV6(input, 'DD MMMM – DD MMMM');
        });
      });
    },
  );

  describeAdapters(`key: Delete`, SingleInputDateRangeField, ({ adapter, renderWithProps }) => {
    it('should clear all the sections when all sections are selected and all sections are completed', () => {
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

      fireEvent.keyDown(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', () => {
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      view.selectSection('month');

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

      // Test with non-accessible DOM structure
      view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Set a value for the "month" section
      fireEvent.change(input, {
        target: { value: 'j YYYY – MMMM YYYY' },
      }); // Press "j"
      expectFieldValueV6(input, 'January YYYY – MMMM YYYY');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

      fireEvent.keyDown(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should not call `onChange` when clearing all sections and both dates are already empty', () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV7,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();

      view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should call `onChange` when clearing the first section of each date', () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV7,
      });

      view.selectSection('month');

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

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();

      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Start date
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);
      expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);

      // End date
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(2);
      expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(2);

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(2);
    });

    it('should not call `onChange` if the section is already empty', () => {
      // Test with accessible DOM structure
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV7,
      });

      view.selectSection('month');

      fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      fireEvent.keyDown(view.getActiveSection(0), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);

      view.unmount();

      // Test with non-accessible DOM structure
      const onChangeV6 = spy();

      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);

      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);
    });
  });

  describeAdapters(
    `Backspace editing`,
    SingleInputDateRangeField,
    ({ adapter, renderWithProps }) => {
      it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

        view.unmount();

        // Test with non-accessible DOM structure
        view = renderWithProps({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

        fireEvent.change(input, { target: { value: '' } });
        expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', () => {
        // Test with accessible DOM structure
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        view.selectSection('month');

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

        // Test with non-accessible DOM structure
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Set a value for the "month" section
        fireEvent.change(input, {
          target: { value: 'j YYYY – MMMM YYYY' },
        }); // Press "j"
        expectFieldValueV6(input, 'January YYYY – MMMM YYYY');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

        fireEvent.change(input, { target: { value: '' } });
        expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
      });

      it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          onChange: onChangeV7,
        });

        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), {
          key: 'a',
          keyCode: 65,
          ctrlKey: true,
        });

        view.pressKey(null, '');
        expect(onChangeV7.callCount).to.equal(0);

        view.unmount();

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();

        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
          onChange: onChangeV6,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });

        fireEvent.change(input, { target: { value: 'Delete' } });
        expect(onChangeV6.callCount).to.equal(0);
      });

      it('should call `onChange` when clearing the first section of each date (Backspace)', () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV7,
        });

        view.selectSection('month');

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

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();

        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV6,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Start date
        fireEvent.change(input, { target: { value: '/15/2022 – 06/15/2023' } });
        expect(onChangeV6.callCount).to.equal(1);
        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(
          adapter.addYears(adapter.date(), 1),
        );

        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM//2022 – 06/15/2023' } });
        expect(onChangeV6.callCount).to.equal(1);

        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/ – 06/15/2023' } });
        expect(onChangeV6.callCount).to.equal(1);

        // End date
        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/YYYY – /15/2023' } });
        expect(onChangeV6.callCount).to.equal(2);
        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);

        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/YYYY – MM//2023' } });
        expect(onChangeV6.callCount).to.equal(2);

        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/YYYY – MM/DD/' } });
        expect(onChangeV6.callCount).to.equal(2);
      });

      it('should not call `onChange` if the section is already empty (Backspace)', () => {
        // Test with accessible DOM structure
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV7,
        });

        view.selectSection('month');

        view.pressKey(0, '');
        expect(onChangeV7.callCount).to.equal(1);

        view.pressKey(0, '');
        expect(onChangeV7.callCount).to.equal(1);

        view.unmount();

        // Test with non-accessible DOM structure
        const onChangeV6 = spy();

        view = renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV6,
        });

        const input = getTextbox();
        view.selectSection('month');

        fireEvent.change(input, { target: { value: ' 2022 – June 2023' } });
        expect(onChangeV6.callCount).to.equal(1);

        fireEvent.change(input, { target: { value: ' 2022 – June 2023' } });
        expect(onChangeV6.callCount).to.equal(1);
      });
    },
  );
});

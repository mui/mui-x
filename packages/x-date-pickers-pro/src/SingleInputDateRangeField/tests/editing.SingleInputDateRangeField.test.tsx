import { expect } from 'chai';
import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { fireEvent } from '@mui/internal-test-utils';
import {
  expectFieldValueV7,
  expectFieldValueV6,
  describeAdapters,
  getTextbox,
} from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Editing', () => {
  describeAdapters(`key: Delete`, SingleInputDateRangeField, ({ adapter, renderWithProps }) => {
    it('should clear all the sections when all sections are selected and all sections are completed', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

      fireEvent.keyDown(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      view.selectSection('month');

      // Set a value for the "month" section
      fireEvent.input(view.getActiveSection(0), { target: { innerHTML: 'j' } });
      expectFieldValueV7(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

      view.unmount();

      // Test with v6 input
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
      fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

      fireEvent.keyDown(input, { key: 'Delete' });
      expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should not call `onChange` when clearing all sections and both dates are already empty', () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV7,
      });

      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
        onChange: onChangeV6,
      });

      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should call `onChange` when clearing the first and last section of each date', () => {
      // Test with v7 input
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
      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(1), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(1);
      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(2), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(2);
      expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

      // End date
      fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(3), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(3);
      fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(4), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(3);
      fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
      fireEvent.keyDown(view.getActiveSection(5), { key: 'Delete' });
      expect(onChangeV7.callCount).to.equal(4);
      expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);

      view.unmount();

      // Test with v6 input
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
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(1);
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(2);
      expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

      // End date
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(3);
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(3);
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'Delete' });
      expect(onChangeV6.callCount).to.equal(4);
      expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
    });

    it('should not call `onChange` if the section is already empty', () => {
      // Test with v7 input
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

      // Test with v6 input
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
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

        view.unmount();

        // Test with v6 input
        view = renderWithProps({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

        fireEvent.change(input, { target: { value: '' } });
        expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', () => {
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        view.selectSection('month');

        // Set a value for the "month" section
        fireEvent.input(view.getActiveSection(0), { target: { innerHTML: 'j' } });
        expectFieldValueV7(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

        view.pressKey(null, '');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

        view.unmount();

        // Test with v6 input
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
        fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

        fireEvent.change(input, { target: { value: '' } });
        expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
      });

      it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          onChange: onChangeV7,
        });

        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });

        view.pressKey(null, '');
        expect(onChangeV7.callCount).to.equal(0);

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
          onChange: onChangeV6,
        });

        const input = getTextbox();
        view.selectSection('month');

        // Select all sections
        fireEvent.keyDown(input, { key: 'a', ctrlKey: true });

        fireEvent.change(input, { target: { value: 'Delete' } });
        expect(onChangeV6.callCount).to.equal(0);
      });

      it('should call `onChange` when clearing the first and last section of each date (Backspace)', () => {
        // Test with v7 input
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
        fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
        view.pressKey(1, '');
        expect(onChangeV7.callCount).to.equal(1);
        fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
        view.pressKey(2, '');
        expect(onChangeV7.callCount).to.equal(2);
        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(
          adapter.addYears(adapter.date(), 1),
        );

        // End date
        fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
        view.pressKey(3, '');
        expect(onChangeV7.callCount).to.equal(3);
        fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
        view.pressKey(4, '');
        expect(onChangeV7.callCount).to.equal(3);
        fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
        view.pressKey(5, '');
        expect(onChangeV7.callCount).to.equal(4);
        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV7.lastCall.firstArg[1]).to.equal(null);

        view.unmount();

        // Test with v6 input
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
        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM//2022 – 06/15/2023' } });
        expect(onChangeV6.callCount).to.equal(1);
        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/ – 06/15/2023' } });
        expect(onChangeV6.callCount).to.equal(2);
        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(
          adapter.addYears(adapter.date(), 1),
        );

        // End date
        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/YYYY – /15/2023' } });
        expect(onChangeV6.callCount).to.equal(3);
        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/YYYY – MM//2023' } });
        expect(onChangeV6.callCount).to.equal(3);
        fireEvent.keyDown(input, { key: 'ArrowRight' });
        fireEvent.change(input, { target: { value: 'MM/DD/YYYY – MM/DD/' } });
        expect(onChangeV6.callCount).to.equal(4);
        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
      });

      it('should not call `onChange` if the section is already empty (Backspace)', () => {
        // Test with v7 input
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

        // Test with v6 input
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

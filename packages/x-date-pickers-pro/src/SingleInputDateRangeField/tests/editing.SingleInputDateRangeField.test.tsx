import { expect } from 'chai';
import { spy } from 'sinon';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import {
  expectFieldValueV7,
  expectFieldValueV6,
  describeAdapters,
  getTextbox,
} from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Editing', () => {
  describeAdapters(`key: Delete`, SingleInputDateRangeField, ({ adapter, renderWithProps }) => {
    it('should clear all the sections when all sections are selected and all sections are completed', async () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should clear all the sections when all sections are selected and not all sections are completed', async () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
      });

      await view.selectSection('month');

      // Set a value for the "month" section
      await view.user.keyboard('j');
      expectFieldValueV7(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
      });

      const input = getTextbox();
      await view.selectSection('month');

      // Set a value for the "month" section
      await view.user.keyboard('j');
      expectFieldValueV6(input, 'January YYYY – MMMM YYYY');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
    });

    it('should not call `onChange` when clearing all sections and both dates are already empty', async () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        onChange: onChangeV7,
      });

      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expect(onChangeV7.callCount).to.equal(0);

      view.unmount();

      // Test with v6 input
      const onChangeV6 = spy();

      view = renderWithProps({
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        enableAccessibleFieldDOMStructure: false,
        onChange: onChangeV6,
      });

      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');

      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(0);
    });

    it('should call `onChange` when clearing the first and last section of each date', async () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV7,
      });

      await view.selectSection('month');

      // Start date
      await view.user.keyboard('{Delete}');
      expect(onChangeV7.callCount).to.equal(1);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV7.callCount).to.equal(1);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV7.callCount).to.equal(2);
      expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

      // End date
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV7.callCount).to.equal(3);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV7.callCount).to.equal(3);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
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

      await view.selectSection('month');

      // Start date
      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(1);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(1);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(2);
      expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(adapter.addYears(adapter.date(), 1));

      // End date
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(3);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(3);
      await view.user.keyboard('{ArrowRight}');
      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(4);
      expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
      expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
    });

    it('should not call `onChange` if the section is already empty', async () => {
      // Test with v7 input
      const onChangeV7 = spy();

      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `${adapter.formats.month} ${adapter.formats.year}`,
        defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
        onChange: onChangeV7,
      });

      await view.selectSection('month');

      await view.user.keyboard('{Delete}');
      expect(onChangeV7.callCount).to.equal(1);

      await view.user.keyboard('{Delete}');
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

      await view.selectSection('month');

      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(1);

      await view.user.keyboard('{Delete}');
      expect(onChangeV6.callCount).to.equal(1);
    });
  });

  describeAdapters(
    `Backspace editing`,
    SingleInputDateRangeField,
    ({ adapter, renderWithProps }) => {
      it('should clear all the sections when all sections are selected and all sections are completed (Backspace)', async () => {
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        await view.selectSection('month');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

        view.unmount();

        // Test with v6 input
        view = renderWithProps({
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        await view.selectSection('month');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
      });

      it('should clear all the sections when all sections are selected and not all sections are completed (Backspace)', async () => {
        // Test with v7 input
        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
        });

        await view.selectSection('month');

        // Set a value for the "month" section
        await view.user.keyboard('j');
        expectFieldValueV7(view.getSectionsContainer(), 'January YYYY – MMMM YYYY');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expectFieldValueV7(view.getSectionsContainer(), 'MMMM YYYY – MMMM YYYY');

        view.unmount();

        // Test with v6 input
        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
        });

        const input = getTextbox();
        await view.selectSection('month');

        // Set a value for the "month" section
        await view.user.keyboard('j');
        expectFieldValueV6(input, 'January YYYY – MMMM YYYY');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expectFieldValueV6(input, 'MMMM YYYY – MMMM YYYY');
      });

      it('should not call `onChange` when clearing all sections and both dates are already empty (Backspace)', async () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          onChange: onChangeV7,
        });

        await view.selectSection('month');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(0);

        view.unmount();

        // Test with v6 input
        const onChangeV6 = spy();

        view = renderWithProps({
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          enableAccessibleFieldDOMStructure: false,
          onChange: onChangeV6,
        });

        await view.selectSection('month');

        // Select all sections
        await view.user.keyboard('{Control>}a{/Control}');

        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(0);
      });

      it('should call `onChange` when clearing the first and last section of each date (Backspace)', async () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV7,
        });

        await view.selectSection('month');

        // Start date
        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(1);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(1);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(2);
        expect(onChangeV7.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV7.lastCall.firstArg[1]).toEqualDateTime(
          adapter.addYears(adapter.date(), 1),
        );

        // End date
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(3);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(3);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
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

        await view.selectSection('month');

        // Start date
        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(1);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(1);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(2);
        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV6.lastCall.firstArg[1]).toEqualDateTime(
          adapter.addYears(adapter.date(), 1),
        );

        // End date
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(3);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(3);
        await view.user.keyboard('{ArrowRight}');
        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(4);
        expect(onChangeV6.lastCall.firstArg[0]).to.equal(null);
        expect(onChangeV6.lastCall.firstArg[1]).to.equal(null);
      });

      it('should not call `onChange` if the section is already empty (Backspace)', async () => {
        // Test with v7 input
        const onChangeV7 = spy();

        let view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          defaultValue: [adapter.date(), adapter.addYears(adapter.date(), 1)],
          onChange: onChangeV7,
        });

        await view.selectSection('month');

        await view.user.keyboard('{Backspace}');
        expect(onChangeV7.callCount).to.equal(1);

        await view.user.keyboard('{Backspace}');
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

        await view.selectSection('month');

        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(1);

        await view.user.keyboard('{Backspace}');
        expect(onChangeV6.callCount).to.equal(1);
      });
    },
  );
});

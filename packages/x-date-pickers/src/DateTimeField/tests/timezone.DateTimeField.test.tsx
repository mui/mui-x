import * as React from 'react';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { createPickerRenderer, expectInputValue, getTextbox } from 'test/utils/pickers-utils';

describe('<DateTimeField /> - TimeZone', () => {
  describe('Value time-zone modification - Luxon', () => {
    const { render, adapter } = createPickerRenderer({ clock: 'fake', adapterName: 'luxon' });
    it('should update the field when time zone changes (timestamp remains the same)', () => {
      const { setProps } = render(<DateTimeField />);
      const input = getTextbox();

      const date = adapter.date(new Date('2020-06-18T14:30:10.000Z')).setZone('UTC');
      setProps({ value: date });

      expectInputValue(input, '6/18/2020 02:30 PM');

      setProps({ value: date.setZone('America/Los_Angeles') });

      expectInputValue(input, '6/18/2020 07:30 AM');
    });
  });
});

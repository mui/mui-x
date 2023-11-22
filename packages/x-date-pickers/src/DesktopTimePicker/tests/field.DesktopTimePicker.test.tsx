import * as React from 'react';
import { createPickerRenderer, getTextbox, expectInputPlaceholder } from 'test/utils/pickers';
import { DesktopTimePicker, DesktopTimePickerProps } from '@mui/x-date-pickers/DesktopTimePicker';

describe('<DesktopTimePicker /> - Field', () => {
  const { render } = createPickerRenderer();

  it('should pass the ampm prop to the field', () => {
    const { setProps } = render(<DesktopTimePicker ampm />);

    const input = getTextbox();
    expectInputPlaceholder(input, 'hh:mm aa');

    setProps({ ampm: false });
    expectInputPlaceholder(input, 'hh:mm');
  });

  it('should adapt the default field format based on the props of the picker', () => {
    const testFormat = (props: DesktopTimePickerProps<any>, expectedFormat: string) => {
      const { unmount } = render(<DesktopTimePicker {...props} />);
      const input = getTextbox();
      expectInputPlaceholder(input, expectedFormat);
      unmount();
    };

    testFormat({ views: ['hours'], ampm: false }, 'hh');
    testFormat({ views: ['hours'], ampm: true }, 'hh aa');
    testFormat({ views: ['minutes'] }, 'mm');
    testFormat({ views: ['seconds'] }, 'ss');
    testFormat({ views: ['hours', 'minutes'], ampm: false }, 'hh:mm');
    testFormat({ views: ['hours', 'minutes'], ampm: true }, 'hh:mm aa');
    testFormat({ views: ['minutes', 'seconds'] }, 'mm:ss');
    testFormat({ views: ['hours', 'minutes', 'seconds'], ampm: false }, 'hh:mm:ss');
    testFormat({ views: ['hours', 'minutes', 'seconds'], ampm: true }, 'hh:mm:ss aa');
  });
});

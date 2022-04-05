import * as React from 'react';
import { expect } from 'chai';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createPickerRenderer } from '../../../../test/utils/pickers-utils';

describe('<DatePicker />', () => {
  const { render } = createPickerRenderer();

  describe('prop: inputRef', () => {
    it('should forward ref to the text box', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(
        <DatePicker
          inputRef={inputRef}
          value={null}
          onChange={() => {}}
          renderInput={(params) => <TextField id="test-focusing-picker" {...params} />}
        />,
      );

      expect(inputRef.current).to.have.tagName('input');
    });
  });
});

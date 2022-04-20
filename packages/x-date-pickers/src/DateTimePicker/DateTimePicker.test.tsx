import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { screen } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { createPickerRenderer } from '../../../../test/utils/pickers-utils';

describe('<DateTimePicker />', () => {
  const { render } = createPickerRenderer();

  // TODO: Write tests for responsive pickers. This test should be removed after adding actual tests.
  it('renders without crashing', () => {
    render(
      <DateTimePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        value={null}
      />,
    );
  });

  it('prop `showToolbar` – renders toolbar in DateTimePicker', () => {
    render(
      <DateTimePicker
        open
        showToolbar
        onChange={() => {}}
        value={null}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
  });
});

import * as React from 'react';
import { GridPanel } from '@mui/x-data-grid';

function MyPanel() {
  return (
    <div>
      <GridPanel classes={{ paper: 'paper' }} open modifiers={[{ name: 'flip', enabled: false }]} />
      {/* @ts-expect-error foo classes doesn't exist */}
      <GridPanel classes={{ foo: 'foo' }} />
    </div>
  );
}

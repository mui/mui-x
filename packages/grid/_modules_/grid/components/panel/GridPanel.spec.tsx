import * as React from 'react';
import { GridPanel } from '@material-ui/data-grid';

function MyPanel() {
  return (
    <div>
      <GridPanel
        classes={{ paper: 'paper' }}
        open
        modifiers={{
          flip: {
            enabled: false,
          },
        }}
      />
      <GridPanel classes={{ foo: 'foo' }} />
    </div>
  );
}

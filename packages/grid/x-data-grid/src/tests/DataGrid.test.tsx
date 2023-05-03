import * as React from 'react';
import { createRenderer } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid } from '@mui/x-data-grid';

describe('<DataGrid />', () => {
  const { render } = createRenderer({ clock: 'fake' });

  it('should accept data attributes props', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          rows={[{ name: 'Bob' }]}
          columns={[{ field: 'name' }]}
          data-custom-id="grid-1"
        />
      </div>,
    );

    const grid = document.querySelector('[data-custom-id="grid-1"]')

    expect(grid).not.to.equal(null);
  });
});

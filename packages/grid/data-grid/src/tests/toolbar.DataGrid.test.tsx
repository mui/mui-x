import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
} from 'test/utils/index';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';
import {
  COMFORTABLE_DENSITY_FACTOR,
  COMPACT_DENSITY_FACTOR,
} from 'packages/grid/_modules_/grid/hooks/features/density/useDensity';

describe('<DataGrid /> - Toolbar', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  it('should increase grid density by 50% when selecting compact density', () => {
    const rowHeight = 30;
    const { getByText } = render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} showToolbar rowHeight={rowHeight} />
      </div>,
    );

    fireEvent.click(getByText('Density'));
    fireEvent.click(getByText('Compact'));

    // @ts-expect-error need to migrate helpers to TypeScript
    expect(document.querySelector('.MuiDataGrid-row')).toHaveInlineStyle({
      maxHeight: `${Math.floor(rowHeight * COMPACT_DENSITY_FACTOR)}px`,
    });
  });

  it('should decrease grid density by 50% when selecting comfortable density', () => {
    const rowHeight = 30;
    const { getByText } = render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} showToolbar rowHeight={rowHeight} />
      </div>,
    );

    fireEvent.click(getByText('Density'));
    fireEvent.click(getByText('Comfortable'));

    // @ts-expect-error need to migrate helpers to TypeScript
    expect(document.querySelector('.MuiDataGrid-row')).toHaveInlineStyle({
      maxHeight: `${Math.floor(rowHeight * COMFORTABLE_DENSITY_FACTOR)}px`,
    });
  });
});

import * as React from 'react';
import {
  createClientRenderStrictMode, // @ts-expect-error need to migrate helpers to TypeScript
  ErrorBoundary,
} from 'test/utils';
import { expect } from 'chai';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';

describe('<DataGrid /> - Components', () => {
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

  describe('footer', () => {
    it('should hide footer if prop hideFooter is set', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} hideFooter />
        </div>,
      );
      expect(document.querySelectorAll('.MuiDataGrid-footerContainer').length).to.equal(0);
    });

    it('should hide custom footer if prop hideFooter is set', () => {
      const CustomFooter = () => <div className="customFooter">Custom Footer</div>;
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} hideFooter components={{ Footer: CustomFooter }} />
        </div>,
      );
      expect(document.querySelectorAll('.customFooter').length).to.equal(0);
    });
  });

  it('should throw if a component is used without providing the context', function test() {
    // TODO is this fixed?
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    expect(() => {
      render(
        <ErrorBoundary>
          <GridOverlay />
        </ErrorBoundary>,
      );
      // @ts-expect-error need to migrate helpers to TypeScript
    }).toErrorDev([
      'MUI X: Could not find the data grid context.',
      'The above error occurred in the <ForwardRef(GridOverlay)> component',
    ]);
  });
});

import * as React from 'react';
import { createRenderer, ErrorBoundary } from '@material-ui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { getCell, getRow } from 'test/utils/helperFn';

describe('<DataGrid /> - Components', () => {
  const { render } = createRenderer();

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

  describe('componentsProps', () => {
    it('should pass the props from componentsProps.cell to the cell', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            componentsProps={{ cell: { 'data-name': 'foobar' } }}
          />
        </div>,
      );
      expect(getCell(0, 0)).to.have.attr('data-name', 'foobar');
    });

    it('should pass the props from componentsProps.row to the row', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            componentsProps={{ row: { 'data-name': 'foobar' } }}
          />
        </div>,
      );
      expect(getRow(0)).to.have.attr('data-name', 'foobar');
    });
  });

  describe('components', () => {
    it('should render the cell with the component given in components.Cell', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            components={{
              Cell: ({ rowIndex, colIndex }) => (
                <span role="cell" data-rowindex={rowIndex} data-colindex={colIndex} />
              ),
            }}
          />
        </div>,
      );
      expect(getCell(0, 0).tagName).to.equal('SPAN');
    });

    it('should render the row with the component given in components.Row', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            components={{ Row: ({ index }) => <span role="row" data-rowindex={index} /> }}
          />
        </div>,
      );
      expect(getRow(0).tagName).to.equal('SPAN');
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
      'MUI: Could not find the data grid context.',
      'The above error occurred in the <ForwardRef(GridOverlay)> component',
    ]);
  });
});

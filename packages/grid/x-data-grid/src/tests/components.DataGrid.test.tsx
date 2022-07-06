import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, ErrorBoundary, fireEvent, screen } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { spy } from 'sinon';
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

    it('should pass the props from componentsProps.columnHeaderFilterIconButton to the column header filter icon', () => {
      const onClick = spy();
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            filterModel={{
              items: [{ columnField: 'brand', operatorValue: 'contains', value: 'a' }],
            }}
            disableVirtualization
            componentsProps={{ columnHeaderFilterIconButton: { onClick } }}
          />
        </div>,
      );
      expect(onClick.callCount).to.equal(0);
      const button = screen.queryByRole('button', { name: /show filters/i });
      fireEvent.click(button);
      expect(onClick.lastCall.args[0]).to.have.property('field', 'brand');
      expect(onClick.lastCall.args[1]).to.have.property('target', button);
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
    }).toErrorDev([
      'MUI: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.',
      'The above error occurred in the <ForwardRef(GridOverlay)> component',
    ]);
  });

  // If an infinite loop occurs, this test won't trigger the timeout.
  // Instead, it will be hanging and block other tests.
  // See https://github.com/mochajs/mocha/issues/1609
  it('should not cause an infinite loop with two instances in the same page', () => {
    expect(() => {
      render(
        <div>
          <div style={{ width: 300, height: 500 }}>
            <DataGrid {...baselineProps} hideFooter />
          </div>
          <div style={{ width: 300, height: 500 }}>
            <DataGrid {...baselineProps} hideFooter />
          </div>
        </div>,
      );
    }).not.toErrorDev();
  });
});

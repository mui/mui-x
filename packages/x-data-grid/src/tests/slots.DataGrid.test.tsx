import * as React from 'react';
import { createRenderer, ErrorBoundary, fireEvent, screen } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DataGrid, DataGridProps, GridOverlay } from '@mui/x-data-grid';
import { getCell, getRow } from 'test/utils/helperFn';

describe('<DataGrid /> - Slots', () => {
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
      function CustomFooter() {
        return <div className="customFooter">Custom Footer</div>;
      }
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} hideFooter slots={{ footer: CustomFooter }} />
        </div>,
      );
      expect(document.querySelectorAll('.customFooter').length).to.equal(0);
    });
  });

  describe('slotProps', () => {
    it('should pass the props from slotProps.cell to the cell', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            slotProps={{ cell: { 'data-name': 'foobar' } }}
          />
        </div>,
      );
      expect(getCell(0, 0)).to.have.attr('data-name', 'foobar');
    });

    it('should not override cell dimensions when passing `slotProps.cell.style` to the cell', () => {
      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 500 }}>
            <DataGrid {...baselineProps} {...props} />
          </div>
        );
      }

      const { setProps } = render(<Test slotProps={{ cell: {} }} />);

      const initialCellWidth = getCell(0, 0).getBoundingClientRect().width;

      setProps({ slotProps: { cell: { style: { backgroundColor: 'red' } } } });

      const cell = getCell(0, 0);
      expect(cell).toHaveInlineStyle({ backgroundColor: 'red' });
      expect(cell.getBoundingClientRect().width).to.equal(initialCellWidth);
    });

    it('should pass the props from slotProps.row to the row', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            slotProps={{ row: { 'data-name': 'foobar' } }}
          />
        </div>,
      );
      expect(getRow(0)).to.have.attr('data-name', 'foobar');
    });

    it('should pass the props from slotProps.columnHeaderFilterIconButton to the column header filter icon', () => {
      const onClick = spy();
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            filterModel={{
              items: [{ field: 'brand', operator: 'contains', value: 'a' }],
            }}
            disableVirtualization
            slotProps={{ columnHeaderFilterIconButton: { onClick } }}
          />
        </div>,
      );
      expect(onClick.callCount).to.equal(0);
      const button = screen.getByRole('button', { name: /show filters/i });
      fireEvent.click(button);
      expect(onClick.lastCall.args[0]).to.have.property('field', 'brand');
      expect(onClick.lastCall.args[1]).to.have.property('target', button);
    });
  });

  describe('slots', () => {
    it('should render the cell with the component given in slots.Cell', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            slots={{
              cell: ({ rowIndex, colIndex }) => (
                <span role="gridcell" data-rowindex={rowIndex} data-colindex={colIndex} />
              ),
            }}
          />
        </div>,
      );
      expect(getCell(0, 0).tagName).to.equal('SPAN');
    });

    it('should render the row with the component given in slots.Row', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            hideFooter
            disableVirtualization
            slots={{ row: ({ index }) => <span role="row" data-rowindex={index} /> }}
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
      'MUI X: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.',
      'MUI X: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.',
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

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
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
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
      function Cell({ colIndex }: { colIndex: number }) {
        return <span role="gridcell" data-colindex={colIndex} />;
      }

      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} hideFooter disableVirtualization slots={{ cell: Cell }} />
        </div>,
      );
      expect(getCell(0, 0).tagName).to.equal('SPAN');
    });

    it('should render the row with the component given in slots.Row', () => {
      function Row({ index }: { index: number }) {
        return <span role="row" data-rowindex={index} />;
      }

      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} hideFooter disableVirtualization slots={{ row: Row }} />
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

  describe('should warn if slot is not a React component', () => {
    it('inline arrow function', () => {
      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: () => <div /> }} />
          </div>,
        ),
      ).toWarnDev([
        'MUI X: Slots only accept React components, but `toolbar` slot received a render function.',
      ]);
    });

    it('named arrow function', () => {
      function Test() {
        const myToolbar = () => <div />;

        return (
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: myToolbar }} />
          </div>
        );
      }

      expect(() => render(<Test />)).toWarnDev([
        'MUI X: Slots only accept React components, but `toolbar` slot received a render function.',
      ]);
    });

    it('anonymous function', () => {
      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid
              columns={[]}
              rows={[]}
              slots={{
                // eslint-disable-next-line object-shorthand, func-names
                toolbar: function () {
                  return <div />;
                },
              }}
            />
          </div>,
        ),
      ).toWarnDev([
        'MUI X: Slots only accept React components, but `toolbar` slot received a render function.',
      ]);
    });

    it('named function', () => {
      function Test() {
        function myToolbar() {
          return <div />;
        }

        return (
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: myToolbar }} />
          </div>
        );
      }

      expect(() => render(<Test />)).toWarnDev([
        'MUI X: Slots only accept React components, but `toolbar` slot received a render function.',
      ]);
    });

    it('component factory returning anonymous function', () => {
      function renderToolbar() {
        // eslint-disable-next-line react/function-component-definition
        return () => {
          return <div />;
        };
      }

      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: renderToolbar() }} />
          </div>,
        ),
      ).toWarnDev([
        'MUI X: Slots only accept React components, but `toolbar` slot received a render function.',
      ]);
    });

    it('component factory named function', () => {
      function renderComponent() {
        return function Toolbar() {
          return <div />;
        };
      }

      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: renderComponent() }} />
          </div>,
        ),
      ).toWarnDev([
        'MUI X: Slots only accept React components, but `toolbar` slot received a render function.',
      ]);
    });
  });

  describe('should not warn if slot is a React component', () => {
    it('function component', () => {
      function Toolbar() {
        return <div />;
      }

      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: Toolbar }} />
          </div>,
        ),
      ).not.toWarnDev();
    });

    it('class component', () => {
      // eslint-disable-next-line react/prefer-stateless-function
      class Toolbar extends React.Component {
        render() {
          return <div />;
        }
      }

      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: Toolbar }} />
          </div>,
        ),
      ).not.toWarnDev();
    });

    it('memoized component', () => {
      const Toolbar = React.memo(() => <div />);

      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: Toolbar }} />
          </div>,
        ),
      ).not.toWarnDev();
    });

    it('stable component factory', () => {
      function renderToolbar() {
        // eslint-disable-next-line react/function-component-definition
        return () => {
          return <div />;
        };
      }

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const Toolbar = renderToolbar();

      expect(() =>
        render(
          <div style={{ width: 300, height: 500 }}>
            <DataGrid columns={[]} rows={[]} slots={{ toolbar: Toolbar }} />
          </div>,
        ),
      ).not.toWarnDev();
    });
  });
});

import * as React from 'react';
import { createRenderer, act } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GridApi, useGridApiRef, DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import { ptBR } from '@mui/x-data-grid-pro/locales';
import { grid } from 'test/utils/helperFn';

describe('<DataGridPro /> - Layout', () => {
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
    columns: [{ field: 'brand', width: 100 }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  // Adaptation of describeConformance()
  describe('MUI component API', () => {
    it(`attaches the ref`, () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} ref={ref} />
        </div>,
      );
      expect(ref.current).to.be.instanceof(window.HTMLDivElement);
      expect(ref.current).to.equal(container.firstChild?.firstChild);
    });

    function randomStringValue() {
      return `r${Math.random().toString(36).slice(2)}`;
    }

    it('applies the className to the root component', () => {
      const className = randomStringValue();

      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} className={className} />
        </div>,
      );

      expect(container.firstChild?.firstChild).to.have.class(className);
      expect(container.firstChild?.firstChild).to.have.class('MuiDataGrid-root');
    });

    it('applies the style to the root component', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            {...baselineProps}
            style={{
              mixBlendMode: 'darken',
            }}
          />
        </div>,
      );

      expect(document.querySelector('.MuiDataGrid-root')).toHaveInlineStyle({
        mixBlendMode: 'darken',
      });
    });
  });

  describe('columns width', () => {
    it('should resize flex: 1 column when changing column visibility to avoid exceeding grid width (apiRef setColumnVisibility method call)', () => {
      let apiRef: React.MutableRefObject<GridApi>;

      function TestCase(props: Omit<DataGridProProps, 'apiRef'>) {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 500 }}>
            <DataGridPro {...props} apiRef={apiRef} />
          </div>
        );
      }

      render(
        <TestCase
          rows={[
            {
              id: 1,
              first: 'Mike',
              age: 11,
            },
            {
              id: 2,
              first: 'Jack',
              age: 11,
            },
            {
              id: 3,
              first: 'Mike',
              age: 20,
            },
          ]}
          columns={[
            { field: 'id', flex: 1 },
            { field: 'first', width: 100 },
            { field: 'age', width: 50 },
          ]}
          initialState={{
            columns: {
              columnVisibilityModel: {
                age: false,
              },
            },
          }}
        />,
      );

      let firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
      expect(firstColumn).toHaveInlineStyle({
        width: '198px', // because of the 2px border
      });

      act(() => apiRef!.current.setColumnVisibility('age', true));
      firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
      expect(firstColumn).toHaveInlineStyle({
        width: '148px', // because of the 2px border
      });
    });
  });

  it('should work with `headerFilterHeight` prop', () => {
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          {...baselineProps}
          autoHeight
          headerFilters
          columnHeaderHeight={20}
          headerFilterHeight={32}
          rowHeight={20}
        />
      </div>,
    );
    expect(grid('main')!.clientHeight).to.equal(baselineProps.rows.length * 20 + 20 + 32);
  });

  it('should support translations in the theme', () => {
    render(
      <ThemeProvider theme={createTheme({}, ptBR)}>
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} />
        </div>
      </ThemeProvider>,
    );
    expect(document.querySelector('[title="Ordenar"]')).not.to.equal(null);
  });

  it('should support the sx prop', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      this.skip(); // Doesn't work with mocked window.getComputedStyle
    }

    const theme = createTheme({
      palette: {
        primary: {
          main: 'rgb(0, 0, 255)',
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro columns={[]} rows={[]} sx={{ color: 'primary.main' }} />
        </div>
      </ThemeProvider>,
    );

    expect(grid('root')).toHaveComputedStyle({
      color: 'rgb(0, 0, 255)',
    });
  });

  it('should have ownerState in the theme style overrides', () => {
    expect(() =>
      render(
        <ThemeProvider
          theme={createTheme({
            components: {
              MuiDataGrid: {
                styleOverrides: {
                  root: ({ ownerState }) => ({
                    // test that ownerState is not undefined
                    ...(ownerState.columns && {}),
                  }),
                },
              },
            },
          })}
        >
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro {...baselineProps} />
          </div>
        </ThemeProvider>,
      ),
    ).not.to.throw();
  });
});

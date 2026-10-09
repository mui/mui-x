import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

const enhancedTheme = (components = {}) => enhanceMaterial(createTheme({ components }));

describe('enhanceDensity (pro)', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('adds the header filter height on top of the community heights', () => {
    const input = enhancedTheme();
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(theme.components?.MuiDataGrid?.defaultProps).toEqual({
      rowHeight: 40,
      columnHeaderHeight: 40,
      headerFilterHeight: 40,
    });
  });

  it("lets the theme's own headerFilterHeight win", () => {
    const theme = enhanceDensity(
      enhancedTheme({ MuiDataGrid: { defaultProps: { headerFilterHeight: 36 } } }),
    );
    expect(theme.components?.MuiDataGrid?.defaultProps?.headerFilterHeight).toBe(36);
  });

  it('emits the Pro slots: header filter, reorder, grouping toggles, multi-select', () => {
    const { styleOverrides } = enhanceDensity(enhancedTheme()).components.MuiDataGrid!;
    expect(styleOverrides?.root).toEqual([
      {
        '& .MuiDataGrid-columnHeader--filter': { paddingBlock: '4px', paddingRight: '8px' },
        '& .MuiDataGrid-rowReorderIcon': { fontSize: '16px' },
        '& .MuiDataGrid-multiSelectCell': { gap: '4px' },
        '& .MuiDataGrid-cell[aria-rowspan]:not([aria-rowspan="1"]) .MuiDataGrid-multiSelectCell': {
          paddingTop: '8px',
        },
        '& .MuiDataGrid-editMultiSelectCell': { gap: '4px', paddingInline: '8px' },
      },
    ]);
    expect(styleOverrides?.columnHeaderFilterInput).toEqual([
      { marginRight: '8px', marginBottom: '-4px' },
    ]);
    expect(styleOverrides?.columnHeaderFilterOperatorLabel).toEqual([{ marginRight: '8px' }]);
    expect(styleOverrides?.rowReorderCellContainer).toEqual([{ paddingInline: 0 }]);
    expect(styleOverrides?.treeDataGroupingCellToggle).toEqual([
      { flexBasis: 'calc(32px - 4px)', marginRight: '24px' },
    ]);
    expect(styleOverrides?.groupingCriteriaCellToggle).toEqual(
      styleOverrides?.treeDataGroupingCellToggle,
    );
    expect(styleOverrides?.multiSelectCellPopperContent).toEqual([{ padding: '8px', gap: '4px' }]);
    expect(styleOverrides?.editMultiSelectCellPopperContent).toEqual([
      {
        '& .MuiInputBase-root.MuiInputBase-sizeSmall': { paddingBlock: '4px' },
        '& svg': { fontSize: '16px' },
      },
    ]);
  });

  it('keeps the community slots underneath', () => {
    const { styleOverrides } = enhanceDensity(enhancedTheme()).components.MuiDataGrid!;
    expect(styleOverrides?.cell).toEqual([{ paddingInline: '8px' }]);
  });
});

import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

const enhancedTheme = (components = {}, options = {}) =>
  enhanceMaterial(createTheme({ components, ...options }));

describe('enhanceDensity (pro)', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('adds a header filter height that leaves room for the filter labels', () => {
    const input = enhancedTheme();
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(theme.components?.MuiDataGrid?.defaultProps).toEqual({
      rowHeight: 40,
      columnHeaderHeight: 40,
      checkboxColDef: { width: 40, minWidth: 40 },
      headerFilterHeight: 56,
    });
    const low = enhanceDensity(
      enhanceMaterial(createTheme(), { touchTarget: 44, spacing: { xSmall: 12 } }),
    );
    expect(low.components?.MuiDataGrid?.defaultProps?.headerFilterHeight).toBe(68);
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
        '--DataGrid-cellOffsetMultiplier': 2,
        '& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--filter': {
          paddingBlock: '4px',
          paddingRight: 'calc(8px + (16px - calc(32px - 4px)) / 2)',
          minHeight: 0,
          '& .MuiIconButton-root': {
            minWidth: 0,
            minHeight: 0,
            marginBlock: 0,
            height: 'min(100%, calc(32px - 4px))',
            aspectRatio: 1,
          },
        },
        '& .MuiDataGrid-cell[aria-rowspan]:not([aria-rowspan="1"]) .MuiDataGrid-multiSelectCell': {
          paddingTop: '8px',
        },
        '& .MuiDataGrid-editMultiSelectCell': { paddingInline: '8px' },
      },
    ]);
    expect((styleOverrides as Record<string, unknown>).multiSelectChips).toEqual([{ gap: '4px' }]);
    expect(styleOverrides?.columnHeaderFilterInput).toEqual([
      { marginRight: '4px', marginBottom: '-4px' },
    ]);
    expect(styleOverrides?.columnHeaderFilterOperatorLabel).toEqual([{ marginRight: '4px' }]);
    expect(styleOverrides?.rowReorderCellContainer).toEqual([{ paddingInline: 0 }]);
    expect(styleOverrides?.treeDataGroupingCellToggle).toEqual([
      { flexBasis: 'calc(32px - 4px)', marginRight: '16px' },
    ]);
    expect(styleOverrides?.groupingCriteriaCellToggle).toEqual(
      styleOverrides?.treeDataGroupingCellToggle,
    );
    expect(styleOverrides?.multiSelectCellPopperContent).toEqual([
      { padding: '8px', gap: '4px', marginLeft: 'calc(10px - 8px)' },
    ]);
    expect(styleOverrides?.editMultiSelectCellPopperContent).toEqual([
      {
        '& .MuiInputBase-root.MuiInputBase-sizeSmall': { paddingBlock: '4px' },
        '& .MuiAutocomplete-root .MuiAutocomplete-tag': { '--_height': 'calc(32px - 4px)' },
        '& .MuiAutocomplete-root .MuiAutocomplete-inputRoot.MuiInputBase-sizeSmall': {
          '--_tagHeight': 'calc(32px - 4px)',
        },
      },
    ]);
  });

  it('keeps the community slots underneath', () => {
    const { styleOverrides } = enhanceDensity(enhancedTheme()).components.MuiDataGrid!;
    expect(styleOverrides?.cell).toEqual([
      { paddingInline: '8px', '&.MuiDataGrid-cell--editing': { padding: 1 } },
    ]);
  });

  it('indents one grouping depth by the medium step on any spacing unit', () => {
    const root = (spacing?: number) =>
      enhanceDensity(enhancedTheme({}, spacing ? { spacing } : {})).components.MuiDataGrid!
        .styleOverrides!.root as Array<Record<string, unknown>>;
    expect(root()[0]['--DataGrid-cellOffsetMultiplier']).toBe(2);
    expect(root(4)[0]['--DataGrid-cellOffsetMultiplier']).toBe(4);
    const vars = enhanceDensity(enhancedTheme({}, { cssVariables: true })).components.MuiDataGrid!
      .styleOverrides!.root as Array<Record<string, unknown>>;
    expect(vars[0]['--DataGrid-cellOffsetMultiplier']).toBe(2);
  });
});

import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

// Built through material's own enhancer (the pinned PR build): it writes the
// `unstable_densityScale` contract and installs the keyed `theme.spacing`.
const enhancedTheme = (components = {}, options = {}) =>
  enhanceMaterial(createTheme({ components, ...options }));

describe('enhanceDensity', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('derives the grid heights from touchTarget + 2 * xxSmall as defaultProps', () => {
    const theme = enhanceDensity(enhancedTheme());
    expect(theme.components?.MuiDataGrid?.defaultProps).toEqual({
      rowHeight: 40,
      columnHeaderHeight: 40,
    });
  });

  it('emits the cell inline inset as the xSmall step, var ref on a vars theme', () => {
    const plain = enhanceDensity(enhancedTheme());
    expect(plain.components.MuiDataGrid?.styleOverrides?.cell).toEqual([{ paddingInline: '8px' }]);

    const vars = enhanceDensity(enhancedTheme({}, { cssVariables: true }));
    expect(vars.components.MuiDataGrid?.styleOverrides?.cell).toEqual([
      { paddingInline: 'var(--mui-spacing-xSmall, 8px)' },
    ]);
  });

  it('emits the toolbar bar off the touch target, var refs on a vars theme', () => {
    const plain = enhanceDensity(enhancedTheme());
    expect(plain.components.MuiDataGrid?.styleOverrides?.toolbar).toEqual([
      {
        minHeight: 'calc(32px + 2 * 8px)',
        padding: '8px',
        gap: '4px',
        '& svg': { fontSize: '16px' },
      },
    ]);

    const vars = enhanceDensity(enhancedTheme({}, { cssVariables: true }));
    expect(vars.components.MuiDataGrid?.styleOverrides?.toolbar).toEqual([
      {
        minHeight: 'calc(var(--mui-touchTarget, 32px) + 2 * var(--mui-spacing-xSmall, 8px))',
        padding: 'var(--mui-spacing-xSmall, 8px)',
        gap: 'var(--mui-spacing-xxSmall, 4px)',
        '& svg': { fontSize: 'var(--mui-iconSize, 16px)' },
      },
    ]);
  });

  it('restates the quick filter trigger box off the touch target', () => {
    const plain = enhanceDensity(enhancedTheme());
    expect(plain.components.MuiDataGrid?.styleOverrides?.toolbarQuickFilterTrigger).toEqual([
      { width: '32px', height: '32px' },
    ]);
    const vars = enhanceDensity(enhancedTheme({}, { cssVariables: true }));
    expect(vars.components.MuiDataGrid?.styleOverrides?.toolbarQuickFilterTrigger).toEqual([
      { width: 'var(--mui-touchTarget, 32px)', height: 'var(--mui-touchTarget, 32px)' },
    ]);
  });

  it('emits the columns management panel insets and the toolbar divider/label pulls', () => {
    const { styleOverrides } = enhanceDensity(enhancedTheme()).components.MuiDataGrid!;
    expect(styleOverrides?.toolbarDivider).toEqual([{ marginInline: '8px' }]);
    expect(styleOverrides?.toolbarLabel).toEqual([{ marginInline: '8px' }]);
    expect(styleOverrides?.columnsManagement).toEqual([
      { padding: '8px 16px', '& .MuiFormControlLabel-root': { gap: '8px' } },
    ]);
    const searchField = {
      '& svg': { fontSize: '16px' },
      '& .MuiInputAdornment-positionEnd .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd': {
        marginRight: 'calc(32px / -4)',
      },
    };
    expect(styleOverrides?.toolbarQuickFilterControl).toEqual([searchField]);
    expect(styleOverrides?.columnsManagementHeader).toEqual([
      { padding: '16px 24px', ...searchField },
    ]);
    expect(styleOverrides?.columnsManagementFooter).toEqual([{ padding: '12px 12px 12px 16px' }]);
    expect(styleOverrides?.columnsManagementEmptyText).toEqual([{ paddingBlock: '12px' }]);
  });

  it('emits the header insets, menu pull, and the cell glyph/inset rules', () => {
    const { styleOverrides } = enhanceDensity(enhancedTheme()).components.MuiDataGrid!;
    expect(styleOverrides?.columnHeader).toEqual([{ paddingInline: '8px' }]);
    expect(styleOverrides?.columnHeaderTitleContainer).toEqual([{ gap: '4px' }]);
    expect(styleOverrides?.menuIcon).toEqual([{ marginRight: 'calc((32px - 4px - 16px) / -2)' }]);
    expect(styleOverrides?.['columnHeader--alignRight']).toEqual([
      { '& .MuiDataGrid-menuIcon': { marginLeft: 'calc((32px - 4px - 16px) / -2)' } },
    ]);
    expect(styleOverrides?.booleanCell).toEqual([{ fontSize: '16px' }]);
    expect(styleOverrides?.actionsCell).toEqual([
      { gridGap: '12px', '& svg': { fontSize: '16px' } },
    ]);
    expect(styleOverrides?.editInputCell).toEqual([
      { '& input': { paddingInline: '8px' }, '& svg': { fontSize: '16px' } },
    ]);
    const popupInset = {
      paddingInline: 'calc(8px - 1px)',
      paddingBlock: 'calc((32px + 2 * 4px - 1px - 1lh) / 2)',
    };
    expect(styleOverrides?.editLongTextCellValue).toEqual([{ paddingInline: '8px' }]);
    expect(styleOverrides?.editLongTextCellPopperContent).toEqual([popupInset]);
    expect(styleOverrides?.longTextCellPopperContent).toEqual([popupInset]);
  });

  it('emits the filter panel insets', () => {
    const { styleOverrides } = enhanceDensity(enhancedTheme()).components.MuiDataGrid!;
    expect(styleOverrides?.panel).toEqual([
      { '& .MuiDataGrid-panelContent': { padding: '16px 12px 24px 24px', gap: '16px' } },
    ]);
    expect(styleOverrides?.panelFooter).toEqual([{ padding: '16px' }]);
    expect(styleOverrides?.filterForm).toEqual([
      { gap: '16px', '& .MuiDataGrid-filterFormDeleteIcon svg': { fontSize: '16px' } },
    ]);
  });

  it("lets the theme's own styleOverrides win", () => {
    const theme = enhanceDensity(
      enhancedTheme({ MuiDataGrid: { styleOverrides: { cell: { paddingInline: 4 } } } }),
    );
    expect(theme.components.MuiDataGrid?.styleOverrides?.cell).toEqual([
      { paddingInline: '8px' },
      { paddingInline: 4 },
    ]);
  });

  it("lets the theme's own defaultProps win", () => {
    const theme = enhanceDensity(
      enhancedTheme({ MuiDataGrid: { defaultProps: { rowHeight: 30, density: 'compact' } } }),
    );
    expect(theme.components?.MuiDataGrid?.defaultProps).toEqual({
      rowHeight: 30,
      columnHeaderHeight: 40,
      density: 'compact',
    });
  });

  it('does not mutate the input theme', () => {
    const input = enhancedTheme();
    const before = JSON.stringify(input.components);
    const output = enhanceDensity(input);
    expect(output).not.toBe(input);
    expect(JSON.stringify(input.components)).toBe(before);
  });
});

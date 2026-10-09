import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

describe('enhanceDensity (premium)', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('applies the pro and community enhancers underneath', () => {
    const input = enhanceMaterial(createTheme());
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(theme.components?.MuiDataGrid?.defaultProps).toEqual({
      rowHeight: 40,
      columnHeaderHeight: 40,
      headerFilterHeight: 40,
    });
  });

  it('emits the Premium panel slots', () => {
    const { styleOverrides } = enhanceDensity(enhanceMaterial(createTheme())).components
      .MuiDataGrid!;
    const glyph = { '& svg': { fontSize: '16px' } };
    expect(styleOverrides?.pivotPanelHeader).toEqual([
      { height: 'calc(32px + 16px)', gap: '12px', padding: '0 8px 0 12px', ...glyph },
    ]);
    expect(styleOverrides?.pivotPanelSearchContainer).toEqual([
      {
        padding: '0 12px 12px',
        ...glyph,
        '& .MuiInputAdornment-positionEnd .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd': {
          marginRight: 'calc(32px / -4)',
        },
      },
    ]);
    expect(styleOverrides?.pivotPanelField).toEqual([
      {
        height: '32px',
        padding: '0 12px 0 24px',
        gap: '8px',
        marginInlineStart: '8px',
        ...glyph,
      },
    ]);
    expect(styleOverrides?.pivotPanelFieldDragIcon).toEqual([{ width: '16px' }]);
    expect(styleOverrides?.pivotPanelFieldCheckbox).toEqual([{ marginLeft: '-12px' }]);
    expect(styleOverrides?.pivotPanelPlaceholder).toEqual([
      { minHeight: 'calc(32px + 4px)', paddingInline: '12px' },
    ]);
    expect(styleOverrides?.aiAssistantPanelHeader).toEqual([
      { height: 'calc(32px + 16px)', padding: '0 8px 0 24px', ...glyph },
    ]);
    expect(styleOverrides?.aiAssistantPanelSuggestionsList).toEqual([
      { gap: '8px', padding: '12px', margin: '-12px' },
    ]);
    expect(styleOverrides?.prompt).toEqual([{ padding: '12px 12px', ...glyph }]);
    expect(styleOverrides?.promptIconContainer).toEqual([
      { width: 'calc(32px + 4px)', height: 'calc(32px + 4px)', marginRight: '16px' },
    ]);
    expect(styleOverrides?.collapsibleTrigger).toEqual([
      { height: 'calc(32px + 2 * 4px)', paddingInline: '16px' },
    ]);
    expect(styleOverrides?.formulaBar).toEqual([
      { minHeight: 'calc(32px + 2 * 4px)', paddingInline: '8px', gap: '12px' },
    ]);
    expect(styleOverrides?.formulaColumnHeaderLetter).toEqual([{ marginInlineEnd: '8px' }]);
    // Pro and community emissions sit underneath.
    expect(styleOverrides?.columnHeaderFilterInput).toBeDefined();
    expect(styleOverrides?.cell).toEqual([{ paddingInline: '8px' }]);
  });
});

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
      { height: 'calc(32px + 16px)', gap: '8px', padding: '0 8px', ...glyph },
    ]);
    expect(styleOverrides?.pivotPanelSearchContainer).toEqual([
      {
        padding: '0 8px 8px',
        ...glyph,
        '& .MuiInputAdornment-positionEnd .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd': {
          marginRight: 'calc(32px / -4)',
        },
      },
    ]);
    expect(styleOverrides?.pivotPanelField).toEqual([
      {
        height: '32px',
        padding: '0 8px 0 16px',
        gap: '4px',
        marginInlineStart: '8px',
        ...glyph,
      },
    ]);
    expect(styleOverrides?.pivotPanelFieldDragIcon).toEqual([{ width: '16px' }]);
    expect(styleOverrides?.pivotPanelFieldCheckbox).toEqual([{ marginLeft: '-8px' }]);
    expect(styleOverrides?.pivotPanelPlaceholder).toEqual([
      { minHeight: '32px', paddingInline: '8px' },
    ]);
    expect(styleOverrides?.aiAssistantPanelHeader).toEqual([
      { height: 'calc(32px + 16px)', padding: '0 8px 0 16px', ...glyph },
    ]);
    expect(styleOverrides?.aiAssistantPanelSuggestionsList).toEqual([
      { gap: '8px', padding: '8px', margin: '-8px' },
    ]);
    expect(styleOverrides?.prompt).toEqual([{ padding: '8px 12px', ...glyph }]);
    expect(styleOverrides?.promptIconContainer).toEqual([
      { width: 'calc(32px + 4px)', height: 'calc(32px + 4px)', marginRight: '12px' },
    ]);
    expect(styleOverrides?.collapsibleTrigger).toEqual([{ height: '32px', paddingInline: '12px' }]);
    expect(styleOverrides?.formulaBar).toEqual([
      { minHeight: '32px', paddingInline: '8px', gap: '8px' },
    ]);
    expect(styleOverrides?.formulaColumnHeaderLetter).toEqual([{ marginInlineEnd: '8px' }]);
    // Pro and community emissions sit underneath.
    expect(styleOverrides?.columnHeaderFilterInput).toBeDefined();
    expect(styleOverrides?.cell).toEqual([{ paddingInline: '8px' }]);
  });
});

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
      checkboxColDef: { width: 40, minWidth: 40 },
      headerFilterHeight: 56,
    });
  });

  it('emits the Premium panel slots', () => {
    const { styleOverrides } = enhanceDensity(enhanceMaterial(createTheme())).components
      .MuiDataGrid!;
    const searchField = {
      '& .MuiInputAdornment-positionEnd .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd': {
        marginRight: 'calc((16px - 32px + 4px) / 2)',
      },
    };
    expect(styleOverrides?.pivotPanelSwitch).toEqual([
      { '&.MuiDataGrid-pivotPanelSwitch': { gap: '4px', margin: 0, marginRight: 'auto' } },
    ]);
    expect(styleOverrides?.pivotPanelHeader).toEqual([
      { height: 'calc(32px + 16px)', gap: '8px', padding: '0 8px' },
    ]);
    expect(styleOverrides?.pivotPanelSearchContainer).toEqual([
      { padding: '0 8px 8px', ...searchField },
    ]);
    expect(styleOverrides?.pivotPanelField).toEqual([
      {
        height: '32px',
        padding: '0 8px 0 16px',
        gap: '4px',
        marginInlineStart: '8px',
        '& .MuiFormControlLabel-root': { gap: '4px' },
      },
    ]);
    expect(styleOverrides?.pivotPanelFieldDragIcon).toEqual([{ width: '16px' }]);
    expect(styleOverrides?.pivotPanelFieldCheckbox).toEqual([{ marginLeft: '-8px' }]);
    expect(styleOverrides?.pivotPanelPlaceholder).toEqual([
      { minHeight: '32px', paddingInline: '8px' },
    ]);
    expect(styleOverrides?.aiAssistantPanelHeader).toEqual([
      { height: 'calc(32px + 16px)', padding: '0 8px 0 16px' },
    ]);
    expect(styleOverrides?.aiAssistantPanelSuggestionsList).toEqual([
      { gap: '8px', padding: '8px', margin: '-8px' },
    ]);
    expect(styleOverrides?.prompt).toEqual([{ padding: '8px 12px' }]);
    expect(styleOverrides?.promptChangesToggle).toEqual([
      {
        gap: '4px',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          insetInline: 0,
          top: '50%',
          height: 'max(100%, 24px)',
          transform: 'translateY(-50%)',
        },
      },
    ]);
    expect(styleOverrides?.promptIconContainer).toEqual([
      { width: 'calc(32px + 4px)', height: 'calc(32px + 4px)', marginRight: '12px' },
    ]);
    expect(styleOverrides?.collapsibleTrigger).toEqual([{ height: '32px', paddingInline: '12px' }]);
    expect(styleOverrides?.formulaBar).toEqual([
      { minHeight: '32px', paddingInline: '8px', gap: '8px' },
    ]);
    expect(styleOverrides?.formulaColumnHeaderLetter).toEqual([{ marginInlineEnd: '8px' }]);
    expect(styleOverrides?.computedColumnHeaderBadge).toEqual([{ marginInlineEnd: '8px' }]);
    expect(styleOverrides?.computedColumnsPanel).toEqual([searchField]);
    expect(styleOverrides?.computedColumnsPanelHeader).toEqual([
      { height: 'calc(32px + 16px)', gap: '8px', padding: '0 8px 0 12px' },
    ]);
    expect(styleOverrides?.computedColumnsPanelListItem).toEqual([
      { gap: '4px', padding: '0 8px 0 4px' },
    ]);
    expect(styleOverrides?.computedColumnsPanelEmpty).toEqual([{ padding: '16px' }]);
    expect(styleOverrides?.computedColumnsPanelField).toEqual([{ gap: '8px' }]);
    expect(styleOverrides?.computedColumnsPanelFormula).toEqual([{ paddingBlock: '8px' }]);
    expect(styleOverrides?.computedColumnsPanelPreview).toEqual([
      { gap: '4px', padding: '8px 12px' },
    ]);
    expect(styleOverrides?.computedColumnsPanelValidation).toEqual([{ paddingLeft: '16px' }]);
    expect(styleOverrides?.computedColumnsPanelFooter).toEqual([{ gap: '8px', padding: '12px' }]);
    // Pro and community emissions sit underneath.
    expect(styleOverrides?.columnHeaderFilterInput).toBeDefined();
    expect(styleOverrides?.cell).toEqual([
      { paddingInline: '8px', '&.MuiDataGrid-cell--editing': { padding: 1 } },
    ]);
    expect(styleOverrides?.aiAssistantPanelFooter).toEqual([
      { gap: '8px', padding: '8px', ...searchField },
    ]);
  });

  it('emits the charts panel and computed columns parts that have no class key', () => {
    const styleOverrides = enhanceDensity(enhanceMaterial(createTheme())).components.MuiDataGrid!
      .styleOverrides as Record<string, unknown>;
    const searchField = {
      '& .MuiInputAdornment-positionEnd .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd': {
        marginRight: 'calc((16px - 32px + 4px) / 2)',
      },
    };
    expect(styleOverrides.chartsPanelHeader).toEqual([
      { gap: 'calc(4px / 2)', padding: '8px 4px 0 calc(4px * 1.5)' },
    ]);
    expect(styleOverrides.chartsPanelTitle).toEqual([{ marginLeft: '4px' }]);
    expect(styleOverrides.chartsPanelChartSelection).toEqual([
      { gap: 'calc(4px / 2)', padding: 'calc(4px * 1.5) 4px' },
    ]);
    expect(styleOverrides.chartTypeRoot).toEqual([{ gap: '8px', padding: '8px' }]);
    expect(styleOverrides.chartTypeSelectorButton).toEqual([
      { gap: '4px', padding: '12px 8px 8px' },
    ]);
    expect(styleOverrides.chartsPanelDataSearchContainer).toEqual([
      { padding: '8px', ...searchField },
    ]);
    expect(styleOverrides.chartsPanelDataSection).toEqual([{ margin: '4px 8px' }]);
    expect(styleOverrides.chartsPanelDataSectionTitle).toEqual([
      { marginRight: '12px', gap: '8px' },
    ]);
    expect(styleOverrides.chartsPanelDataFieldList).toEqual([{ paddingBlock: '4px' }]);
    expect(styleOverrides.chartsPanelDataPlaceholder).toEqual([
      { minHeight: '32px', paddingInline: '8px' },
    ]);
    expect(styleOverrides.chartsPanelDataField).toEqual([
      {
        height: '32px',
        padding: '0 8px 0 16px',
        gap: '4px',
        '& .MuiFormControlLabel-root': { gap: '4px' },
      },
    ]);
    expect(styleOverrides.chartsPanelDataFieldDragIcon).toEqual([{ width: '16px' }]);
    expect(styleOverrides.chartsPanelDataFieldCheckbox).toEqual([{ marginLeft: '-8px' }]);
    expect(styleOverrides.chartsPanelCustomizeSection).toEqual([{ margin: '4px 8px' }]);
    expect(styleOverrides.chartsPanelSection).toEqual([
      {
        padding: '16px 12px',
        gap: '24px',
        '& .MuiFormControlLabel-root': { gap: '4px', margin: 0 },
      },
    ]);
    expect(styleOverrides.computedColumnsPanelListItems).toEqual([{ paddingBlock: '8px' }]);
    expect(styleOverrides.computedColumnsPanelListItemButton).toEqual([
      { gap: '8px', padding: 'calc(4px * 1.5) 8px' },
    ]);
    expect(styleOverrides.computedColumnsPanelListItemText).toEqual([{ gap: 'calc(4px / 2)' }]);
    expect(styleOverrides.computedColumnsPanelListFooter).toEqual([{ padding: '12px' }]);
    expect(styleOverrides.computedColumnsPanelEditorBody).toEqual([
      {
        gap: '16px',
        padding: '16px 12px',
        '& .MuiFormControlLabel-root': { gap: '4px', margin: 0 },
      },
    ]);
    expect(styleOverrides.computedColumnsPanelFieldRow).toEqual([{ gap: '8px' }]);
    expect(styleOverrides.computedColumnsPanelReferenceSearch).toEqual([
      { padding: '8px 8px 4px', ...searchField },
    ]);
    expect(styleOverrides.computedColumnsPanelReferenceLists).toEqual([{ paddingBottom: '4px' }]);
    expect(styleOverrides.computedColumnsPanelReferenceGroupTitle).toEqual([
      { padding: 'calc(4px * 1.5) 12px calc(4px / 2)' },
    ]);
    expect(styleOverrides.computedColumnsPanelReferenceItem).toEqual([
      { gap: '8px', padding: '4px 12px' },
    ]);
    expect(styleOverrides.computedColumnsPanelReferenceNoResults).toEqual([
      { padding: '8px 12px' },
    ]);
  });
});

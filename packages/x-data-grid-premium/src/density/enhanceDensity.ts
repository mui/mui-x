import type { Theme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
import { unstable_enhanceDensity as enhanceProDensity } from '@mui/x-data-grid-pro/density';
import type { DensityEnhancedTheme } from '@mui/x-data-grid-pro/density';
import { getDensitySizing } from '@mui/x-data-grid/internals';
import { addRootOverride } from '@mui/x-internals/densityTheme';

/**
 * Make the Data Grid Premium density-aware: the Pro enhancer first (which runs
 * the community one), then the Premium-only slots and props on top.
 *
 * The Pro enhancer returns a fresh theme with a fresh `components` object, so
 * this tier writes into it instead of copying the theme again.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const enhanced = enhanceProDensity(theme);
  const { spacing } = theme;
  const { touchTarget, iconSize } = getDensitySizing(theme);
  const { components } = enhanced;

  // The same bar the toolbar and footer ride; the row-high controls; the
  // glyph rule for the panels' `fontSize="small"` icons.
  const bar = `calc(${touchTarget} + ${spacing('medium')})`;
  const rowBox = `calc(${touchTarget} + 2 * ${spacing('xxSmall')})`;
  const glyph = { '& svg': { fontSize: iconSize } };
  // Search fields: clear button pull restated above the grid's internal
  // adornment rule (same as the community columns panel).
  const searchField = {
    ...glyph,
    [`& .${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}.${iconButtonClasses.edgeEnd}`]:
      { marginRight: `calc(${touchTarget} / -4)` },
  };

  // Pivot panel (sidebar).
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      height: bar,
      gap: spacing('small'),
      padding: `0 ${spacing('xSmall')} 0 ${spacing('small')}`,
      ...glyph,
    },
    'pivotPanelHeader',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { padding: `0 ${spacing('small')} ${spacing('small')}`, ...searchField },
    'pivotPanelSearchContainer',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { margin: `${spacing('xSmall')} ${spacing('small')}` },
    'pivotPanelSection',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginRight: spacing('medium'), gap: spacing('small') },
    'pivotPanelSectionTitle',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { paddingBlock: spacing('xSmall') },
    'pivotPanelFieldList',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { minHeight: `calc(${touchTarget} + ${spacing('xxSmall')})`, paddingInline: spacing('small') },
    'pivotPanelPlaceholder',
  );
  // Field row: the interactive box high; `marginInlineStart` pulls the row off
  // the sidebar edge so the hover drag handle gets room.
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      height: touchTarget,
      padding: `0 ${spacing('small')} 0 ${spacing('large')}`,
      gap: spacing('xSmall'),
      marginInlineStart: spacing('xSmall'),
      ...glyph,
    },
    'pivotPanelField',
  );
  addRootOverride(components, 'MuiDataGrid', { width: iconSize }, 'pivotPanelFieldDragIcon');
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginLeft: spacing('-small') },
    'pivotPanelFieldCheckbox',
  );

  // AI assistant panel.
  addRootOverride(
    components,
    'MuiDataGrid',
    { height: bar, padding: `0 ${spacing('xSmall')} 0 ${spacing('large')}`, ...glyph },
    'aiAssistantPanelHeader',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginTop: spacing('xxSmall') },
    'aiAssistantPanelTitle',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginTop: spacing('-xxSmall') },
    'aiAssistantPanelConversationTitle',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('small'), padding: spacing('small') },
    'aiAssistantPanelFooter',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('xSmall') },
    'aiAssistantPanelSuggestions',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('xSmall'), padding: spacing('small'), margin: spacing('-small') },
    'aiAssistantPanelSuggestionsList',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('small'), paddingLeft: spacing('xSmall') },
    'aiAssistantPanelSuggestionsLabel',
  );
  // Prompt entries in the conversation.
  addRootOverride(
    components,
    'MuiDataGrid',
    { padding: `${spacing('small')} ${spacing('small')}`, ...glyph },
    'prompt',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      width: `calc(${touchTarget} + ${spacing('xxSmall')})`,
      height: `calc(${touchTarget} + ${spacing('xxSmall')})`,
      marginRight: spacing('medium'),
    },
    'promptIconContainer',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('xSmall'), marginTop: spacing('small') },
    'promptChangeList',
  );
  addRootOverride(components, 'MuiDataGrid', { gap: spacing('xxSmall') }, 'promptChangesToggle');

  // Collapsible sections (sidebar) and the formula bar: row-high.
  addRootOverride(
    components,
    'MuiDataGrid',
    { height: rowBox, paddingInline: spacing('medium') },
    'collapsibleTrigger',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { minHeight: rowBox, paddingInline: spacing('xSmall'), gap: spacing('small') },
    'formulaBar',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginInlineEnd: spacing('xSmall') },
    'formulaColumnHeaderLetter',
  );
  return enhanced;
}

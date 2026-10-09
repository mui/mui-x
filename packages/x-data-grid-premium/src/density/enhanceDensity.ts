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
      gap: spacing('xSmall'),
      padding: `0 ${spacing('xSmall')}`,
      ...glyph,
    },
    'pivotPanelHeader',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { padding: `0 ${spacing('xSmall')} ${spacing('xSmall')}`, ...searchField },
    'pivotPanelSearchContainer',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { margin: `${spacing('xxSmall')} ${spacing('xSmall')}` },
    'pivotPanelSection',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginRight: spacing('small'), gap: spacing('xSmall') },
    'pivotPanelSectionTitle',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { paddingBlock: spacing('xxSmall') },
    'pivotPanelFieldList',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { minHeight: touchTarget, paddingInline: spacing('xSmall') },
    'pivotPanelPlaceholder',
  );
  // Field row: the interactive box high; `marginInlineStart` pulls the row off
  // the sidebar edge so the hover drag handle gets room.
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      height: touchTarget,
      padding: `0 ${spacing('xSmall')} 0 ${spacing('medium')}`,
      gap: spacing('xxSmall'),
      marginInlineStart: spacing('xSmall'),
      ...glyph,
    },
    'pivotPanelField',
  );
  addRootOverride(components, 'MuiDataGrid', { width: iconSize }, 'pivotPanelFieldDragIcon');
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginLeft: spacing('-xSmall') },
    'pivotPanelFieldCheckbox',
  );

  // AI assistant panel.
  addRootOverride(
    components,
    'MuiDataGrid',
    { height: bar, padding: `0 ${spacing('xSmall')} 0 ${spacing('medium')}`, ...glyph },
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
    { gap: spacing('xSmall'), padding: spacing('xSmall') },
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
    { gap: spacing('xSmall'), padding: spacing('xSmall'), margin: spacing('-xSmall') },
    'aiAssistantPanelSuggestionsList',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('xSmall'), paddingLeft: spacing('xxSmall') },
    'aiAssistantPanelSuggestionsLabel',
  );
  // Prompt entries in the conversation.
  addRootOverride(
    components,
    'MuiDataGrid',
    { padding: `${spacing('xSmall')} ${spacing('small')}`, ...glyph },
    'prompt',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      width: `calc(${touchTarget} + ${spacing('xxSmall')})`,
      height: `calc(${touchTarget} + ${spacing('xxSmall')})`,
      marginRight: spacing('small'),
    },
    'promptIconContainer',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('xxSmall'), marginTop: spacing('xSmall') },
    'promptChangeList',
  );
  addRootOverride(components, 'MuiDataGrid', { gap: spacing('xxSmall') }, 'promptChangesToggle');

  // Actionable rows (collapsible trigger, formula bar): the interactive box
  // high, inline inset only.
  addRootOverride(
    components,
    'MuiDataGrid',
    { height: touchTarget, paddingInline: spacing('small') },
    'collapsibleTrigger',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { minHeight: touchTarget, paddingInline: spacing('xSmall'), gap: spacing('xSmall') },
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

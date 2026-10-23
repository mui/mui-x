import type { Theme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
import { unstable_enhanceDensity as enhanceProDensity } from '@mui/x-data-grid-pro/density';
import type { DensityEnhancedTheme } from '@mui/x-data-grid-pro/density';
import { getDensitySizing } from '@mui/x-data-grid/internals';
import { addStyleOverride } from '@mui/x-internals/densityTheme';

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

  // The same bar the toolbar and footer ride.
  const bar = `calc(${touchTarget} + ${spacing('medium')})`;
  // The grid hardcodes `fontSize="small"` on its icons with no prop to change it;
  // material's enhancer maps that variant to `iconSize - 2px`, but the grid's
  // default glyph is the icon constant itself, so the owning slot restates it.
  const glyph = { '& svg': { fontSize: iconSize } };
  // Search fields: clear button pull restated above the grid's internal
  // adornment rule (same as the community columns panel).
  const searchField = {
    ...glyph,
    [`& .${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}.${iconButtonClasses.edgeEnd}`]:
      { marginRight: `calc(${touchTarget} / -4)` },
  };

  // Pivot panel (sidebar).
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelHeader', {
    height: bar,
    gap: spacing('xSmall'),
    padding: `0 ${spacing('xSmall')}`,
    ...glyph,
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelSearchContainer', {
    padding: `0 ${spacing('xSmall')} ${spacing('xSmall')}`,
    ...searchField,
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelSection', {
    margin: `${spacing('xxSmall')} ${spacing('xSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelSectionTitle', {
    marginRight: spacing('small'),
    gap: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelFieldList', {
    paddingBlock: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelPlaceholder', {
    minHeight: touchTarget,
    paddingInline: spacing('xSmall'),
  });
  // Field row: the interactive box high; `marginInlineStart` pulls the row off
  // the sidebar edge so the hover drag handle gets room.
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelField', {
    height: touchTarget,
    padding: `0 ${spacing('xSmall')} 0 ${spacing('medium')}`,
    gap: spacing('xxSmall'),
    marginInlineStart: spacing('xSmall'),
    ...glyph,
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelFieldDragIcon', { width: iconSize });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelFieldCheckbox', {
    marginLeft: spacing('-xSmall'),
  });

  // AI assistant panel.
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelHeader', {
    height: bar,
    padding: `0 ${spacing('xSmall')} 0 ${spacing('medium')}`,
    ...glyph,
  });
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelTitle', {
    marginTop: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelConversationTitle', {
    marginTop: spacing('-xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelFooter', {
    gap: spacing('xSmall'),
    padding: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelSuggestions', {
    gap: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelSuggestionsList', {
    gap: spacing('xSmall'),
    padding: spacing('xSmall'),
    margin: spacing('-xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelSuggestionsLabel', {
    gap: spacing('xSmall'),
    paddingLeft: spacing('xxSmall'),
  });
  // Prompt entries in the conversation.
  addStyleOverride(components, 'MuiDataGrid', 'prompt', {
    padding: `${spacing('xSmall')} ${spacing('small')}`,
    ...glyph,
  });
  addStyleOverride(components, 'MuiDataGrid', 'promptIconContainer', {
    width: `calc(${touchTarget} + ${spacing('xxSmall')})`,
    height: `calc(${touchTarget} + ${spacing('xxSmall')})`,
    marginRight: spacing('small'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'promptChangeList', {
    gap: spacing('xxSmall'),
    marginTop: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'promptChangesToggle', { gap: spacing('xxSmall') });

  // Actionable rows (collapsible trigger, formula bar): the interactive box
  // high, inline inset only.
  addStyleOverride(components, 'MuiDataGrid', 'collapsibleTrigger', {
    height: touchTarget,
    paddingInline: spacing('small'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'formulaBar', {
    minHeight: touchTarget,
    paddingInline: spacing('xSmall'),
    gap: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'formulaColumnHeaderLetter', {
    marginInlineEnd: spacing('xSmall'),
  });
  return enhanced;
}

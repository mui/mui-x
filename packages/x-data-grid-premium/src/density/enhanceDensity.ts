import type { CSSInterpolation, Theme } from '@mui/material/styles';
import { formControlLabelClasses } from '@mui/material/FormControlLabel';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
import { unstable_enhanceDensity as enhanceProDensity } from '@mui/x-data-grid-pro/density';
import type { DensityEnhancedTheme } from '@mui/x-data-grid-pro/density';
import { gridClasses } from '@mui/x-data-grid';
import { getDensitySizing } from '@mui/x-data-grid/internals';
import { addStyleOverride } from '@mui/x-internals/densityTheme';

type SlotWithoutClassKey =
  | 'chartsPanelHeader'
  | 'chartsPanelTitle'
  | 'chartsPanelChartSelection'
  | 'chartTypeRoot'
  | 'chartTypeSelectorButton'
  | 'chartsPanelDataSearchContainer'
  | 'chartsPanelDataSection'
  | 'chartsPanelDataSectionTitle'
  | 'chartsPanelDataFieldList'
  | 'chartsPanelDataPlaceholder'
  | 'chartsPanelDataField'
  | 'chartsPanelDataFieldDragIcon'
  | 'chartsPanelDataFieldCheckbox'
  | 'chartsPanelCustomizeSection'
  | 'chartsPanelSection'
  | 'computedColumnsPanelListItems'
  | 'computedColumnsPanelListItemButton'
  | 'computedColumnsPanelListItemText'
  | 'computedColumnsPanelListFooter'
  | 'computedColumnsPanelEditorBody'
  | 'computedColumnsPanelFieldRow'
  | 'computedColumnsPanelReferenceSearch'
  | 'computedColumnsPanelReferenceLists'
  | 'computedColumnsPanelReferenceGroupTitle'
  | 'computedColumnsPanelReferenceItem'
  | 'computedColumnsPanelReferenceNoResults';

type PremiumDensityComponents = NonNullable<Theme['components']> & {
  MuiDataGrid?: { styleOverrides?: Partial<Record<SlotWithoutClassKey, CSSInterpolation>> };
};

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
  const components: PremiumDensityComponents = enhanced.components;

  // The same bar the toolbar and footer ride.
  const bar = `calc(${touchTarget} + ${spacing('medium')})`;
  const fieldLabelGap = {
    [`& .${formControlLabelClasses.root}`]: { gap: spacing('xxSmall') },
  };
  // Search fields: clear button pull restated above the grid's internal
  // adornment rule (same as the community columns panel).
  const searchField = {
    [`& .${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}.${iconButtonClasses.edgeEnd}`]:
      { marginRight: `calc((${iconSize} - ${touchTarget} + ${spacing('xxSmall')}) / 2)` },
  };

  // Pivot panel (sidebar).
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelHeader', {
    height: bar,
    gap: spacing('xSmall'),
    padding: `0 ${spacing('xSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelSearchContainer', {
    padding: `0 ${spacing('xSmall')} ${spacing('xSmall')}`,
    ...searchField,
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelSwitch', {
    [`&.${gridClasses.pivotPanelSwitch}`]: {
      gap: spacing('xxSmall'),
      margin: 0,
      marginRight: 'auto',
    },
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
    ...fieldLabelGap,
  });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelFieldDragIcon', { width: iconSize });
  addStyleOverride(components, 'MuiDataGrid', 'pivotPanelFieldCheckbox', {
    marginLeft: spacing('-xSmall'),
  });

  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelHeader', {
    gap: `calc(${spacing('xxSmall')} / 2)`,
    padding: `${spacing('xSmall')} ${spacing('xxSmall')} 0 calc(${spacing('xxSmall')} * 1.5)`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelTitle', {
    marginLeft: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelChartSelection', {
    gap: `calc(${spacing('xxSmall')} / 2)`,
    padding: `calc(${spacing('xxSmall')} * 1.5) ${spacing('xxSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartTypeRoot', {
    gap: spacing('xSmall'),
    padding: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartTypeSelectorButton', {
    gap: spacing('xxSmall'),
    padding: `${spacing('small')} ${spacing('xSmall')} ${spacing('xSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataSearchContainer', {
    padding: spacing('xSmall'),
    ...searchField,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataSection', {
    margin: `${spacing('xxSmall')} ${spacing('xSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataSectionTitle', {
    marginRight: spacing('small'),
    gap: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataFieldList', {
    paddingBlock: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataPlaceholder', {
    minHeight: touchTarget,
    paddingInline: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataField', {
    height: touchTarget,
    padding: `0 ${spacing('xSmall')} 0 ${spacing('medium')}`,
    gap: spacing('xxSmall'),
    ...fieldLabelGap,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataFieldDragIcon', {
    width: iconSize,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelDataFieldCheckbox', {
    marginLeft: spacing('-xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelCustomizeSection', {
    margin: `${spacing('xxSmall')} ${spacing('xSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'chartsPanelSection', {
    padding: `${spacing('medium')} ${spacing('small')}`,
    gap: spacing('large'),
    [`& .${formControlLabelClasses.root}`]: { gap: spacing('xxSmall'), margin: 0 },
  });

  // AI assistant panel.
  addStyleOverride(components, 'MuiDataGrid', 'aiAssistantPanelHeader', {
    height: bar,
    padding: `0 ${spacing('xSmall')} 0 ${spacing('medium')}`,
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
    ...searchField,
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
  addStyleOverride(components, 'MuiDataGrid', 'promptChangesToggle', {
    gap: spacing('xxSmall'),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      insetInline: 0,
      top: '50%',
      height: 'max(100%, 24px)',
      transform: 'translateY(-50%)',
    },
  });

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
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnHeaderBadge', {
    marginInlineEnd: spacing('xSmall'),
  });

  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanel', searchField);
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelHeader', {
    height: bar,
    gap: spacing('xSmall'),
    padding: `0 ${spacing('xSmall')} 0 ${spacing('small')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelListItem', {
    gap: spacing('xxSmall'),
    padding: `0 ${spacing('xSmall')} 0 ${spacing('xxSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelListItems', {
    paddingBlock: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelListItemButton', {
    gap: spacing('xSmall'),
    padding: `calc(${spacing('xxSmall')} * 1.5) ${spacing('xSmall')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelListItemText', {
    gap: `calc(${spacing('xxSmall')} / 2)`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelListFooter', {
    padding: spacing('small'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelEditorBody', {
    gap: spacing('medium'),
    padding: `${spacing('medium')} ${spacing('small')}`,
    [`& .${formControlLabelClasses.root}`]: { gap: spacing('xxSmall'), margin: 0 },
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelFieldRow', {
    gap: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelReferenceSearch', {
    padding: `${spacing('xSmall')} ${spacing('xSmall')} ${spacing('xxSmall')}`,
    ...searchField,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelReferenceLists', {
    paddingBottom: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelReferenceGroupTitle', {
    padding: `calc(${spacing('xxSmall')} * 1.5) ${spacing('small')} calc(${spacing('xxSmall')} / 2)`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelReferenceItem', {
    gap: spacing('xSmall'),
    padding: `${spacing('xxSmall')} ${spacing('small')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelReferenceNoResults', {
    padding: `${spacing('xSmall')} ${spacing('small')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelEmpty', {
    padding: spacing('medium'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelField', {
    gap: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelFormula', {
    paddingBlock: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelPreview', {
    gap: spacing('xxSmall'),
    padding: `${spacing('xSmall')} ${spacing('small')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelValidation', {
    paddingLeft: spacing('medium'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'computedColumnsPanelFooter', {
    gap: spacing('xSmall'),
    padding: spacing('small'),
  });
  return enhanced;
}

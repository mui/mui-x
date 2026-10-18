import type { Theme } from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceCommunityDensity } from '@mui/x-tree-view/density';
import type { DensityEnhancedTheme } from '@mui/x-tree-view/density';
import { addDefaultProps, getDensityScale } from '@mui/x-internals/densityTheme';

/**
 * Make the Pro tree view density-aware: the community enhancer first, then
 * the Pro tree view's own props.
 *
 * The community enhancer returns a fresh theme with a fresh `components`
 * object, so this tier writes into it instead of copying the theme again.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const enhanced = enhanceCommunityDensity(theme);
  const scale = getDensityScale(theme);
  // The virtualizer positions rows with `itemHeight` (32 by default, the
  // touch target), so the row height follows the scale through the prop.
  addDefaultProps(enhanced.components, 'MuiRichTreeViewPro', {
    itemHeight: scale.touchTarget,
    itemChildrenIndentation: scale.spacing.small,
  });
  return enhanced;
}

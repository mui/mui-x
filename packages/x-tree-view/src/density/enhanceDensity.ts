import type { CSSInterpolation, Theme } from '@mui/material/styles';
import {
  addDefaultProps,
  addRootOverride,
  getDensityScale,
  getDensitySizing,
} from '@mui/x-internals/densityTheme';
import type { TreeItemLoaderClassKey } from '../TreeItemLoader/treeItemLoaderClasses';
import { treeItemLoaderClasses } from '../TreeItemLoader/treeItemLoaderClasses';

/** A theme whose `components` object the enhancer chain owns and can write into. */
export type DensityEnhancedTheme<T extends Theme> = T & {
  components: NonNullable<Theme['components']>;
};

// The loading row resolves theme overrides by name, but the package's theme
// augmentation does not list it, so pin its key here.
type TreeViewDensityComponents = NonNullable<Theme['components']> & {
  MuiTreeItemLoader?: {
    styleOverrides?: Partial<Record<TreeItemLoaderClassKey, CSSInterpolation>>;
  };
};

/**
 * Make the tree views density-aware on the scale the theme already carries.
 * Apply after `@mui/material`'s `unstable_enhanceDensity`; without it the
 * theme has no scale to read. The Pro enhancer wraps this one and adds what
 * the Pro tree view owns.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const scale = getDensityScale(theme);
  const components: TreeViewDensityComponents = { ...theme.components };
  const { spacing } = theme;
  const { touchTarget, iconSize } = getDensitySizing(theme);

  // The indentation is a prop the tree writes into a CSS var and the Pro
  // reordering parses, so it ships as a px number through `defaultProps`.
  const indentation = { itemChildrenIndentation: scale.spacing.small };
  addDefaultProps(components, 'MuiSimpleTreeView', indentation);
  addDefaultProps(components, 'MuiRichTreeView', indentation);

  // An item row is the interactive box. A row height set through `itemHeight`
  // (the tree writes it to `--TreeView-itemHeight`, and the Pro virtualizer
  // positions rows with it) stays the floor, so CSS and JS never disagree.
  // The inline start keeps master's indentation term.
  const row = {
    minHeight: `var(--TreeView-itemHeight, ${touchTarget})`,
    paddingBlock: 0,
    paddingRight: spacing('xSmall'),
    paddingLeft: `calc(${spacing('xSmall')} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth, 0))`,
    gap: spacing('xSmall'),
  };
  addRootOverride(components, 'MuiTreeItem', row, 'content');
  addRootOverride(
    components,
    'MuiTreeItem',
    { width: iconSize, '& svg': { fontSize: iconSize } },
    'iconContainer',
  );
  // The item checkbox is a material Checkbox that master sizes to its glyph
  // (no padding). Material's enhancer gives every Checkbox a `touchTarget`
  // box, which the row then squeezes, so the box follows the glyph again.
  addRootOverride(components, 'MuiTreeItem', { width: iconSize, height: iconSize }, 'checkbox');
  // The editable label and its inline input share a 2px inset so the text
  // does not move on edit; it is half the smallest step.
  const editInset = `calc(${spacing('xxSmall')} / 2)`;
  addRootOverride(
    components,
    'MuiTreeItem',
    { variants: [{ props: { editable: true }, style: { paddingLeft: editInset } }] },
    'label',
  );
  addRootOverride(components, 'MuiTreeItem', { paddingInline: editInset }, 'labelInput');
  addRootOverride(components, 'MuiTreeItemLoader', {
    ...row,
    [`& .${treeItemLoaderClasses.iconContainer}`]: { width: iconSize },
  });

  return { ...theme, components };
}

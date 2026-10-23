import type { CSSInterpolation, Theme } from '@mui/material/styles';
import {
  addDefaultProps,
  addStyleOverride,
  getDensityScale,
  getDensitySizing,
} from '@mui/x-internals/densityTheme';
import type { TreeItemLoaderClassKey } from '../TreeItemLoader/treeItemLoaderClasses';
import { treeItemLoaderClasses } from '../TreeItemLoader/treeItemLoaderClasses';
import type { TreeItemClassKey } from '../TreeItem/treeItemClasses';

// The tree view keys are typed by the theme augmentation a program loads, and
// programs that compile this file without one (docs, tests) have no keys. The
// loading row resolves theme overrides by name, but the package's theme
// augmentation does not list it, so its key is pinned here.
export type TreeViewDensityComponents = NonNullable<Theme['components']> & {
  MuiSimpleTreeView?: { defaultProps?: object };
  MuiRichTreeView?: { defaultProps?: object };
  MuiTreeItem?: { styleOverrides?: Partial<Record<TreeItemClassKey, unknown>> };
  MuiTreeItemLoader?: {
    styleOverrides?: Partial<Record<TreeItemLoaderClassKey, CSSInterpolation>>;
  };
};

/** A theme whose `components` object the enhancer chain owns and can write into. */
export type DensityEnhancedTheme<T extends Theme> = T & {
  components: TreeViewDensityComponents;
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
  addStyleOverride(components, 'MuiTreeItem', 'content', row);
  addStyleOverride(components, 'MuiTreeItem', 'iconContainer', {
    width: iconSize,
    '& svg': { fontSize: iconSize },
  });
  // The item checkbox is a material Checkbox that master sizes to its glyph
  // (no padding). Material's enhancer gives every Checkbox a `touchTarget`
  // box, which the row then squeezes, so the box follows the glyph again.
  addStyleOverride(components, 'MuiTreeItem', 'checkbox', { width: iconSize, height: iconSize });
  // The editable label and its inline input share a 2px inset so the text
  // does not move on edit; it is half the smallest step.
  const editInset = `calc(${spacing('xxSmall')} / 2)`;
  addStyleOverride(components, 'MuiTreeItem', 'label', {
    variants: [{ props: { editable: true }, style: { paddingLeft: editInset } }],
  });
  addStyleOverride(components, 'MuiTreeItem', 'labelInput', { paddingInline: editInset });
  addStyleOverride(components, 'MuiTreeItemLoader', 'root', {
    ...row,
    [`& .${treeItemLoaderClasses.iconContainer}`]: { width: iconSize },
  });

  return { ...theme, components };
}

'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Skeleton from '@mui/material/Skeleton';
import composeClasses from '@mui/utils/composeClasses';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { TREE_ITEM_ICON_CONTAINER_WIDTH_PX } from '../internals/constants';
import type { TreeItemLoaderProps } from './TreeItemLoader.types';
import type { TreeItemLoaderClasses } from './treeItemLoaderClasses';
import { getTreeItemLoaderUtilityClass, treeItemLoaderClasses } from './treeItemLoaderClasses';
import { TreeItemLoaderContext } from './TreeItemLoaderContext';

const useThemeProps = createUseThemeProps('MuiTreeItemLoader');

// Rotated with `nth-of-type` so consecutive rows render labels of different widths.
const LABEL_WIDTHS = ['40%', '70%', '55%', '50%', '65%'];

export const TreeItemLoaderRoot = styled('li', {
  name: 'MuiTreeItemLoader',
  slot: 'Root',
})(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  // Same typography as the tree item label, so the loading row line box has the same height.
  ...theme.typography.body1,
  padding: theme.spacing(0.5, 1),
  // Same indentation formula as the tree item content.
  paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth, 0))`,
  height: 'var(--TreeView-itemHeight, unset)',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [`& .${treeItemLoaderClasses.iconContainer}`]: {
    width: TREE_ITEM_ICON_CONTAINER_WIDTH_PX,
    flexShrink: 0,
    display: 'inline-block',
  },
  [`& .${treeItemLoaderClasses.checkbox}`]: {
    flexShrink: 0,
  },
  ...Object.fromEntries(
    LABEL_WIDTHS.map((width, index) => [
      `&:nth-of-type(5n + ${index + 1}) .${treeItemLoaderClasses.label}`,
      { width },
    ]),
  ),
}));

const useUtilityClasses = (classes: Partial<TreeItemLoaderClasses> | undefined) => {
  const slots = {
    root: ['root'],
    iconContainer: ['iconContainer'],
    checkbox: ['checkbox'],
    label: ['label'],
  };

  return composeClasses(slots, getTreeItemLoaderUtilityClass, classes);
};

/**
 * Semantic wrapper for one loading row of the Rich Tree View.
 *
 * It renders a `li` element with the `role`, `aria` attributes, indentation and
 * height of a tree item, so custom loading UIs stay accessible and aligned.
 * Without children, it renders the default skeleton placeholders.
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeItemLoader API](https://mui.com/x/api/tree-view/tree-item-loader/)
 */
const TreeItemLoader = React.forwardRef(function TreeItemLoader(
  inProps: TreeItemLoaderProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiTreeItemLoader' });
  const { children, className, classes: classesProp, style, ownerState, ...other } = props;

  const { itemDepth, itemHeight, isCheckboxSelectionEnabled } =
    React.useContext(TreeItemLoaderContext);
  const classes = useUtilityClasses(classesProp);

  const rootStyle = {
    '--TreeView-itemDepth': itemDepth,
    ...(itemHeight == null ? {} : { '--TreeView-itemHeight': `${itemHeight}px` }),
    ...style,
  } as React.CSSProperties;

  return (
    <TreeItemLoaderRoot
      role="treeitem"
      aria-disabled
      {...other}
      className={clsx(classes.root, className)}
      style={rootStyle}
      ref={ref}
    >
      {children ?? (
        <React.Fragment>
          <span className={classes.iconContainer} />
          {isCheckboxSelectionEnabled && (
            // Same size as the checkbox rendered by the tree item, to keep the labels aligned.
            <Skeleton variant="circular" width={24} height={24} className={classes.checkbox} />
          )}
          <Skeleton className={classes.label} />
        </React.Fragment>
      )}
    </TreeItemLoaderRoot>
  );
});

TreeItemLoader.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the loading row.
   * When not provided, the default skeleton placeholders are rendered.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * State of the loading row, forwarded by the `itemLoader` slot.
   * The component does not render it.
   */
  ownerState: PropTypes.shape({
    index: PropTypes.number.isRequired,
    isCheckboxSelectionEnabled: PropTypes.bool.isRequired,
    itemDepth: PropTypes.number.isRequired,
    itemsCount: PropTypes.number.isRequired,
  }),
} as any;

export { TreeItemLoader };

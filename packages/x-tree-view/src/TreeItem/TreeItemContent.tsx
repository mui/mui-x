import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTreeItemState } from './useTreeItemState';

export interface TreeItemContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: {
    /** Styles applied to the root element. */
    root: string;
    /** State class applied to the content element when expanded. */
    expanded: string;
    /** State class applied to the content element when selected. */
    selected: string;
    /** State class applied to the content element when focused. */
    focused: string;
    /** State class applied to the element when disabled. */
    disabled: string;
    /** Styles applied to the tree item icon and collapse/expand icon. */
    iconContainer: string;
    /** Styles applied to the label element. */
    label: string;
  };
  /**
   * The tree item label.
   */
  label?: React.ReactNode;
  /**
   * The id of the item.
   */
  itemId: string;
  /**
   * The icon to display next to the tree item's label.
   */
  icon?: React.ReactNode;
  /**
   * The icon to display next to the tree item's label. Either an expansion or collapse icon.
   */
  expansionIcon?: React.ReactNode;
  /**
   * The icon to display next to the tree item's label. Either a parent or end icon.
   */
  displayIcon?: React.ReactNode;
}

export type TreeItemContentClassKey = keyof NonNullable<TreeItemContentProps['classes']>;

/**
 * @ignore - internal component.
 */
const TreeItemContent = React.forwardRef(function TreeItemContent(
  props: TreeItemContentProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    classes,
    className,
    displayIcon,
    expansionIcon,
    icon: iconProp,
    label,
    itemId,
    onClick,
    onMouseDown,
    ...other
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItemState(itemId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    preventSelection(event);

    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleExpansion(event);
    handleSelection(event);

    if (onClick) {
      onClick(event);
    }
  };

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions -- Key event is handled by the TreeView */
    <div
      {...other}
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      <div className={classes.iconContainer}>{icon}</div>
      <div className={classes.label}>{label}</div>
    </div>
  );
});

TreeItemContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  /**
   * The icon to display next to the tree item's label. Either a parent or end icon.
   */
  displayIcon: PropTypes.node,
  /**
   * The icon to display next to the tree item's label. Either an expansion or collapse icon.
   */
  expansionIcon: PropTypes.node,
  /**
   * The icon to display next to the tree item's label.
   */
  icon: PropTypes.node,
  /**
   * The id of the item.
   */
  itemId: PropTypes.string.isRequired,
  /**
   * The tree item label.
   */
  label: PropTypes.node,
} as any;

export { TreeItemContent };

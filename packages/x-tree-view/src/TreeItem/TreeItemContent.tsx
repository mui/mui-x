import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Checkbox from '@mui/material/Checkbox';
import { useTreeItemState } from './useTreeItemState';
import {
  TreeItem2DragAndDropOverlay,
  TreeItem2DragAndDropOverlayProps,
} from '../TreeItem2DragAndDropOverlay';
import { TreeItem2LabelInput, TreeItem2LabelInputProps } from '../TreeItem2LabelInput';
import { TreeViewCancellableEvent } from '../models';

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
    /** Styles applied to the Tree Item icon and collapse/expand icon. */
    iconContainer: string;
    /** Styles applied to the label element. */
    label: string;
    /** Styles applied to the checkbox element. */
    checkbox: string;
    /** Styles applied to the input element that is visible when editing is enabled. */
    labelInput: string;
    /** Styles applied to the content element when editing is enabled. */
    editing: string;
    /** Styles applied to the content of the items that are editable. */
    editable: string;
  };
  /**
   * The Tree Item label.
   */
  label?: React.ReactNode;
  /**
   * The id of the item.
   */
  itemId: string;
  /**
   * The icon to display next to the Tree Item's label.
   */
  icon?: React.ReactNode;
  /**
   * The icon to display next to the Tree Item's label. Either an expansion or collapse icon.
   */
  expansionIcon?: React.ReactNode;
  /**
   * The icon to display next to the Tree Item's label. Either a parent or end icon.
   */
  displayIcon?: React.ReactNode;
  dragAndDropOverlayProps?: TreeItem2DragAndDropOverlayProps;
  labelInputProps?: TreeItem2LabelInputProps;
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
    dragAndDropOverlayProps,
    labelInputProps,
    ...other
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    editing,
    editable,
    disableSelection,
    checkboxSelection,
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    handleContentClick,
    preventSelection,
    expansionTrigger,
    toggleItemEditing,
  } = useTreeItemState(itemId);

  const icon = iconProp || expansionIcon || displayIcon;
  const checkboxRef = React.useRef<HTMLButtonElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    preventSelection(event);

    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleContentClick?.(event, itemId);

    if (checkboxRef.current?.contains(event.target as HTMLElement)) {
      return;
    }

    if (expansionTrigger === 'content') {
      handleExpansion(event);
    }

    if (!checkboxSelection) {
      handleSelection(event);
    }

    if (onClick) {
      onClick(event);
    }
  };

  // If we click on the expansion icon and expansionTrigger is "iconContainer", we expand or collapse the tree item.
  const handleIconClick =
    expansionIcon != null && icon === expansionIcon && expansionTrigger === 'iconContainer'
      ? (event: React.MouseEvent<HTMLDivElement>) => {
          if (
            expansionIcon != null &&
            icon === expansionIcon &&
            expansionTrigger === 'iconContainer'
          ) {
            handleExpansion(event);
          }
        }
      : undefined;

  const handleLabelDoubleClick = (event: React.MouseEvent & TreeViewCancellableEvent) => {
    if (event.defaultMuiPrevented) {
      return;
    }
    toggleItemEditing();
  };

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions -- Key event is handled by the TreeView */
    <div
      {...other}
      className={clsx(
        classes.root,
        {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
          [classes.editing]: editing,
          [classes.editable]: editable,
        },
        className,
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      { /*  eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className={classes.iconContainer}
        onClick={handleIconClick}
      >
        {icon}
      </div>
      {checkboxSelection && (
        <Checkbox
          className={classes.checkbox}
          checked={selected}
          onChange={handleCheckboxSelection}
          disabled={disabled || disableSelection}
          ref={checkboxRef}
          tabIndex={-1}
        />
      )}

      {editing ? (
        <TreeItem2LabelInput {...labelInputProps} className={classes.labelInput} />
      ) : (
        <div className={classes.label} {...(editable && { onDoubleClick: handleLabelDoubleClick })}>
          {label}
        </div>
      )}

      {dragAndDropOverlayProps && <TreeItem2DragAndDropOverlay {...dragAndDropOverlayProps} />}
    </div>
  );
});

TreeItemContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  /**
   * The icon to display next to the Tree Item's label. Either a parent or end icon.
   */
  displayIcon: PropTypes.node,
  dragAndDropOverlayProps: PropTypes.shape({
    action: PropTypes.oneOf(['make-child', 'move-to-parent', 'reorder-above', 'reorder-below']),
    style: PropTypes.object,
  }),
  /**
   * The icon to display next to the Tree Item's label. Either an expansion or collapse icon.
   */
  expansionIcon: PropTypes.node,
  /**
   * The icon to display next to the Tree Item's label.
   */
  icon: PropTypes.node,
  /**
   * The id of the item.
   */
  itemId: PropTypes.string.isRequired,
  /**
   * The Tree Item label.
   */
  label: PropTypes.node,
  labelInputProps: PropTypes.shape({
    autoFocus: PropTypes.oneOf([true]),
    'data-element': PropTypes.oneOf(['labelInput']),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    type: PropTypes.oneOf(['text']),
    value: PropTypes.string,
  }),
} as any;

export { TreeItemContent };

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
import { MuiCancellableEvent } from '../internals/models';

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
    handleSaveItemLabel,
    handleCancelItemLabelEditing,
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

  const handleLabelDoubleClick = (event: React.MouseEvent & MuiCancellableEvent) => {
    if (event.defaultMuiPrevented) {
      return;
    }
    toggleItemEditing();
  };
  const handleLabelInputBlur = (
    event: React.FocusEvent<HTMLInputElement> & MuiCancellableEvent,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    if (event.target.value) {
      handleSaveItemLabel(event, event.target.value);
    }
  };

  const handleLabelInputKeydown = (
    event: React.KeyboardEvent<HTMLInputElement> & MuiCancellableEvent,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    const target = event.target as HTMLInputElement;
    if (event.key === 'Enter' && target.value) {
      handleSaveItemLabel(event, target.value);
    } else if (event.key === 'Escape') {
      handleCancelItemLabelEditing(event);
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
        [classes.editing]: editing,
        [classes.editable]: editable,
      })}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      <div className={classes.iconContainer}>{icon}</div>
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
        <TreeItem2LabelInput
          {...labelInputProps}
          className={classes.labelInput}
          onBlur={handleLabelInputBlur}
          onKeyDown={handleLabelInputKeydown}
        />
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
   * The icon to display next to the tree item's label. Either a parent or end icon.
   */
  displayIcon: PropTypes.node,
  dragAndDropOverlayProps: PropTypes.shape({
    action: PropTypes.oneOf(['make-child', 'move-to-parent', 'reorder-above', 'reorder-below']),
    style: PropTypes.object,
  }),
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
  labelInputProps: PropTypes.object,
} as any;

export { TreeItemContent };

import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemState, TreeItemContentProps } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const ITEMS: TreeViewBaseItem[] = [
  {
    id: '1',
    label: 'Applications',
    children: [{ id: '2', label: 'Calendar' }],
  },
  {
    id: '3',
    label: 'Documents',
    children: [
      { id: '6', label: 'OSS' },
      {
        id: '4',
        label: 'MUI',
        children: [{ id: '5', label: 'index.js' }],
      },
    ],
  },
];

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    itemId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

export default function IconExpansionTreeView() {
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <RichTreeView
        aria-label="icon expansion"
        items={ITEMS}
        slotProps={{ item: { ContentComponent: CustomContent } }}
      />
    </Box>
  );
}

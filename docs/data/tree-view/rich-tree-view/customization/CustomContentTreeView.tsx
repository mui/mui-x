import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemState, TreeItemContentProps } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const ITEMS: TreeViewBaseItem[] = [
  {
    id: '1',
    label: 'Amelia Hart',
    children: [{ id: '2', label: 'Jane Fisher' }],
  },
  {
    id: '3',
    label: 'Bailey Monroe',
    children: [
      { id: '4', label: 'Freddie Reed' },
      {
        id: '5',
        label: 'Georgia Johnson',
        children: [{ id: '6', label: 'Samantha Malone' }],
      },
    ],
  },
];

const CustomContentRoot = styled('div')(({ theme }) => ({
  '&': { padding: theme.spacing(0.5, 1) },
}));

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref,
) {
  const {
    className,
    classes,
    label,
    nodeId,
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
  } = useTreeItemState(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event);
    handleSelection(event);
  };

  return (
    <CustomContentRoot
      className={clsx(className, classes.root, {
        'Mui-expanded': expanded,
        'Mui-selected': selected,
        'Mui-focused': focused,
        'Mui-disabled': disabled,
      })}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div className={classes.iconContainer}>{icon}</div>
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
        <Avatar
          sx={(theme) => ({
            background: theme.palette.primary.main,
            width: 24,
            height: 24,
            fontSize: '0.8rem',
          })}
        >
          {(label as string)[0]}
        </Avatar>
        <Typography component="div" className={classes.label}>
          {label}
        </Typography>
      </Box>
    </CustomContentRoot>
  );
});

export default function CustomContentTreeView() {
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <RichTreeView
        aria-label="icon expansion"
        sx={{ position: 'relative' }}
        defaultExpandedNodes={['3']}
        items={ITEMS}
        slotProps={{ item: { ContentComponent: CustomContent } }}
      />
    </Box>
  );
}

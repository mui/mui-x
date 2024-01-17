import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, useTreeItemState } from '@mui/x-tree-view/TreeItem';

const CustomContentRoot = styled('div')(({ theme }) => ({
  '&': { padding: theme.spacing(0.5, 1) },
}));

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
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

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleClick = (event) => {
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
      ref={ref}
    >
      <div className={classes.iconContainer}>{icon}</div>
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
        <Avatar
          sx={(theme) => ({
            background: theme.palette.primary.main,
            width: 24,
            height: 24,
            fontSize: '0.8rem',
          })}
        >
          {label[0]}
        </Avatar>
        <Typography component="div" className={classes.label}>
          {label}
        </Typography>
      </Box>
    </CustomContentRoot>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
});

export default function CustomContentTreeView() {
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <SimpleTreeView
        aria-label="icon expansion"
        sx={{ position: 'relative' }}
        defaultExpandedNodes={['3']}
      >
        <CustomTreeItem nodeId="1" label="Amelia Hart">
          <CustomTreeItem nodeId="2" label="Jane Fisher" />
        </CustomTreeItem>
        <CustomTreeItem nodeId="3" label="Bailey Monroe">
          <CustomTreeItem nodeId="4" label="Freddie Reed" />
          <CustomTreeItem nodeId="5" label="Georgia Johnson">
            <CustomTreeItem nodeId="6" label="Samantha Malone" />
          </CustomTreeItem>
        </CustomTreeItem>
      </SimpleTreeView>
    </Box>
  );
}

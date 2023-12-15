import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const StyledTreeItemLabel = styled(Typography)(({ theme, ...props }) => {
  console.log('ownerState', props, theme);
  return {
    color: 'inherit',
    fontFamily: 'General Sans',
    fontWeight: 600,
    flexGrow: 1,
  };
});

const StyledTreeItemRoot = styled(TreeItem)(({ theme, ...props }) => {
  console.log('ownerState', props, theme);
  return {
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
      [`& .${treeItemClasses.label}`]: {
        color: '#666772',
        borderRadius: theme.spacing(0.7),
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
        paddingTop: theme.spacing(0.2),
        paddingBottom: theme.spacing(0.2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
      },
      [`&.MuiExpanded `]: {
        fontWeight: theme.typography.fontWeightRegular,
      },
      '&:hover': {
        backgroundColor: 'transparent',
        [`.${treeItemClasses.label}`]: {
          backgroundColor: '#edeef4',
          color: '#747bc5',
        },
      },
      [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
        backgroundColor: 'transparent',
        [`.${treeItemClasses.label}`]: {
          backgroundColor: '#e4e7fa',
          color: '#5a60a8',
        },
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      [`& .${treeItemClasses.content}`]: {
        paddingLeft: theme.spacing(3),
      },
    },
  };
});

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const theme = useTheme();
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  const styleProps = {
    '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    '--tree-view-bg-color':
      theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <StyledTreeItemLabel variant="body2">{labelText}</StyledTreeItemLabel>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

export default function CustomizedTreeView2() {
  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} />
      <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
      <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
        <StyledTreeItem
          nodeId="5"
          labelText="Social"
          labelIcon={SupervisorAccountIcon}
          labelInfo="90"
          color="#1a73e8"
          bgColor="#e8f0fe"
          colorForDarkMode="#B8E7FB"
          bgColorForDarkMode="#071318"
        />
        <StyledTreeItem
          nodeId="6"
          labelText="Updates"
          labelIcon={InfoIcon}
          labelInfo="2,294"
          color="#e3742f"
          bgColor="#fcefe3"
          colorForDarkMode="#FFE2B7"
          bgColorForDarkMode="#191207"
        />
        <StyledTreeItem
          nodeId="7"
          labelText="Forums"
          labelIcon={ForumIcon}
          labelInfo="3,566"
          color="#a250f5"
          bgColor="#f3e8fd"
          colorForDarkMode="#D9B8FB"
          bgColorForDarkMode="#100719"
        />
        <StyledTreeItem
          nodeId="8"
          labelText="Promotions"
          labelIcon={LocalOfferIcon}
          labelInfo="733"
          color="#3c8039"
          bgColor="#e6f4ea"
          colorForDarkMode="#CCE8CD"
          bgColorForDarkMode="#0C130D"
        />
      </StyledTreeItem>
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
    </TreeView>
  );
}

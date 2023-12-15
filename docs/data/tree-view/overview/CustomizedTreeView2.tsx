import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FolderRounded from '@mui/icons-material/FolderRounded';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';

function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: 'warning.main',
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mr: 1,
      }}
    />
  );
}

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  labelIcon: React.ElementType;
  labelText: string;
};

const StyledTreeItemLabel = styled(Typography)(({ theme, ...props }) => {
  console.log('ownerState', props, theme);
  return {
    color: 'inherit',
    fontFamily: 'General Sans',
    fontWeight: 'inherit',
    flexGrow: 1,
  };
}) as unknown as typeof Typography;

const StyledTreeItemRoot = styled(TreeItem)(({ theme, ...props }) => {
  console.log('ownerState', props, theme);
  return {
    color: theme.palette.text.secondary,
    position: 'relative',
    [`& .${treeItemClasses.content}`]: {
      [`& .${treeItemClasses.label}`]: {
        color: theme.palette.grey[800],
        borderRadius: theme.spacing(0.7),
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
        paddingRight: theme.spacing(2),
        fontWeight: 600,
        // background: '#f6f9ff',
      },
      [`& .${treeItemClasses.iconContainer}`]: {
        marginRight: theme.spacing(2),
      },
      [`&.Mui-expanded `]: {
        fontWeight: theme.typography.fontWeightRegular,
        '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
          color: '#4b5aff',
        },
        '&::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: '48px',
          top: '44px',
          height: 'calc(100% - 48px)',
          width: '1.5px',
          backgroundColor: '#2828282e',
        },
      },
      '&:hover': {
        backgroundColor: 'transparent',
        [`.${treeItemClasses.label}`]: {
          backgroundColor: '#f0f2ff',
          color: '#4b5aff',
        },
      },
      [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
        backgroundColor: 'transparent',
        [`.${treeItemClasses.label}`]: {
          backgroundColor: '#4b5aff',
          color: 'white',
        },
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      paddingLeft: theme.spacing(2),
      [`& .${treeItemClasses.content}`]: {
        [`& .${treeItemClasses.label}`]: {
          fontWeight: 500,
        },
      },
    },
  };
}) as unknown as typeof TreeItem;

const StyledTreeItem = React.forwardRef(function StyledTreeItem(
  props: StyledTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { labelIcon: LabelIcon, labelText, ...other } = props;

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
          <Box
            component={LabelIcon}
            className="labelIcon"
            color="inherit"
            sx={{ mr: 1 }}
          />
          <StyledTreeItemLabel variant="body2">{labelText}</StyledTreeItemLabel>
        </Box>
      }
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
      sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <StyledTreeItem nodeId="1" labelText="All Documents" labelIcon={FolderRounded}>
        <StyledTreeItem nodeId="5" labelText="Company" labelIcon={FolderRounded}>
          <StyledTreeItem nodeId="8" labelText="Personal" labelIcon={DotIcon} />
          <StyledTreeItem nodeId="9" labelText="Images" labelIcon={DotIcon} />
          <StyledTreeItem nodeId="10" labelText="Personal" labelIcon={DotIcon} />
          <StyledTreeItem nodeId="11" labelText="Images" labelIcon={DotIcon} />
        </StyledTreeItem>
        <StyledTreeItem nodeId="6" labelText="Personal" labelIcon={DotIcon} />
        <StyledTreeItem nodeId="7" labelText="Images" labelIcon={DotIcon} />
      </StyledTreeItem>
      <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
        <StyledTreeItem nodeId="12" labelText="Social" labelIcon={DotIcon} />
        <StyledTreeItem nodeId="13" labelText="Updates" labelIcon={DotIcon} />
        <StyledTreeItem nodeId="14" labelText="Forums" labelIcon={DotIcon} />
        <StyledTreeItem
          nodeId="15"
          labelText="Promotions"
          labelIcon={LocalOfferIcon}
        />
      </StyledTreeItem>
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={FolderRounded} />
      <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
    </TreeView>
  );
}

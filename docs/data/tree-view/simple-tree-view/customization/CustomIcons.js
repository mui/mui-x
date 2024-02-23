import * as React from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const CustomTreeItem = styled(TreeItem)({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
});

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

export default function CustomIcons() {
  return (
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedNodes={['1']}
      slots={{
        expandIcon: AddBoxIcon,
        collapseIcon: IndeterminateCheckBoxIcon,
        endIcon: CloseSquare,
      }}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
    >
      <CustomTreeItem nodeId="1" label="Main">
        <CustomTreeItem nodeId="2" label="Hello" />
        <CustomTreeItem nodeId="3" label="Subtree with children">
          <CustomTreeItem nodeId="6" label="Hello" />
          <CustomTreeItem nodeId="7" label="Sub-subtree with children">
            <CustomTreeItem nodeId="9" label="Child 1" />
            <CustomTreeItem nodeId="10" label="Child 2" />
            <CustomTreeItem nodeId="11" label="Child 3" />
          </CustomTreeItem>
          <CustomTreeItem nodeId="8" label="Hello" />
        </CustomTreeItem>
        <CustomTreeItem nodeId="4" label="World" />
        <CustomTreeItem nodeId="5" label="Something something" />
      </CustomTreeItem>
    </SimpleTreeView>
  );
}

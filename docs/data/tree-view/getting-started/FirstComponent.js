import * as React from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function FirstComponent() {
  return (
    <SimpleTreeView
      aria-label="file system navigator"
      sx={{ height: 200, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem itemId="1" label="Applications">
        <TreeItem itemId="2" label="Calendar" />
      </TreeItem>
      <TreeItem itemId="5" label="Documents">
        <TreeItem itemId="10" label="OSS" />
        <TreeItem itemId="6" label="MUI">
          <TreeItem itemId="8" label="index.js" />
        </TreeItem>
      </TreeItem>
    </SimpleTreeView>
  );
}

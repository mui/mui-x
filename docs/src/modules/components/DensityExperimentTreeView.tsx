// Review surface for the tree view density enhancer, routed from
// `docs/pages/x/density-experiment-tree-view.js`. Remove or turn into a docs demo before merge.
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { unstable_enhanceDensity as enhanceTreeView } from '@mui/x-tree-view-pro/density';
import DensityExperimentShell, { createEnhancedTheme } from './DensityExperimentShell';

const enhanced = createEnhancedTheme(enhanceTreeView);

const items = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      {
        id: 'grid-pro',
        label: '@mui/x-data-grid-pro',
        children: [{ id: 'grid-premium', label: '@mui/x-data-grid-premium' }],
      },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [{ id: 'pickers-pro', label: '@mui/x-date-pickers-pro' }],
  },
  { id: 'charts', label: 'Charts' },
];
const expanded = ['grid', 'grid-pro', 'pickers'];
const lazyDataSource = {
  getChildrenCount: () => 2,
  getTreeItems: (parentId?: string) =>
    parentId
      ? new Promise<never>(() => {})
      : Promise.resolve([
          { id: 'root', label: 'Lazy root (children never load)' },
          { id: 'root2', label: 'Second root' },
        ]),
};

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ width: 300 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function DensityExperimentTreeView() {
  return (
    <DensityExperimentShell
      title="Tree View density — material enhancer + tree view enhancer chain"
      description={
        <React.Fragment>
          Right column: <code>enhanceTreeView(enhanceMaterial(createTheme(...)))</code> with the Pro
          enhancer (community underneath). Double-click a label in the editable tree to review the
          inline input.
        </React.Fragment>
      }
      enhanced={enhanced}
      componentNames={[
        'MuiTreeItem',
        'MuiTreeItemLoader',
        'MuiRichTreeView',
        'MuiSimpleTreeView',
        'MuiRichTreeViewPro',
      ]}
    >
      {() => (
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}
        >
          <Demo title="Rich tree view">
            <RichTreeView
              items={items}
              defaultExpandedItems={expanded}
              defaultSelectedItems="grid-pro"
            />
          </Demo>
          <Demo title="Checkbox selection">
            <RichTreeView
              items={items}
              defaultExpandedItems={expanded}
              checkboxSelection
              multiSelect
              defaultSelectedItems={['grid-community']}
            />
          </Demo>
          <Demo title="Editable labels">
            <RichTreeView items={items} defaultExpandedItems={expanded} isItemEditable />
          </Demo>
          <Demo title="Simple tree view">
            <SimpleTreeView defaultExpandedItems={['a']}>
              <TreeItem itemId="a" label="Simple tree view">
                <TreeItem itemId="a1" label="First child" />
                <TreeItem itemId="a2" label="Second child" />
              </TreeItem>
              <TreeItem itemId="b" label="Sibling" />
            </SimpleTreeView>
          </Demo>
          <Demo title="Pro, lazy loading">
            <RichTreeViewPro
              items={[]}
              dataSource={lazyDataSource}
              defaultExpandedItems={['root']}
            />
          </Demo>
        </Stack>
      )}
    </DensityExperimentShell>
  );
}

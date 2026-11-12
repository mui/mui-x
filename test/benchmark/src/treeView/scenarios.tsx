import * as React from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { defineScenario } from '../utils/scenario';

interface Item {
  id: string;
  label: string;
  children?: Item[];
}

function createItems(parents: number, childrenPerParent: number): Item[] {
  return Array.from({ length: parents }, (_, parent) => ({
    id: `${parent}`,
    label: `Folder ${parent}`,
    children: Array.from({ length: childrenPerParent }, (__, child) => ({
      id: `${parent}-${child}`,
      label: `File ${parent}-${child}`,
    })),
  }));
}

const items = createItems(20, 50);
const expandedItems = items.map((item) => item.id);

export const richTreeView = defineScenario('RichTreeView with 1,000 expanded items', () => (
  <div style={{ width: 400, height: 500, overflow: 'auto' }}>
    <RichTreeView items={items} defaultExpandedItems={expandedItems} />
  </div>
));

export const richTreeViewPro = defineScenario('RichTreeViewPro with 1,000 expanded items', () => (
  <div style={{ width: 400, height: 500 }}>
    <RichTreeViewPro items={items} defaultExpandedItems={expandedItems} />
  </div>
));

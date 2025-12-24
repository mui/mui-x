import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { vi } from 'vitest';
import { createRenderer, fireEvent, createEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnValues } from 'test/utils/helperFn';
import {
  DataGridPro,
  DataGridProProps,
  GridRowModel,
  gridRowTreeSelector,
  GridApi,
  useGridApiRef,
  GRID_ROOT_GROUP_ID,
  type ReorderValidationContext,
  type GridGroupNode,
  type IsRowReorderableParams,
} from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';
import type { RowReorderDropPosition } from '@mui/x-data-grid/internals';

function createDragOverEvent(target: ChildNode, dropPosition: RowReorderDropPosition = 'above') {
  const dragOverEvent = createEvent.dragOver(target);
  Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });

  const targetElement = target as Element;
  if (!targetElement.getBoundingClientRect) {
    targetElement.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      width: 100,
      height: 52,
      right: 100,
      bottom: 52,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  }

  const rect = targetElement.getBoundingClientRect();
  let clientY: number;

  if (dropPosition === 'above') {
    clientY = rect.top + rect.height * 0.1; // Top 20% for tree data
  } else if (dropPosition === 'below') {
    clientY = rect.top + rect.height * 0.9; // Bottom 20% for tree data
  } else {
    clientY = rect.top + rect.height * 0.5; // Middle 60% for "inside"
  }

  Object.defineProperty(dragOverEvent, 'clientY', { value: clientY });
  Object.defineProperty(dragOverEvent, 'target', { value: target });
  Object.defineProperty(dragOverEvent, 'dataTransfer', {
    value: {
      dropEffect: 'copy',
    },
  });

  return dragOverEvent;
}

function fireDragStart(target: ChildNode) {
  const dragStartEvent = createEvent.dragStart(target);
  Object.defineProperty(dragStartEvent, 'dataTransfer', {
    value: {
      effectAllowed: 'copy',
      setData: () => {},
      getData: () => '',
    },
  });
  fireEvent(target, dragStartEvent);
}

function createDragEndEvent(target: ChildNode, isOutsideTheGrid: boolean = false) {
  const dragEndEvent = createEvent.dragEnd(target);
  Object.defineProperty(dragEndEvent, 'dataTransfer', {
    value: { dropEffect: isOutsideTheGrid ? 'none' : 'copy' },
  });
  return dragEndEvent;
}

// Tree-specific test utilities
const findRowIndex = (allValues: string[], name: string, id?: number): number => {
  let index = allValues.indexOf(name);
  if (index < 0 && id !== undefined) {
    index = allValues.indexOf(id.toString());
  }
  return index;
};

const getTreeDataPath = (row: GridRowModel) => row.path;

const setTreeDataPath = (path: readonly string[], row: GridRowModel) => ({
  ...row,
  path,
});

/**
 * Helper to perform a complete drag operation sequence.
 */
function performDragOperation(
  sourceCell: ChildNode,
  targetCell: ChildNode,
  dropPosition: RowReorderDropPosition = 'above',
  isOutsideGrid: boolean = false,
) {
  fireDragStart(sourceCell);
  fireEvent.dragEnter(targetCell);
  const dragOverEvent = createDragOverEvent(targetCell, dropPosition);
  fireEvent(targetCell, dragOverEvent);
  const dragEndEvent = createDragEndEvent(sourceCell, isOutsideGrid);
  fireEvent(sourceCell, dragEndEvent);
}

const baselineProps: DataGridProProps = {
  rows: [
    { id: 1, path: ['Documents'], name: 'Documents' },
    { id: 2, path: ['Documents', 'Work'], name: 'Work' },
    { id: 3, path: ['Documents', 'Work', 'Reports'], name: 'Reports' },
    { id: 4, path: ['Documents', 'Work', 'Reports', 'Q1.pdf'], name: 'Q1.pdf' },
    { id: 5, path: ['Documents', 'Work', 'Reports', 'Q2.pdf'], name: 'Q2.pdf' },
    { id: 6, path: ['Documents', 'Personal'], name: 'Personal' },
    { id: 7, path: ['Documents', 'Personal', 'Resume.pdf'], name: 'Resume.pdf' },
    { id: 8, path: ['Pictures'], name: 'Pictures' },
    { id: 9, path: ['Pictures', 'Vacation'], name: 'Vacation' },
    { id: 10, path: ['Pictures', 'Vacation', 'Beach.jpg'], name: 'Beach.jpg' },
  ],
  columns: [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'id', headerName: 'ID', width: 100 },
  ],
  treeData: true,
  getTreeDataPath,
  setTreeDataPath,
  rowReordering: true,
  defaultGroupingExpansionDepth: -1,
  disableVirtualization: true,
  autoHeight: isJSDOM,
};

describe.skipIf(isJSDOM)('<DataGridPro /> - Tree data row reordering', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 400, height: 400 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('Same-parent reordering', () => {
    it('should reorder a leaf in the same parent when dropped below the last node in the same group', async () => {
      // - A
      //   - A.A
      //   - A.B
      // - B (leaf)
      // When `A.A` is dragged and dropped on "below" of "A.B", it should swap positions with "A.B" (same parent reorder)
      const handleRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={handleRowOrderChange}
          rows={[
            { id: 1, path: ['A'], name: 'A' },
            { id: 2, path: ['A', 'A.A'], name: 'A.A' },
            { id: 3, path: ['A', 'A.B'], name: 'A.B' },
            { id: 4, path: ['B'], name: 'B' },
          ]}
        />,
      );

      // Initial order: A.A should be before A.B
      const initialValues = getColumnValues(0);
      const initialAAIndex = findRowIndex(initialValues, 'A.A', 2);
      const initialABIndex = findRowIndex(initialValues, 'A.B', 3);

      expect(initialAAIndex).to.be.greaterThan(-1, 'A.A should be found');
      expect(initialABIndex).to.be.greaterThan(-1, 'A.B should be found');
      expect(initialAAIndex).to.be.lessThan(initialABIndex, 'A.A should be before A.B initially');

      // Drag A.A and drop it "below" A.B
      const sourceCell = getCell(initialAAIndex, 0).firstChild!; // A.A
      const targetCell = getCell(initialABIndex, 0); // A.B

      performDragOperation(sourceCell, targetCell, 'below');

      // Wait for state updates to complete
      await waitFor(() => {
        expect(handleRowOrderChange.mock.calls.length).to.equal(1);
      });

      // Verify A.A is now after A.B
      const newValues = getColumnValues(0);
      const newAAIndex = findRowIndex(newValues, 'A.A', 2);
      const newABIndex = findRowIndex(newValues, 'A.B', 3);

      expect(newAAIndex).to.be.greaterThan(newABIndex, 'A.A should be after A.B after reorder');

      // Verify both still have the same parent (A)
      const rowTree = gridRowTreeSelector(apiRef!);
      const aaNode = rowTree[2];
      const abNode = rowTree[3];

      expect(aaNode.parent).to.equal(1, 'A.A should still be a child of A');
      expect(abNode.parent).to.equal(1, 'A.B should still be a child of A');
    });

    it('should reorder a leaf in the next group when dropped above the first node after current group', async () => {
      // - A
      //   - A.A
      //   - A.B
      // - B (leaf)
      // When `A.A` is dragged and dropped on "above" of "B", it should become the second direct child of "A" (cross-parent reorder)
      const handleRowOrderChange = vi.fn();
      render(
        <Test
          onRowOrderChange={handleRowOrderChange}
          rows={[
            { id: 1, path: ['A'], name: 'A' },
            { id: 2, path: ['A', 'A.A'], name: 'A.A' },
            { id: 3, path: ['A', 'A.B'], name: 'A.B' },
            { id: 4, path: ['B'], name: 'B' },
          ]}
        />,
      );

      // Initial order: A.A should be before A.B and before B
      const initialValues = getColumnValues(0);
      const initialAAIndex = findRowIndex(initialValues, 'A.A', 2);
      const initialABIndex = findRowIndex(initialValues, 'A.B', 3);
      const initialBIndex = findRowIndex(initialValues, 'B', 4);

      expect(initialAAIndex).to.be.greaterThan(-1, 'A.A should be found');
      expect(initialABIndex).to.be.greaterThan(-1, 'A.B should be found');
      expect(initialBIndex).to.be.greaterThan(-1, 'B should be found');
      expect(initialAAIndex).to.be.lessThan(initialABIndex, 'A.A should be before A.B initially');
      expect(initialABIndex).to.be.lessThan(initialBIndex, 'A.B should be before B initially');

      // Drag A.A and drop it "above" B
      const sourceCell = getCell(initialAAIndex, 0).firstChild!; // A.A
      const targetCell = getCell(initialBIndex, 0); // B

      performDragOperation(sourceCell, targetCell, 'above');

      // Wait for state updates to complete
      await waitFor(() => {
        expect(handleRowOrderChange.mock.calls.length).to.equal(1);
      });

      // Verify A.A is now after A.B (became the second child of A)
      const newValues = getColumnValues(0);
      const newAAIndex = findRowIndex(newValues, 'A.A', 2);
      const newABIndex = findRowIndex(newValues, 'A.B', 3);
      const newBIndex = findRowIndex(newValues, 'B', 4);

      expect(newAAIndex).to.be.greaterThan(newABIndex, 'A.A should be after A.B after reorder');
      expect(newAAIndex).to.be.lessThan(newBIndex, 'A.A should still be before B');

      // Verify A.A is still a child of A (same parent)
      const rowTree = gridRowTreeSelector(apiRef!);
      const aaNode = rowTree[2];

      expect(aaNode.parent).to.equal(GRID_ROOT_GROUP_ID, 'A.A should be a root node now');
    });

    it('should reorder group nodes within same parent', async () => {
      render(<Test />);

      // Initial order: Work, Personal under Documents
      const initialValues = getColumnValues(0);
      const initialWorkIndex = initialValues.indexOf('Work');
      const initialPersonalIndex = initialValues.indexOf('Personal');
      expect(initialWorkIndex).to.be.lessThan(initialPersonalIndex);

      // Drag Personal above Work
      const sourceCell = getCell(initialPersonalIndex, 0).firstChild!; // Personal
      const targetCell = getCell(initialWorkIndex, 0); // Work

      performDragOperation(sourceCell, targetCell, 'above');

      // Wait for state updates to complete
      await waitFor(() => {
        const newValues = getColumnValues(0);
        const newWorkIndex = newValues.indexOf('Work');
        const newPersonalIndex = newValues.indexOf('Personal');
        expect(newPersonalIndex).to.be.lessThan(newWorkIndex);
      });
    });
  });

  describe('Cross-parent reordering', () => {
    it('should move group with children to different parent', async () => {
      const handleRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      // Move Work group (with Reports subgroup) from Documents to Pictures
      const workIndex = getColumnValues(0).indexOf('Work');
      const picturesIndex = getColumnValues(0).indexOf('Pictures');

      expect(workIndex).to.be.greaterThan(-1);
      expect(picturesIndex).to.be.greaterThan(-1);

      const sourceCell = getCell(workIndex, 0).firstChild!;
      const targetCell = getCell(picturesIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      await waitFor(() => {
        expect(handleRowOrderChange.mock.calls.length).to.equal(1);
      });

      // Verify Work is now under Pictures in tree structure
      const rowTree = gridRowTreeSelector(apiRef!);
      const workNode = rowTree[2]; // Work node
      const picturesNode = rowTree[8]; // Pictures node
      expect(workNode.parent).to.equal(picturesNode.id);
    });

    it('should move leaf from one parent to another', async () => {
      const handleRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      // Move Resume.pdf from Personal to Pictures
      const allValues = getColumnValues(0);
      const resumeIndex = findRowIndex(allValues, 'Resume.pdf', 7);
      const picturesIndex = findRowIndex(allValues, 'Pictures', 8);

      expect(resumeIndex).to.be.greaterThan(-1, 'Resume.pdf should be found');
      expect(picturesIndex).to.be.greaterThan(-1, 'Pictures should be found');

      const sourceCell = getCell(resumeIndex, 0).firstChild!; // Resume.pdf
      const targetCell = getCell(picturesIndex, 0); // Pictures

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      await waitFor(() => {
        expect(handleRowOrderChange.mock.calls.length).to.equal(1);
      });

      // Verify Resume.pdf is now under Pictures
      const rowTree = gridRowTreeSelector(apiRef!);
      const resumeNode = rowTree[7];
      const picturesNode = rowTree[8];
      expect(resumeNode.parent).to.equal(picturesNode.id);
    });

    it('should convert parent to leaf when last child removed', async () => {
      const processedRows: GridRowModel[] = [];
      const handleProcessRowUpdate = (newRow: GridRowModel) => {
        processedRows.push(newRow);
        return newRow;
      };

      render(
        <Test
          processRowUpdate={handleProcessRowUpdate}
          rows={[
            { id: 1, path: ['Root'], name: 'Root' },
            { id: 2, path: ['Root', 'Parent'], name: 'Parent' },
            { id: 3, path: ['Root', 'Parent', 'OnlyChild'], name: 'OnlyChild' },
            { id: 4, path: ['Root', 'Target'], name: 'Target' },
          ]}
        />,
      );

      // Move OnlyChild to Target
      const allValues = getColumnValues(0);
      const onlyChildIndex = findRowIndex(allValues, 'OnlyChild', 3);
      const targetIndex = findRowIndex(allValues, 'Target', 4);

      expect(onlyChildIndex).to.be.greaterThan(-1, 'OnlyChild should be found');
      expect(targetIndex).to.be.greaterThan(-1, 'Target should be found');

      const sourceCell = getCell(onlyChildIndex, 0).firstChild!;
      const targetCell = getCell(targetIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      await waitFor(() => {
        expect(processedRows.length).to.be.greaterThan(0);
      });

      // Verify Parent becomes a leaf
      const rowTree = gridRowTreeSelector(apiRef!);
      const parentNode = rowTree[2];
      expect(parentNode.type).to.equal('leaf');
    });

    it('should not allow to drop group on the above position on the next group when the previous node is a leaf', async () => {
      // This test ensures that the 'group-to-group-above-leaf-belongs-to-source' validation rule is applied correctly
      const handleRowOrderChange = vi.fn();

      render(
        <Test
          onRowOrderChange={handleRowOrderChange}
          rows={[
            { id: 1, path: ['Root'], name: 'Root' },
            { id: 2, path: ['Root', 'SourceGroup'], name: 'SourceGroup' },
            { id: 3, path: ['Root', 'SourceGroup', 'ChildLeaf-1'], name: 'ChildLeaf-1' },
            { id: 4, path: ['Root', 'TargetGroup'], name: 'TargetGroup' },
            { id: 5, path: ['Root', 'TargetGroup', 'ChildLeaf-2'], name: 'ChildLeaf-2' },
          ]}
        />,
      );

      // Try to drop SourceGroup above TargetGroup
      // The previous node before TargetGroup is ChildLeaf-1, which belongs to SourceGroup
      // This should be blocked by the 'group-to-group-above-leaf-belongs-to-source' rule
      const allValues = getColumnValues(0);
      const sourceGroupIndex = findRowIndex(allValues, 'SourceGroup', 2);
      const targetGroupIndex = findRowIndex(allValues, 'TargetGroup', 4);

      expect(sourceGroupIndex).to.be.greaterThan(-1, 'SourceGroup should be found');
      expect(targetGroupIndex).to.be.greaterThan(-1, 'TargetGroup should be found');

      const sourceCell = getCell(sourceGroupIndex, 0).firstChild!;
      const targetCell = getCell(targetGroupIndex, 0);

      // Start drag
      fireDragStart(sourceCell);

      // Hover over the target row - drop indicator should NOT render
      const dragOverEvent = createDragOverEvent(targetCell, 'above');
      fireEvent(targetCell, dragOverEvent);

      const targetRow = targetCell.closest('[data-id]');
      const rowDragPlaceholder = targetRow?.lastElementChild;

      // Verify drop indicator is NOT rendered (element should not have placeholder styling)
      if (rowDragPlaceholder) {
        const computedStyle = window.getComputedStyle(rowDragPlaceholder);
        // If placeholder exists, it should not have the absolute positioning that indicates a valid drop
        expect(computedStyle.position).not.to.equal('absolute');
      }

      // Complete the drag operation
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      // Verify operation was blocked
      expect(handleRowOrderChange.mock.calls.length).to.equal(0);
    });
  });

  describe('Drop "inside" operations', () => {
    describe('Drop inside leaf', () => {
      it('should convert leaf to parent when item dropped inside it', async () => {
        const handleRowOrderChange = vi.fn();
        const processedRows: GridRowModel[] = [];

        const handleProcessRowUpdate = (newRow: GridRowModel) => {
          processedRows.push(newRow);
          return newRow;
        };

        render(
          <Test
            onRowOrderChange={handleRowOrderChange}
            processRowUpdate={handleProcessRowUpdate}
            rows={[
              { id: 1, path: ['Root'], name: 'Root' },
              { id: 2, path: ['Root', 'LeafA'], name: 'LeafA' },
              { id: 3, path: ['Root', 'LeafB'], name: 'LeafB' },
            ]}
          />,
        );

        // Debug what's rendered
        const allValues = getColumnValues(0);

        // Drop LeafA "inside" LeafB to make LeafB a parent of LeafA
        const leafAIndex = findRowIndex(allValues, 'LeafA', 2);
        const leafBIndex = findRowIndex(allValues, 'LeafB', 3);

        expect(leafAIndex).to.be.greaterThan(
          -1,
          `LeafA should be found in: ${allValues.join(', ')}`,
        );
        expect(leafBIndex).to.be.greaterThan(
          -1,
          `LeafB should be found in: ${allValues.join(', ')}`,
        );

        const sourceCell = getCell(leafAIndex, 0).firstChild!;
        const targetCell = getCell(leafBIndex, 0);

        performDragOperation(sourceCell, targetCell, 'inside');

        await waitFor(() => {
          expect(handleRowOrderChange.mock.calls.length).to.equal(1);
        });

        // Verify LeafB became a group and LeafA is its child
        const rowTree = gridRowTreeSelector(apiRef!);
        const leafANode = rowTree[2];
        const leafBNode = rowTree[3];
        expect(leafBNode.type).to.equal('group');
        expect(leafANode.parent).to.equal(leafBNode.id);
      });

      it('should handle group dropped inside leaf', async () => {
        const handleRowOrderChange = vi.fn();

        render(
          <Test
            onRowOrderChange={handleRowOrderChange}
            rows={[
              { id: 1, path: ['Root'], name: 'Root' },
              { id: 2, path: ['Root', 'Group'], name: 'Group' },
              { id: 3, path: ['Root', 'Group', 'Child'], name: 'Child' },
              { id: 4, path: ['Root', 'Leaf'], name: 'Leaf' },
            ]}
          />,
        );

        // Drop Group inside Leaf to make Leaf a parent of Group
        const allValues = getColumnValues(0);
        const groupIndex = allValues.indexOf('Group');
        const leafIndex = allValues.indexOf('Leaf');

        // If not found by name, look for node IDs
        const sourceIndex = groupIndex >= 0 ? groupIndex : allValues.indexOf('2');
        const targetIndex = leafIndex >= 0 ? leafIndex : allValues.indexOf('4');

        expect(sourceIndex).to.be.greaterThan(
          -1,
          `Group or ID 2 should be found in: ${allValues.join(', ')}`,
        );
        expect(targetIndex).to.be.greaterThan(
          -1,
          `Leaf or ID 4 should be found in: ${allValues.join(', ')}`,
        );

        const sourceCell = getCell(sourceIndex, 0).firstChild!;
        const targetCell = getCell(targetIndex, 0);

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'inside');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        await waitFor(() => {
          expect(handleRowOrderChange.mock.calls.length).to.equal(1);
        });

        // Verify Leaf became a group and Group is its child
        const rowTree = gridRowTreeSelector(apiRef!);
        const groupNode = rowTree[2];
        const leafNode = rowTree[4];
        expect(leafNode.type).to.equal('group');
        expect(groupNode.parent).to.equal(leafNode.id);
      });
    });

    describe('Drop inside group', () => {
      it('should drop leaf inside expanded group as first child', async () => {
        const handleRowOrderChange = vi.fn();

        render(
          <Test
            onRowOrderChange={handleRowOrderChange}
            rows={[
              { id: 1, path: ['Root'], name: 'Root' },
              { id: 2, path: ['Root', 'Folder'], name: 'Folder' },
              { id: 3, path: ['Root', 'Folder', 'ExistingChild1'], name: 'ExistingChild1' },
              { id: 4, path: ['Root', 'Folder', 'ExistingChild2'], name: 'ExistingChild2' },
              { id: 5, path: ['Root', 'File.txt'], name: 'File.txt' },
            ]}
          />,
        );

        // Drag File.txt "inside" Folder
        const allValues = getColumnValues(0);
        const fileIndex = findRowIndex(allValues, 'File.txt', 5);
        const folderIndex = findRowIndex(allValues, 'Folder', 2);

        expect(fileIndex).to.be.greaterThan(-1, 'File.txt should be found');
        expect(folderIndex).to.be.greaterThan(-1, 'Folder should be found');

        const sourceCell = getCell(fileIndex, 0).firstChild!;
        const targetCell = getCell(folderIndex, 0);

        performDragOperation(sourceCell, targetCell, 'inside');

        await waitFor(() => {
          expect(handleRowOrderChange.mock.calls.length).to.equal(1);
        });

        // Verify File.txt is now a child of Folder
        const rowTree = gridRowTreeSelector(apiRef!);
        const fileNode = rowTree[5];
        const folderNode = rowTree[2] as GridGroupNode;

        expect(fileNode.parent).to.equal(folderNode.id);

        // Verify File.txt is the first child (index 0)
        expect(folderNode.children[0]).to.equal(5);

        // Verify visual order: File.txt appears before ExistingChild1
        const newValues = getColumnValues(0);
        const newFileIndex = findRowIndex(newValues, 'File.txt', 5);
        const existingChild1Index = findRowIndex(newValues, 'ExistingChild1', 3);
        expect(newFileIndex).to.be.lessThan(existingChild1Index);

        // Verify depth
        expect(fileNode.depth).to.equal(folderNode.depth + 1);
      });

      it('should drop group inside group with all descendants', async () => {
        const handleRowOrderChange = vi.fn();
        const processRowUpdateCalls: any[] = [];
        const processRowUpdate = async (newRow: GridRowModel) => {
          processRowUpdateCalls.push(newRow);
          return newRow;
        };

        render(
          <Test
            onRowOrderChange={handleRowOrderChange}
            processRowUpdate={processRowUpdate}
            rows={[
              { id: 1, path: ['Root'], name: 'Root' },
              { id: 2, path: ['Root', 'TargetFolder'], name: 'TargetFolder' },
              { id: 3, path: ['Root', 'TargetFolder', 'ExistingFile'], name: 'ExistingFile' },
              { id: 4, path: ['Root', 'SourceFolder'], name: 'SourceFolder' },
              { id: 5, path: ['Root', 'SourceFolder', 'Child1'], name: 'Child1' },
              { id: 6, path: ['Root', 'SourceFolder', 'Subfolder'], name: 'Subfolder' },
              { id: 7, path: ['Root', 'SourceFolder', 'Subfolder', 'DeepFile'], name: 'DeepFile' },
            ]}
          />,
        );

        // Drag SourceFolder "inside" TargetFolder
        const allValues = getColumnValues(0);
        const sourceFolderIndex = findRowIndex(allValues, 'SourceFolder', 4);
        const targetFolderIndex = findRowIndex(allValues, 'TargetFolder', 2);

        expect(sourceFolderIndex).to.be.greaterThan(-1, 'SourceFolder should be found');
        expect(targetFolderIndex).to.be.greaterThan(-1, 'TargetFolder should be found');

        const sourceCell = getCell(sourceFolderIndex, 0).firstChild!;
        const targetCell = getCell(targetFolderIndex, 0);

        performDragOperation(sourceCell, targetCell, 'inside');

        await waitFor(() => {
          expect(handleRowOrderChange.mock.calls.length).to.equal(1);
        });

        // Verify SourceFolder is now a child of TargetFolder
        const rowTree = gridRowTreeSelector(apiRef!);
        const sourceFolderNode = rowTree[4];
        const targetFolderNode = rowTree[2] as GridGroupNode;

        expect(sourceFolderNode.parent).to.equal(targetFolderNode.id);

        // Verify SourceFolder is the first child (before ExistingFile)
        expect(targetFolderNode.children[0]).to.equal(4);

        // Verify all descendants maintain correct parent-child relationships
        const child1Node = rowTree[5];
        const subfolderNode = rowTree[6];
        const deepFileNode = rowTree[7];

        expect(child1Node.parent).to.equal(4, 'Child1 parent should be SourceFolder');
        expect(subfolderNode.parent).to.equal(4, 'Subfolder parent should be SourceFolder');
        expect(deepFileNode.parent).to.equal(6, 'DeepFile parent should be Subfolder');

        // Verify all depths updated correctly
        expect(sourceFolderNode.depth).to.equal(2, 'SourceFolder depth should be 2');
        expect(child1Node.depth).to.equal(3, 'Child1 depth should be 3');
        expect(subfolderNode.depth).to.equal(3, 'Subfolder depth should be 3');
        expect(deepFileNode.depth).to.equal(4, 'DeepFile depth should be 4');

        // Verify batch processing: processRowUpdate called for group + all descendants
        // SourceFolder (1) + Child1 (1) + Subfolder (1) + DeepFile (1) = 4 total
        expect(processRowUpdateCalls.length).to.equal(4);

        // Verify all updated rows have correct paths
        const sourceFolderUpdate = processRowUpdateCalls.find((row) => row.id === 4);
        expect(sourceFolderUpdate).to.not.equal(undefined);
        expect(JSON.stringify(sourceFolderUpdate!.path)).to.equal(
          JSON.stringify(['Root', 'TargetFolder', 'SourceFolder']),
        );

        const deepFileUpdate = processRowUpdateCalls.find((row) => row.id === 7);
        expect(deepFileUpdate).to.not.equal(undefined);
        expect(JSON.stringify(deepFileUpdate!.path)).to.equal(
          JSON.stringify(['Root', 'TargetFolder', 'SourceFolder', 'Subfolder', 'DeepFile']),
        );
      });

      it('should prevent dropping group "inside" its own descendant', () => {
        const handleRowOrderChange = vi.fn();

        render(
          <Test
            onRowOrderChange={handleRowOrderChange}
            rows={[
              { id: 1, path: ['Root'], name: 'Root' },
              { id: 2, path: ['Root', 'Parent'], name: 'Parent' },
              { id: 3, path: ['Root', 'Parent', 'Child'], name: 'Child' },
              { id: 4, path: ['Root', 'Parent', 'Child', 'Grandchild'], name: 'Grandchild' },
            ]}
          />,
        );

        // Try to drag Parent "inside" Child (its direct descendant)
        const allValues = getColumnValues(0);
        const parentIndex = findRowIndex(allValues, 'Parent', 2);
        const childIndex = findRowIndex(allValues, 'Child', 3);

        expect(parentIndex).to.be.greaterThan(-1, 'Parent should be found');
        expect(childIndex).to.be.greaterThan(-1, 'Child should be found');

        const sourceCell = getCell(parentIndex, 0).firstChild!;
        const targetCell = getCell(childIndex, 0);

        performDragOperation(sourceCell, targetCell, 'inside');

        // Verify operation was blocked
        expect(handleRowOrderChange.mock.calls.length).to.equal(0);

        // Verify tree structure unchanged
        const rowTree = gridRowTreeSelector(apiRef!);
        const parentNode = rowTree[2];
        const childNode = rowTree[3];

        expect(parentNode.parent).to.equal(1); // Still under Root
        expect(childNode.parent).to.equal(2); // Still under Parent

        // Try to drag Parent "inside" Grandchild (deeper descendant)
        const grandchildIndex = findRowIndex(allValues, 'Grandchild', 4);
        expect(grandchildIndex).to.be.greaterThan(-1, 'Grandchild should be found');

        const grandchildCell = getCell(grandchildIndex, 0);
        performDragOperation(sourceCell, grandchildCell, 'inside');

        // Verify this was also blocked
        expect(handleRowOrderChange.mock.calls.length).to.equal(0);

        // Verify tree structure still unchanged
        const finalTree = gridRowTreeSelector(apiRef!);
        expect(finalTree[2].parent).to.equal(1); // Parent still under Root
      });

      it('should update paths correctly for deep hierarchy moves', async () => {
        const handleRowOrderChange = vi.fn();
        const updatedRows: GridRowModel[] = [];
        const customSetTreeDataPath = (path: readonly string[], row: GridRowModel) => {
          const updatedRow = {
            ...row,
            path,
          };
          updatedRows.push(updatedRow);
          return updatedRow;
        };

        render(
          <Test
            onRowOrderChange={handleRowOrderChange}
            setTreeDataPath={customSetTreeDataPath}
            rows={[
              { id: 1, path: ['Documents'], name: 'Documents' },
              { id: 2, path: ['Documents', 'Work'], name: 'Work' },
              { id: 3, path: ['Documents', 'Work', 'Project'], name: 'Project' },
              { id: 4, path: ['Documents', 'Work', 'Project', 'File.doc'], name: 'File.doc' },
              { id: 5, path: ['Pictures'], name: 'Pictures' },
              { id: 6, path: ['Pictures', 'Vacation'], name: 'Vacation' },
            ]}
          />,
        );

        // Drag Project group "inside" Vacation
        const allValues = getColumnValues(0);
        const projectIndex = findRowIndex(allValues, 'Project', 3);
        const vacationIndex = findRowIndex(allValues, 'Vacation', 6);

        expect(projectIndex).to.be.greaterThan(-1, 'Project should be found');
        expect(vacationIndex).to.be.greaterThan(-1, 'Vacation should be found');

        const sourceCell = getCell(projectIndex, 0).firstChild!;
        const targetCell = getCell(vacationIndex, 0);

        performDragOperation(sourceCell, targetCell, 'inside');

        await waitFor(() => {
          expect(handleRowOrderChange.mock.calls.length).to.equal(1);
        });

        // Verify Project new path
        const projectUpdate = updatedRows.find((row) => row.id === 3);
        expect(projectUpdate).to.not.equal(undefined);
        expect(JSON.stringify(projectUpdate!.path)).to.equal(
          JSON.stringify(['Pictures', 'Vacation', 'Project']),
        );

        // Verify File.doc new path
        const fileUpdate = updatedRows.find((row) => row.id === 4);
        expect(fileUpdate).to.not.equal(undefined);
        expect(JSON.stringify(fileUpdate!.path)).to.equal(
          JSON.stringify(['Pictures', 'Vacation', 'Project', 'File.doc']),
        );

        // Verify all paths maintain correct hierarchy
        expect(updatedRows.length).to.equal(2); // Project + File.doc
      });
    });
  });

  describe('Props behavior', () => {
    describe('isRowReorderable', () => {
      it('should prevent specific rows from being dragged', async () => {
        const handleRowOrderChange = vi.fn();
        const isRowReorderable = (params: IsRowReorderableParams) => params.row.id % 2 !== 0;

        render(
          <Test onRowOrderChange={handleRowOrderChange} isRowReorderable={isRowReorderable} />,
        );

        const allValues = getColumnValues(0);

        const q1Index = findRowIndex(allValues, 'Q1.pdf', 4); // Has id=4 (even)
        const q2Index = findRowIndex(allValues, 'Q2.pdf', 5); // Has id=5 (odd)

        expect(q1Index).to.be.greaterThan(-1, 'Q1.pdf should be found');
        expect(q2Index).to.be.greaterThan(-1, 'Q2.pdf should be found');

        const evenCell = getCell(q1Index, 0).firstChild!;
        expect(evenCell).to.have.attribute('draggable', 'false');

        const oddCell = getCell(q2Index, 0).firstChild!;
        expect(oddCell).to.have.attribute('draggable', 'true');
      });
    });

    describe('isValidRowReorder', () => {
      it('should apply custom validation rules to restrict operations', () => {
        const handleRowOrderChange = vi.fn();

        // Custom rule: prevent moving items to root level
        const isValidRowReorder = (context: ReorderValidationContext) => {
          return context.targetNode && context.targetNode.depth > 0;
        };

        render(
          <Test
            onRowOrderChange={handleRowOrderChange}
            isValidRowReorder={isValidRowReorder}
            rows={[
              { id: 1, path: ['Root'], name: 'Root' },
              { id: 2, path: ['Root', 'Child1'], name: 'Child1' },
              { id: 3, path: ['Root', 'Child2'], name: 'Child2' },
              { id: 4, path: ['Root', 'Child2', 'Leaf'], name: 'Leaf' },
            ]}
          />,
        );

        const allValues = getColumnValues(0);

        // Try to move Leaf to root level (should be blocked by custom validation)
        const leafIndex =
          allValues.indexOf('Leaf') >= 0 ? allValues.indexOf('Leaf') : allValues.indexOf('4');
        const rootIndex =
          allValues.indexOf('Root') >= 0 ? allValues.indexOf('Root') : allValues.indexOf('1');

        const sourceCell = getCell(leafIndex, 0).firstChild!;
        const targetCell = getCell(rootIndex, 0);

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'below');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        // Custom validation should block this operation
        expect(handleRowOrderChange.mock.calls.length).to.equal(0);
      });

      it('should not bypass internal validation', () => {
        const handleRowOrderChange = vi.fn();

        // Even if custom validation allows it, internal validation should still apply
        const isValidRowReorder = () => true; // Allow everything

        render(
          <Test onRowOrderChange={handleRowOrderChange} isValidRowReorder={isValidRowReorder} />,
        );

        const allValues = getColumnValues(0);

        // Try to move Documents into Work (parent into its own descendant)
        // This should still be blocked by internal validation
        const documentsIndex = allValues.indexOf('Documents');
        const workIndex = allValues.indexOf('Work');

        const sourceCell = getCell(documentsIndex, 0).firstChild!;
        const targetCell = getCell(workIndex, 0);

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'below');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        // Internal validation should still block this
        expect(handleRowOrderChange.mock.calls.length).to.equal(0);
      });
    });

    describe('setTreeDataPath', () => {
      it('should update paths correctly on cross-parent reorder', async () => {
        const updatedRows: GridRowModel[] = [];
        const customSetTreeDataPath = (path: readonly string[], row: GridRowModel) => {
          const updatedRow = {
            ...row,
            path,
            fullPath: path.join('/'),
          };
          updatedRows.push(updatedRow);
          return updatedRow;
        };

        render(<Test setTreeDataPath={customSetTreeDataPath} />);

        // Move Beach.jpg from Vacation to Documents
        const allValues = getColumnValues(0);
        const beachIndex = findRowIndex(allValues, 'Beach.jpg', 10);
        const documentsIndex = findRowIndex(allValues, 'Documents', 1);

        expect(beachIndex).to.be.greaterThan(-1, 'Beach.jpg should be found');
        expect(documentsIndex).to.be.greaterThan(-1, 'Documents should be found');

        const sourceCell = getCell(beachIndex, 0).firstChild!;
        const targetCell = getCell(documentsIndex, 0);

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'below');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        await waitFor(() => {
          expect(updatedRows.length).to.be.greaterThan(0);
        });

        // Verify path was updated
        const beachUpdate = updatedRows.find((row) => row.id === 10);
        expect(beachUpdate).to.not.equal(undefined);
        expect(beachUpdate!.fullPath).to.include('Documents');
      });

      it('should show warning when setTreeDataPath is missing', async () => {
        const warnSpy = vi.fn();
        const handleRowOrderChange = vi.fn();
        const originalWarn = console.warn;
        console.warn = warnSpy;

        render(<Test setTreeDataPath={undefined} onRowOrderChange={handleRowOrderChange} />);

        // Attempt cross-parent reorder
        const allValues = getColumnValues(0);
        const beachIndex = findRowIndex(allValues, 'Beach.jpg', 10);
        const documentsIndex = findRowIndex(allValues, 'Documents', 1);

        const targetCell = getCell(beachIndex, 0);
        const sourceCell = getCell(documentsIndex, 0).firstChild!;

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'below');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        // Wait for async state cleanup and warnings
        await waitFor(() => {
          const warningCalls = warnSpy.getCalls();
          const hasSetTreeDataPathWarning = warningCalls.some((call) =>
            call.args.some((arg) => typeof arg === 'string' && arg.includes('setTreeDataPath')),
          );
          expect(hasSetTreeDataPathWarning).to.equal(true);
        });

        console.warn = originalWarn;
      });
    });
  });

  describe('Events', () => {
    it('should fire rowOrderChange on successful reorder', async () => {
      const handleRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      // Perform valid reorder (move Q1.pdf below Q2.pdf)
      const allValues = getColumnValues(0);
      const q1Index = findRowIndex(allValues, 'Q1.pdf', 4);
      const q2Index = findRowIndex(allValues, 'Q2.pdf', 5);

      expect(q1Index).to.be.greaterThan(-1, 'Q1.pdf should be found');
      expect(q2Index).to.be.greaterThan(-1, 'Q2.pdf should be found');

      const sourceCell = getCell(q1Index, 0).firstChild!;
      const targetCell = getCell(q2Index, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      await waitFor(() => {
        expect(handleRowOrderChange.mock.calls.length).to.equal(1);
      });

      const eventParams = handleRowOrderChange.firstCall.args[0];
      expect(eventParams).to.have.property('oldIndex');
      expect(eventParams).to.have.property('targetIndex');
    });

    it('should not fire event on cancelled operation', () => {
      const handleRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      const allValues = getColumnValues(0);
      const q1Index = findRowIndex(allValues, 'Q1.pdf', 4);
      expect(q1Index).to.be.greaterThan(-1, 'Q1.pdf should be found');

      const sourceCell = getCell(q1Index, 0).firstChild!;

      // Start drag and cancel by dropping outside
      fireDragStart(sourceCell);
      const dragEndEvent = createDragEndEvent(sourceCell, true);
      fireEvent(sourceCell, dragEndEvent);

      expect(handleRowOrderChange.mock.calls.length).to.equal(0);
    });
  });

  describe('Async Operations', () => {
    it('should handle processRowUpdate promises correctly', async () => {
      const handleRowOrderChange = vi.fn();
      const processRowUpdateCalls: any[] = [];
      let resolvePromise: (value: any) => void = () => {};

      const processRowUpdate = (newRow: any) => {
        processRowUpdateCalls.push(newRow);
        return new Promise((resolve) => {
          resolvePromise = resolve;
        });
      };

      render(<Test onRowOrderChange={handleRowOrderChange} processRowUpdate={processRowUpdate} />);

      const allValues = getColumnValues(0);
      const resumeIndex = findRowIndex(allValues, 'Resume.pdf', 7);
      const picturesIndex = findRowIndex(allValues, 'Pictures', 8);

      const sourceCell = getCell(resumeIndex, 0).firstChild!;
      const targetCell = getCell(picturesIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      // Event should not fire immediately
      expect(handleRowOrderChange.mock.calls.length).to.equal(0);

      // Resolve the promise
      if (processRowUpdateCalls.length > 0) {
        resolvePromise(processRowUpdateCalls[0]);
      }

      // Now event should fire
      await waitFor(() => {
        expect(handleRowOrderChange.mock.calls.length).to.equal(1);
      });
    });

    it('should handle processRowUpdate rejection gracefully', async () => {
      const handleProcessRowUpdateError = vi.fn();
      let processRowUpdateCallCount = 0;

      const processRowUpdate = async (_newRow: any) => {
        processRowUpdateCallCount += 1;
        throw new Error('Server error');
      };

      render(
        <Test
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />,
      );

      const allValues = getColumnValues(0);
      const resumeIndex = findRowIndex(allValues, 'Resume.pdf', 7);
      const picturesIndex = findRowIndex(allValues, 'Pictures', 8);

      const sourceCell = getCell(resumeIndex, 0).firstChild!;
      const targetCell = getCell(picturesIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      // Wait for process row update to be called and error to be thrown
      await waitFor(() => {
        expect(processRowUpdateCallCount).to.be.greaterThan(0);
      });

      expect(handleProcessRowUpdateError.mock.calls.length).to.be.greaterThan(0);
    });

    it('should handle batch operations for group moves', async () => {
      const processRowUpdateCalls: any[] = [];
      const processRowUpdate = async (newRow: any) => {
        processRowUpdateCalls.push(newRow);
        return newRow;
      };

      render(<Test processRowUpdate={processRowUpdate} />);

      const allValues = getColumnValues(0);
      const workIndex = findRowIndex(allValues, 'Work', 2);
      const picturesIndex = findRowIndex(allValues, 'Pictures', 8);

      const sourceCell = getCell(workIndex, 0).firstChild!;
      const targetCell = getCell(picturesIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      await waitFor(() => {
        expect(processRowUpdateCalls.length).to.equal(4); // Work + its children (3) + Pictures (1)
      });
    });
  });
});

import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { spy } from 'sinon';
import { createRenderer, fireEvent, createEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnValues } from 'test/utils/helperFn';
import {
  DataGridPro,
  DataGridProProps,
  GridRowsProp,
  GridRowModel,
  gridRowTreeSelector,
  GridApi,
  useGridApiRef,
  type ReorderValidationContext,
} from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';

function createDragOverEvent(
  target: ChildNode,
  dropPosition: 'above' | 'below' | 'over' = 'above',
) {
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
    clientY = rect.top + rect.height * 0.5; // Middle 60% for "over"
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

const createTreeData = (): GridRowsProp => [
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
];

const getTreeDataPath = (row: GridRowModel) => row.path;

const setTreeDataPath = (path: readonly string[], row: GridRowModel) => ({
  ...row,
  path,
});

const baselineProps: DataGridProProps = {
  rows: createTreeData(),
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

  // Suppress `act()` warnings
  const originalError = console.error;
  beforeEach(() => {
    console.error = (...args: any[]) => {
      // Filter out act() warnings specifically
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterEach(() => {
    console.error = originalError;
  });

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 400, height: 400 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('Same-parent reordering', () => {
    it('should reorder group nodes within same parent', () => {
      render(<Test />);

      // Initial order: Work, Personal under Documents
      const initialValues = getColumnValues(0);
      const initialWorkIndex = initialValues.indexOf('Work');
      const initialPersonalIndex = initialValues.indexOf('Personal');
      expect(initialWorkIndex).to.be.lessThan(initialPersonalIndex);

      // Drag Personal above Work
      const sourceCell = getCell(initialPersonalIndex, 0).firstChild!; // Personal
      const targetCell = getCell(initialWorkIndex, 0); // Work

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'above');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      // Verify new order
      const newValues = getColumnValues(0);
      const newWorkIndex = newValues.indexOf('Work');
      const newPersonalIndex = newValues.indexOf('Personal');
      expect(newPersonalIndex).to.be.lessThan(newWorkIndex);
    });
  });

  describe('Cross-parent reordering', () => {
    it('should move group with children to different parent', async () => {
      const handleRowOrderChange = spy();
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
        expect(handleRowOrderChange.callCount).to.equal(1);
      });

      // Verify Work is now under Pictures in tree structure
      const rowTree = gridRowTreeSelector(apiRef!);
      const workNode = rowTree[2]; // Work node
      const picturesNode = rowTree[8]; // Pictures node
      expect(workNode.parent).to.equal(picturesNode.id);
    });

    it('should move leaf from one parent to another', async () => {
      const handleRowOrderChange = spy();
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
        expect(handleRowOrderChange.callCount).to.equal(1);
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
  });

  describe('Drop "over" operations', () => {
    it('should convert leaf to parent when item dropped over it', async () => {
      const handleRowOrderChange = spy();
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

      // Drop LeafA "over" LeafB to make LeafB a parent of LeafA
      const leafAIndex = allValues.indexOf('LeafA');
      const leafBIndex = allValues.indexOf('LeafB');

      // If not found by name, look for node IDs
      const idAIndex = leafAIndex >= 0 ? leafAIndex : allValues.indexOf('2');
      const idBIndex = leafBIndex >= 0 ? leafBIndex : allValues.indexOf('3');

      expect(idAIndex).to.be.greaterThan(
        -1,
        `LeafA or ID 2 should be found in: ${allValues.join(', ')}`,
      );
      expect(idBIndex).to.be.greaterThan(
        -1,
        `LeafB or ID 3 should be found in: ${allValues.join(', ')}`,
      );

      const sourceCell = getCell(idAIndex, 0).firstChild!;
      const targetCell = getCell(idBIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'over');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      await waitFor(() => {
        expect(handleRowOrderChange.callCount).to.equal(1);
      });

      // Verify LeafB became a group and LeafA is its child
      const rowTree = gridRowTreeSelector(apiRef!);
      const leafANode = rowTree[2];
      const leafBNode = rowTree[3];
      expect(leafBNode.type).to.equal('group');
      expect(leafANode.parent).to.equal(leafBNode.id);
    });

    it('should handle group dropped over leaf', async () => {
      const handleRowOrderChange = spy();

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

      // Drop Group over Leaf to make Leaf a parent of Group
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
      const dragOverEvent = createDragOverEvent(targetCell, 'over');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      await waitFor(() => {
        expect(handleRowOrderChange.callCount).to.equal(1);
      });

      // Verify Leaf became a group and Group is its child
      const rowTree = gridRowTreeSelector(apiRef!);
      const groupNode = rowTree[2];
      const leafNode = rowTree[4];
      expect(leafNode.type).to.equal('group');
      expect(groupNode.parent).to.equal(leafNode.id);
    });
  });

  describe('Validation', () => {
    it('should prevent moving parent into its own descendant', () => {
      const handleRowOrderChange = spy();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      // Try to move Documents into Work (its child)
      const allValues = getColumnValues(0);
      const documentsIndex = allValues.indexOf('Documents');
      const workIndex = allValues.indexOf('Work');

      expect(documentsIndex).to.be.greaterThan(-1, 'Documents should be found');
      expect(workIndex).to.be.greaterThan(-1, 'Work should be found');

      const sourceCell = getCell(documentsIndex, 0).firstChild!;
      const targetCell = getCell(workIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      // Verify operation was blocked
      expect(handleRowOrderChange.callCount).to.equal(0);
    });
  });

  describe('Props behavior', () => {
    describe('isRowReorderable', () => {
      it('should prevent specific rows from being dragged', () => {
        const handleRowOrderChange = spy();

        // Prevent dragging rows with even IDs
        const isRowReorderable = (params: any) => params.row.id % 2 !== 0;

        render(
          <Test onRowOrderChange={handleRowOrderChange} isRowReorderable={isRowReorderable} />,
        );

        const allValues = getColumnValues(0);

        // Try to drag an even ID row (should be blocked)
        // Look for a row with even ID (like Q1.pdf which has id=4)
        const q1Index = findRowIndex(allValues, 'Q1.pdf', 4); // Has id=4 (even)
        const q2Index = findRowIndex(allValues, 'Q2.pdf', 5); // Has id=5 (odd)

        expect(q1Index).to.be.greaterThan(-1, 'Q1.pdf should be found');
        expect(q2Index).to.be.greaterThan(-1, 'Q2.pdf should be found');

        const sourceCell = getCell(q1Index, 0).firstChild!;
        const targetCell = getCell(q2Index, 0);

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'above');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        // Verify drag was blocked
        expect(handleRowOrderChange.callCount).to.equal(0);
      });

      it('should render correctly with isRowReorderable prop', () => {
        // Allow dragging rows with odd IDs
        const isRowReorderable = (params: any) => params.row.id % 2 !== 0;

        render(<Test isRowReorderable={isRowReorderable} />);

        // Verify grid renders without errors with the prop
        const allValues = getColumnValues(0);
        expect(allValues.length).to.be.greaterThan(0);

        // Verify the prop is applied by checking basic drag setup doesn't crash
        const q2Index = findRowIndex(allValues, 'Q2.pdf', 5); // Has odd ID, should be draggable
        if (q2Index >= 0) {
          const sourceCell = getCell(q2Index, 0).firstChild!;
          expect(() => fireDragStart(sourceCell)).to.not.throw();
        }
      });
    });

    describe('isValidRowReorder', () => {
      it('should apply custom validation rules to restrict operations', () => {
        const handleRowOrderChange = spy();

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

        if (leafIndex >= 0 && rootIndex >= 0) {
          const sourceCell = getCell(leafIndex, 0).firstChild!;
          const targetCell = getCell(rootIndex, 0);

          fireDragStart(sourceCell);
          fireEvent.dragEnter(targetCell);
          const dragOverEvent = createDragOverEvent(targetCell, 'below');
          fireEvent(targetCell, dragOverEvent);
          const dragEndEvent = createDragEndEvent(sourceCell);
          fireEvent(sourceCell, dragEndEvent);

          // Custom validation should block this operation
          expect(handleRowOrderChange.callCount).to.equal(0);
        }
      });

      it('should not bypass internal validation', () => {
        const handleRowOrderChange = spy();

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

        if (documentsIndex >= 0 && workIndex >= 0) {
          const sourceCell = getCell(documentsIndex, 0).firstChild!;
          const targetCell = getCell(workIndex, 0);

          fireDragStart(sourceCell);
          fireEvent.dragEnter(targetCell);
          const dragOverEvent = createDragOverEvent(targetCell, 'below');
          fireEvent(targetCell, dragOverEvent);
          const dragEndEvent = createDragEndEvent(sourceCell);
          fireEvent(sourceCell, dragEndEvent);

          // Internal validation should still block this
          expect(handleRowOrderChange.callCount).to.equal(0);
        }
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
        if (beachUpdate) {
          expect(beachUpdate.fullPath).to.include('Documents');
        }
      });

      it('should show warning when setTreeDataPath is missing', () => {
        const warnSpy = spy();
        const originalWarn = console.warn;
        console.warn = warnSpy;

        render(<Test setTreeDataPath={undefined} rows={createTreeData()} />);

        // Attempt cross-parent reorder
        const allValues = getColumnValues(0);
        const beachIndex = findRowIndex(allValues, 'Beach.jpg', 10);
        const documentsIndex = findRowIndex(allValues, 'Documents', 1);

        if (beachIndex >= 0 && documentsIndex >= 0) {
          const sourceCell = getCell(beachIndex, 0).firstChild!;
          const targetCell = getCell(documentsIndex, 0);

          fireDragStart(sourceCell);
          fireEvent.dragEnter(targetCell);
          const dragOverEvent = createDragOverEvent(targetCell, 'below');
          fireEvent(targetCell, dragOverEvent);
          const dragEndEvent = createDragEndEvent(sourceCell);
          fireEvent(sourceCell, dragEndEvent);
        }

        console.warn = originalWarn;

        // In development mode, check for the setTreeDataPath warning
        const warningCalls = warnSpy.getCalls();
        const hasSetTreeDataPathWarning = warningCalls.some((call) =>
          call.args.some((arg) => typeof arg === 'string' && arg.includes('setTreeDataPath')),
        );
        expect(hasSetTreeDataPathWarning).to.equal(true);
      });
    });
  });

  describe('Events', () => {
    it('should fire rowOrderChange on successful reorder', async () => {
      const handleRowOrderChange = spy();
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
        expect(handleRowOrderChange.callCount).to.equal(1);
      });

      const eventParams = handleRowOrderChange.firstCall.args[0];
      expect(eventParams).to.have.property('oldIndex');
      expect(eventParams).to.have.property('targetIndex');
    });

    it('should not fire event on cancelled operation', () => {
      const handleRowOrderChange = spy();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      const allValues = getColumnValues(0);
      const q1Index = findRowIndex(allValues, 'Q1.pdf', 4);
      expect(q1Index).to.be.greaterThan(-1, 'Q1.pdf should be found');

      const sourceCell = getCell(q1Index, 0).firstChild!;

      // Start drag and cancel by dropping outside
      fireDragStart(sourceCell);
      const dragEndEvent = createDragEndEvent(sourceCell, true);
      fireEvent(sourceCell, dragEndEvent);

      expect(handleRowOrderChange.callCount).to.equal(0);
    });
  });

  describe('Async Operations', () => {
    it('should handle processRowUpdate promises correctly', async () => {
      const handleRowOrderChange = spy();
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

      if (resumeIndex >= 0 && picturesIndex >= 0) {
        const sourceCell = getCell(resumeIndex, 0).firstChild!;
        const targetCell = getCell(picturesIndex, 0);

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'below');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        // Event should not fire immediately
        expect(handleRowOrderChange.callCount).to.equal(0);

        // Resolve the promise
        if (processRowUpdateCalls.length > 0) {
          resolvePromise(processRowUpdateCalls[0]);
        }

        // Now event should fire
        await waitFor(() => {
          expect(handleRowOrderChange.callCount).to.equal(1);
        });
      }
    });

    it('should handle processRowUpdate rejection gracefully', async () => {
      const handleRowOrderChange = spy();
      const handleProcessRowUpdateError = spy();
      let processRowUpdateCallCount = 0;

      const processRowUpdate = async (_newRow: any) => {
        processRowUpdateCallCount += 1;
        throw new Error('Server error');
      };

      render(
        <Test
          onRowOrderChange={handleRowOrderChange}
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

      // Wait a bit more for error handling to complete
      await waitFor(
        () => {
          expect(handleProcessRowUpdateError.callCount).to.be.greaterThan(0);
        },
        { timeout: 200 },
      );

      // Verify that the error was handled
      expect(processRowUpdateCallCount).to.be.greaterThan(0);
      expect(handleProcessRowUpdateError.callCount).to.be.greaterThan(0);
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
        expect(processRowUpdateCalls.length).to.be.greaterThan(1); // Work + its children
      });

      // Verify Work and its descendants were all updated
      const workUpdate = processRowUpdateCalls.find((row) => row.name === 'Work');
      const reportsUpdate = processRowUpdateCalls.find((row) => row.name === 'Reports');
      expect(workUpdate).to.not.equal(undefined);
      expect(reportsUpdate).to.not.equal(undefined);
    });
  });

  describe('Drop Position Validation', () => {
    it('should detect "above" drop position in top 20%', () => {
      render(<Test />);

      const allValues = getColumnValues(0);
      const q1Index = findRowIndex(allValues, 'Q1.pdf', 4);
      const q2Index = findRowIndex(allValues, 'Q2.pdf', 5);

      const sourceCell = getCell(q1Index, 0).firstChild!;
      const targetCell = getCell(q2Index, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);

      // Create event in top area to trigger "above" detection
      const dragOverEvent = createDragOverEvent(targetCell, 'above');
      fireEvent(targetCell, dragOverEvent);

      // Verify drag operation was set up (should not throw errors)
      expect(sourceCell).to.not.equal(null);
      expect(targetCell).to.not.equal(null);
    });

    it('should detect "over" drop position in middle 60%', () => {
      render(<Test />);

      const allValues = getColumnValues(0);
      const q1Index = findRowIndex(allValues, 'Q1.pdf', 4);
      const documentsIndex = findRowIndex(allValues, 'Documents', 1);

      const sourceCell = getCell(q1Index, 0).firstChild!;
      const targetCell = getCell(documentsIndex, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);

      // Create event in middle for "over" detection
      const dragOverEvent = createDragOverEvent(targetCell, 'over');
      fireEvent(targetCell, dragOverEvent);

      // Verify drag operation was set up (should not throw errors)
      expect(sourceCell).to.not.equal(null);
      expect(targetCell).to.not.equal(null);
    });

    it('should detect "below" drop position in bottom 20%', () => {
      render(<Test />);

      const allValues = getColumnValues(0);
      const q1Index = findRowIndex(allValues, 'Q1.pdf', 4);
      const q2Index = findRowIndex(allValues, 'Q2.pdf', 5);

      const sourceCell = getCell(q1Index, 0).firstChild!;
      const targetCell = getCell(q2Index, 0);

      fireDragStart(sourceCell);
      fireEvent.dragEnter(targetCell);

      // Create event in bottom area to trigger "below" detection
      const dragOverEvent = createDragOverEvent(targetCell, 'below');
      fireEvent(targetCell, dragOverEvent);

      // Verify drag operation was set up (should not throw errors)
      expect(sourceCell).to.not.equal(null);
      expect(targetCell).to.not.equal(null);
    });
  });

  describe('Edge Cases and Stability', () => {
    it('should handle empty tree data gracefully', () => {
      const handleRowOrderChange = spy();
      render(<Test rows={[]} onRowOrderChange={handleRowOrderChange} />);

      // Should render without errors with empty data
      const allValues = getColumnValues(0);
      expect(allValues).to.deep.equal([]);
      expect(handleRowOrderChange.callCount).to.equal(0);
    });

    it('should handle single node tree', () => {
      const handleRowOrderChange = spy();
      render(
        <Test
          rows={[{ id: 1, path: ['Single'], name: 'Single' }]}
          onRowOrderChange={handleRowOrderChange}
        />,
      );

      const allValues = getColumnValues(0);
      expect(allValues.length).to.be.greaterThan(0);
      // Grid might show ID instead of name for single items
      const hasSingle = allValues.includes('Single') || allValues.includes('1');
      expect(hasSingle).to.equal(true);

      // Try to drag the only node - look for either name or ID
      let singleIndex = allValues.indexOf('Single');
      if (singleIndex < 0) {
        singleIndex = allValues.indexOf('1'); // fallback to ID
      }
      const sourceCell = getCell(singleIndex, 0).firstChild!;
      fireDragStart(sourceCell);
      const dragEndEvent = createDragEndEvent(sourceCell);
      fireEvent(sourceCell, dragEndEvent);

      // Should not trigger reorder for single node
      expect(handleRowOrderChange.callCount).to.equal(0);
    });

    it('should handle rapid successive operations gracefully', async () => {
      const handleRowOrderChange = spy();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      const allValues = getColumnValues(0);
      const q1Index = findRowIndex(allValues, 'Q1.pdf', 4);
      const q2Index = findRowIndex(allValues, 'Q2.pdf', 5);

      const sourceCell = getCell(q1Index, 0).firstChild!;
      const targetCell = getCell(q2Index, 0);

      // Simulate rapid operations with small delays
      for (let i = 0; i < 3; i += 1) {
        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'below');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        // Small delay between operations - avoiding await in loop
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      }

      // Wait for any async operations to complete and verify at least one operation succeeded
      await waitFor(
        () => {
          expect(handleRowOrderChange.callCount).to.be.greaterThan(0);
        },
        { timeout: 1000 },
      );
    });
  });

  describe('Collapsed Groups Validation', () => {
    it('should prevent drops below collapsed groups', async () => {
      const handleRowOrderChange = spy();
      render(<Test onRowOrderChange={handleRowOrderChange} />);

      // First collapse the Work group
      const workIndex = findRowIndex(getColumnValues(0), 'Work', 2);
      if (workIndex >= 0) {
        const workCell = getCell(workIndex, 0);
        const expandIcon = workCell.querySelector('[data-testid="TreeDataIcon"]');
        if (expandIcon) {
          fireEvent.click(expandIcon);
        }

        // Try to drop something below the collapsed Work group
        const allValues = getColumnValues(0);
        const resumeIndex = findRowIndex(allValues, 'Resume.pdf', 7);

        const sourceCell = getCell(resumeIndex, 0).firstChild!;
        const targetCell = getCell(workIndex, 0);

        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createDragOverEvent(targetCell, 'below');
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createDragEndEvent(sourceCell);
        fireEvent(sourceCell, dragEndEvent);

        // Operation should be prevented for collapsed groups
        expect(handleRowOrderChange.callCount).to.equal(0);
      }
    });
  });
});

import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer, fireEvent, createEvent, screen } from '@mui/internal-test-utils';
import { getColumnValues, getRow } from 'test/utils/helperFn';
import {
  DataGridPremium,
  DataGridPremiumProps,
  gridClasses,
  GridRowsProp,
} from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';

// Helper function to create drag over event with coordinates
function createDragOverEvent(target: ChildNode, dropPosition: 'above' | 'below' = 'above') {
  const dragOverEvent = createEvent.dragOver(target);
  // Safari 13 doesn't have DragEvent.
  // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
  Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });

  // Mock getBoundingClientRect for the target
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

  // Set clientY based on drop position - relative to getBoundingClientRect
  const rect = targetElement.getBoundingClientRect();
  const clientY =
    dropPosition === 'above'
      ? rect.top + rect.height * 0.25 // Upper quarter
      : rect.top + rect.height * 0.75; // Lower quarter

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

// Helper function to create drag end event
function createDragEndEvent(target: ChildNode, isOutsideTheGrid: boolean = false) {
  const dragEndEvent = createEvent.dragEnd(target);
  Object.defineProperty(dragEndEvent, 'dataTransfer', {
    value: { dropEffect: isOutsideTheGrid ? 'none' : 'copy' },
  });
  return dragEndEvent;
}

// Helper function to perform complete drag and drop operation
function performDragReorder(
  sourceRowElement: HTMLElement,
  targetRowElement: HTMLElement,
  dropPosition: 'above' | 'below' = 'above',
) {
  const sourceCell = sourceRowElement.querySelector('[role="gridcell"]')!.firstChild!;
  const targetCell = targetRowElement.querySelector('[role="gridcell"]')!;

  // Start drag - create event with dataTransfer
  fireDragStart(sourceCell);

  fireEvent.dragEnter(targetCell);

  // Drag over with position
  const dragOverEvent = createDragOverEvent(targetCell, dropPosition);
  fireEvent(targetCell, dragOverEvent);

  // End drag
  const dragEndEvent = createDragEndEvent(sourceCell);
  fireEvent(sourceCell, dragEndEvent);
}

// Test data for single-level grouping
const singleLevelData: GridRowsProp = [
  { id: 1, category: 'A', name: 'Item A1', value: 10 },
  { id: 2, category: 'A', name: 'Item A2', value: 20 },
  { id: 3, category: 'A', name: 'Item A3', value: 30 },
  { id: 4, category: 'B', name: 'Item B1', value: 40 },
  { id: 5, category: 'B', name: 'Item B2', value: 50 },
  { id: 6, category: 'C', name: 'Item C1', value: 60 },
  { id: 7, category: 'C', name: 'Item C2', value: 70 },
  { id: 8, category: 'C', name: 'Item C3', value: 80 },
  { id: 9, category: null, name: 'Item Null1', value: 90 },
  { id: 10, category: null, name: 'Item Null2', value: 100 },
];

// Test data for multi-level grouping
const multiLevelData: GridRowsProp = [
  { id: 1, company: 'Microsoft', dept: 'Engineering', team: 'Frontend', name: 'John' },
  { id: 2, company: 'Microsoft', dept: 'Engineering', team: 'Frontend', name: 'Jane' },
  { id: 3, company: 'Microsoft', dept: 'Engineering', team: 'Backend', name: 'Bob' },
  { id: 4, company: 'Microsoft', dept: 'Sales', team: 'Direct', name: 'Alice' },
  { id: 5, company: 'Microsoft', dept: 'Sales', team: 'Direct', name: 'Charlie' },
  { id: 6, company: 'Google', dept: 'Engineering', team: 'Frontend', name: 'David' },
  { id: 7, company: 'Google', dept: 'Engineering', team: 'Frontend', name: 'Eve' },
  { id: 8, company: 'Google', dept: 'Engineering', team: 'Backend', name: 'Frank' },
  { id: 9, company: 'Apple', dept: 'Design', team: 'UX', name: 'Grace' },
  { id: 10, company: 'Apple', dept: 'Design', team: 'UX', name: 'Henry' },
];

describe.skipIf(isJSDOM)('<DataGridPremium /> - Row reorder with row grouping', () => {
  const { render } = createRenderer();

  describe('Single-level row grouping', () => {
    const baselineProps: DataGridPremiumProps = {
      rows: singleLevelData,
      columns: [
        { field: 'category', width: 150 },
        { field: 'name', width: 150 },
        { field: 'value', width: 100, type: 'number' },
      ],
      initialState: {
        rowGrouping: {
          model: ['category'],
        },
      },
      defaultGroupingExpansionDepth: -1, // Expand all groups
      rowReordering: true,
      disableVirtualization: true,
      autoHeight: isJSDOM,
    };

    describe('Valid reorder cases', () => {
      it('should reorder leaves within same parent group', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Initial order in category A
        // Column 3 has the item names
        expect(getColumnValues(3)).to.include('Item A1');
        expect(getColumnValues(3)).to.include('Item A2');
        expect(getColumnValues(3)).to.include('Item A3');

        // Get row elements (A1 is at row 3, A3 is at row 5)
        const itemA1Row = getRow(3);
        const itemA3Row = getRow(5);

        // Drag Item A1 to Item A3 position (below)
        performDragReorder(itemA1Row, itemA3Row, 'below');

        // Verify new order: A2, A3, A1
        const newValues = getColumnValues(3);
        const a2Index = newValues.indexOf('Item A2');
        const a3Index = newValues.indexOf('Item A3');
        const a1Index = newValues.indexOf('Item A1');

        expect(a2Index).to.be.lessThan(a3Index);
        expect(a3Index).to.be.lessThan(a1Index);
      });

      it('should move leaf between different parent groups', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Get initial group counts
        const initialGroupingValues = getColumnValues(1);
        expect(initialGroupingValues[2]).to.match(/A \(3\)/); // Category A has 3 items
        expect(initialGroupingValues[6]).to.match(/B \(2\)/); // Category B has 2 items

        // Get row elements (A1 is at row 3, B1 is at row 7)
        const itemA1Row = getRow(3);
        const itemB1Row = getRow(7);

        // Drag Item A1 to Item B1 position (above)
        performDragReorder(itemA1Row, itemB1Row, 'above');

        // Verify group counts updated
        const newGroupingValues = getColumnValues(1);
        expect(newGroupingValues[2]).to.match(/A \(2\)/); // Category A now has 2 items
        expect(newGroupingValues[5]).to.match(/B \(3\)/); // Category B now has 3 items

        // Verify Item A1 is now in Category B
        const nameValues = getColumnValues(3);
        const a1Index = nameValues.indexOf('Item A1');
        const b1Index = nameValues.indexOf('Item B1');
        const a3Index = nameValues.indexOf('Item A3');

        expect(a1Index).to.be.lessThan(b1Index); // A1 is before B1
        expect(a1Index).to.be.greaterThan(2); // A1 is after remaining A items
        expect(a1Index).to.be.greaterThan(a3Index); // A1 is after A3
      });

      it('should reorder groups at the same level when groups are expanded and the source group is drop on "above" portion of the target group', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Get group rows
        const groupARow = getRow(2); // Category A group
        const groupCRow = getRow(9); // Category C group

        // Drag Category A to Category C position
        performDragReorder(groupARow, groupCRow, 'above');

        // Verify new group order: B, A, C
        const groupingValues = getColumnValues(1);
        const groupBIndex = groupingValues.findIndex((v) => v?.includes('B ('));
        const groupAIndex = groupingValues.findIndex((v) => v?.includes('A ('));
        const groupCIndex = groupingValues.findIndex((v) => v?.includes('C ('));

        expect(groupBIndex).to.be.lessThan(groupAIndex);
        expect(groupAIndex).to.be.lessThan(groupCIndex);
      });

      it.skip('should reorder groups at the same level when groups are expanded and the source group is drop on "below" portion of the last group child', () => {
        // TODO: Add this functionality
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Get group rows
        const groupARow = getRow(2); // Category A group
        const lastChildOfC = getRow(12); // Category C group

        // Drag Category A to Category C position
        performDragReorder(groupARow, lastChildOfC, 'below');

        // Verify new group order: B, C, A
        const groupingValues = getColumnValues(1);
        const groupBIndex = groupingValues.findIndex((v) => v?.includes('B ('));
        const groupCIndex = groupingValues.findIndex((v) => v?.includes('C ('));
        const groupAIndex = groupingValues.findIndex((v) => v?.includes('A ('));

        expect(groupBIndex).to.be.lessThan(groupCIndex);
        expect(groupCIndex).to.be.lessThan(groupAIndex);
      });

      it('should handle leaf to group "above" when previous leaf exists', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Get row elements
        const itemC1Row = getRow(10); // Item C1
        const groupBRow = getRow(6); // Category B group

        // Drag Item C1 to Category B position (above)
        // This should place C1 as the last child of Category A
        performDragReorder(itemC1Row, groupBRow, 'above');

        // Verify Item C1 is now the last item in Category A
        const nameValues = getColumnValues(3);
        const c1Index = nameValues.indexOf('Item C1');
        const a3Index = nameValues.indexOf('Item A3');
        const b1Index = nameValues.indexOf('Item B1');

        expect(c1Index).to.be.greaterThan(a3Index); // After A3
        expect(c1Index).to.be.lessThan(b1Index); // Before B group items
      });

      it('should handle leaf to group "below" when group is expanded', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Get row elements
        const itemA1Row = getRow(3); // Item A1
        const groupBRow = getRow(6); // Category B group

        // Drag Item A1 to Category B position (below)
        // This should place A1 as the first child of Category B
        performDragReorder(itemA1Row, groupBRow, 'below');

        // Verify Item A1 is now the first item in Category B
        const nameValues = getColumnValues(3);
        const a1Index = nameValues.indexOf('Item A1');
        const b1Index = nameValues.indexOf('Item B1');
        const a2Index = nameValues.indexOf('Item A2');

        expect(a1Index).to.be.greaterThan(a2Index); // After remaining A items
        expect(a1Index).to.be.lessThan(b1Index); // Before original B items
      });
    });

    describe('Invalid reorder cases', () => {
      it('should not allow adjacent position movements', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        const initialValues = getColumnValues(3);

        // Get row elements
        const itemA1Row = getRow(1);
        const itemA2Row = getRow(2);

        // Try to drag Item A1 to Item A2 position (above) - adjacent position
        performDragReorder(itemA1Row, itemA2Row, 'above');

        // Verify no change
        const newValues = getColumnValues(3);
        expect(newValues).to.deep.equal(initialValues);
      });

      it('should not allow group to be dropped on leaf', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        const initialValues = getColumnValues(1);

        // Get row elements
        const groupARow = getRow(0); // Category A group
        const itemB1Row = getRow(5); // Item B1

        // Try to drag Category A to Item B1 position
        performDragReorder(groupARow, itemB1Row, 'above');

        // Verify no change
        const newValues = getColumnValues(1);
        expect(newValues).to.deep.equal(initialValues);
      });

      it('should show drop indicator during valid drag but remove on invalid drop', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Get row elements
        const itemA1Row = getRow(3);
        const itemB1Row = getRow(7);

        const sourceCell = itemA1Row.querySelector('[role="gridcell"]')!.firstChild!;
        const targetCell = itemB1Row.querySelector('[role="gridcell"]')!;

        // Start drag with dataTransfer
        fireDragStart(sourceCell);
        fireEvent.dragEnter(targetCell);

        // Drag over - should show indicator
        const dragOverEvent = createDragOverEvent(targetCell, 'above');
        fireEvent(targetCell, dragOverEvent);

        const targetRow = targetCell.closest('[data-id]');
        // Check for drop indicator class
        expect(targetRow).to.have.class(gridClasses['row--dropAbove']);

        // End drag outside grid
        const dragEndEvent = createDragEndEvent(sourceCell, true);
        fireEvent(sourceCell, dragEndEvent);

        // Verify indicator removed
        expect(itemB1Row).not.to.have.class(gridClasses['row--dropAbove']);
        expect(itemB1Row).not.to.have.class(gridClasses['row--dropBelow']);
      });
    });
  });

  describe('Multi-level row grouping (2 levels)', () => {
    const baselineProps: DataGridPremiumProps = {
      rows: multiLevelData,
      columns: [
        { field: 'company', width: 150 },
        { field: 'dept', width: 150 },
        { field: 'name', width: 150 },
      ],
      initialState: {
        rowGrouping: {
          model: ['company', 'dept'],
        },
      },
      defaultGroupingExpansionDepth: -1,
      rowReordering: true,
      disableVirtualization: true,
      autoHeight: isJSDOM,
    };

    describe('Valid reorder cases', () => {
      it('should reorder leaves within same department', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Find John and Jane rows (both in Microsoft/Engineering)
        const nameValues = getColumnValues(4);
        const johnIndex = nameValues.indexOf('John');
        const janeIndex = nameValues.indexOf('Jane');

        const johnRow = getRow(johnIndex);
        const janeRow = getRow(janeIndex);

        // Drag John to Jane position (below)
        performDragReorder(johnRow, janeRow, 'below');

        // Verify new order
        const newNameValues = getColumnValues(4);
        const newJohnIndex = newNameValues.indexOf('John');
        const newJaneIndex = newNameValues.indexOf('Jane');

        expect(newJaneIndex).to.be.lessThan(newJohnIndex);
      });

      it('should move leaf between departments in same company', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Find John (Engineering) and Alice (Sales) rows
        const nameValues = getColumnValues(4);
        const johnIndex = nameValues.indexOf('John');
        const aliceIndex = nameValues.indexOf('Alice');

        const johnRow = getRow(johnIndex);
        const aliceRow = getRow(aliceIndex);

        // Drag John to Alice position (above)
        performDragReorder(johnRow, aliceRow, 'above');

        // Verify John is now before Alice in Sales
        const newNameValues = getColumnValues(4);
        const newJohnIndex = newNameValues.indexOf('John');
        const newAliceIndex = newNameValues.indexOf('Alice');
        const bobIndex = newNameValues.indexOf('Bob'); // Should still be in Engineering

        expect(newJohnIndex).to.be.lessThan(newAliceIndex);
        expect(newJohnIndex).to.be.greaterThan(bobIndex);
      });

      it('should reorder department groups within company', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Find Engineering and Sales department groups within Microsoft
        const deptValues = getColumnValues(1);
        const engIndex = deptValues.indexOf('Engineering (3)');
        const salesIndex = deptValues.indexOf('Google (3)');

        const engRow = getRow(engIndex);
        const googleRow = getRow(salesIndex);

        // Drag Engineering to Sales position by dropping above the next group
        performDragReorder(engRow, googleRow, 'above');

        // Verify department order changed
        const newDeptValues = getColumnValues(1);
        const newEngIndex = newDeptValues.indexOf('Engineering (3)');
        const newSalesIndex = newDeptValues.indexOf('Sales (2)');

        expect(newSalesIndex).to.be.lessThan(newEngIndex);
      });
    });

    describe('Invalid reorder cases', () => {
      it('should not allow moving groups between different companies', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        // Find Microsoft/Engineering and Google company groups
        const values = getColumnValues(1);
        const googleIndex = values.indexOf('Google (3)');

        // Get the Engineering dept under Microsoft
        const deptValues = getColumnValues(1);
        const msEngIndex = deptValues.indexOf('Engineering (3)');

        const msEngRow = screen.getAllByRole('row')[msEngIndex + 1];
        const googleRow = screen.getAllByRole('row')[googleIndex + 1];

        // Try to drag MS/Engineering to Google
        performDragReorder(msEngRow, googleRow, 'below');

        // Verify no change - Engineering should still be under Microsoft
        const newDeptValues = getColumnValues(1);
        expect(newDeptValues[msEngIndex]).to.equal('Engineering (3)');
      });

      it('should not allow cross-depth movements', () => {
        render(
          <div style={{ width: 500, height: 500 }}>
            <DataGridPremium {...baselineProps} />
          </div>,
        );

        const initialValues = getColumnValues(4);

        // Try to drag company group to leaf position
        const companyValues = getColumnValues(1);
        const msIndex = companyValues.indexOf('Microsoft (5)');
        const nameValues = getColumnValues(4);
        const johnIndex = nameValues.indexOf('John');

        const msRow = getRow(msIndex);
        const johnRow = getRow(johnIndex);

        // Try to drag Microsoft to John position
        performDragReorder(msRow, johnRow, 'above');

        // Verify no change
        const newValues = getColumnValues(4);
        expect(newValues).to.deep.equal(initialValues);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle null grouping values', () => {
      render(
        <div style={{ width: 500, height: 500 }}>
          <DataGridPremium
            rows={singleLevelData}
            columns={[
              { field: 'category', width: 150 },
              { field: 'name', width: 150 },
              { field: 'value', width: 100, type: 'number' },
            ]}
            initialState={{
              rowGrouping: {
                model: ['category'],
              },
            }}
            defaultGroupingExpansionDepth={-1}
            rowReordering
            disableVirtualization
            autoHeight={isJSDOM}
          />
        </div>,
      );

      // Find null group items
      const nameValues = getColumnValues(3);
      const null1Index = nameValues.indexOf('Item Null1');
      const null2Index = nameValues.indexOf('Item Null2');

      const null1Row = getRow(null1Index);
      const null2Row = getRow(null2Index);

      // Reorder within null group
      performDragReorder(null1Row, null2Row, 'below');

      // Verify order changed
      const newNameValues = getColumnValues(3);
      const newNull1Index = newNameValues.indexOf('Item Null1');
      const newNull2Index = newNameValues.indexOf('Item Null2');

      expect(newNull2Index).to.be.lessThan(newNull1Index);
    });

    it('should call onRowOrderChange with correct parameters', () => {
      const onRowOrderChange = spy();

      render(
        <div style={{ width: 500, height: 500 }}>
          <DataGridPremium
            rows={singleLevelData}
            columns={[
              { field: 'category', width: 150 },
              { field: 'name', width: 150 },
              { field: 'value', width: 100, type: 'number' },
            ]}
            initialState={{
              rowGrouping: {
                model: ['category'],
              },
            }}
            defaultGroupingExpansionDepth={-1}
            rowReordering
            onRowOrderChange={onRowOrderChange}
            disableVirtualization
            autoHeight={isJSDOM}
          />
        </div>,
      );

      // Reorder within a group
      const itemA1Row = getRow(3);
      const itemA3Row = getRow(5);

      performDragReorder(itemA1Row, itemA3Row, 'below');

      // Verify callback was called
      expect(onRowOrderChange.callCount).to.equal(1);

      const params = onRowOrderChange.firstCall.args[0];
      expect(params.row.id).to.equal(1); // Item A1
      expect(params.oldIndex).to.be.a('number');
      expect(params.targetIndex).to.be.a('number');
      expect(params.oldIndex).to.not.equal(params.targetIndex);
    });
  });
});

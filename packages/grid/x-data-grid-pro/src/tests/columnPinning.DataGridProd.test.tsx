import * as React from 'react';
import {
  DataGridPro,
  GridApiRef,
  useGridApiRef,
  GridComponentProps,
  gridClasses,
  GridPinnedPosition,
} from '@mui/x-data-grid-pro';
import { spy, useFakeTimers } from 'sinon';
import { expect } from 'chai';
import { createRenderer, fireEvent, screen, createEvent } from '@material-ui/monorepo/test/utils';
import { getCell, getColumnHeaderCell, getColumnHeadersTextContent } from 'test/utils/helperFn';
import { useData } from 'storybook/src/hooks/useData';

// TODO Move to utils
// Fix https://github.com/mui-org/material-ui-x/pull/2085/files/058f56ac3c729b2142a9a28b79b5b13535cdb819#diff-db85480a519a5286d7341e9b8957844762cf04cdacd946331ebaaaff287482ec
function createDragOverEvent(target: ChildNode) {
  const dragOverEvent = createEvent.dragOver(target);
  // Safari 13 doesn't have DragEvent.
  // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
  Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });
  Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });

  return dragOverEvent;
}

describe('<DataGridPro /> - Column pinning', () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  const { render } = createRenderer();

  let apiRef: GridApiRef;

  const TestCase = ({
    nbCols = 20,
    ...other
  }: Partial<GridComponentProps> & { nbCols?: number }) => {
    apiRef = useGridApiRef();
    const data = useData(1, nbCols);
    return (
      <div style={{ width: 302, height: 300 }}>
        <DataGridPro {...data} apiRef={apiRef} {...other} />
      </div>
    );
  };

  it('should scroll when the next cell to focus is covered by the left pinned columns', () => {
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    virtualScroller.scrollLeft = 100;
    virtualScroller.dispatchEvent(new Event('scroll'));
    const cell = getCell(0, 2);
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
    fireEvent.keyDown(cell, { key: 'ArrowLeft' });
    expect(virtualScroller.scrollLeft).to.equal(0);
  });

  it('should scroll when the next cell to focus is covered by the right pinned columns', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
    render(<TestCase initialState={{ pinnedColumns: { right: ['price16M'] } }} />);
    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    expect(virtualScroller.scrollLeft).to.equal(0);
    const cell = getCell(0, 1);
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
    fireEvent.keyDown(cell, { key: 'ArrowRight' });
    expect(virtualScroller.scrollLeft).to.equal(100);
  });

  it('should apply .Mui-hovered on the entire row when the mouse enters the row', () => {
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }} />);
    const leftColumns = document.querySelector(`.${gridClasses['pinnedColumns--left']}`);
    const rightColumns = document.querySelector(`.${gridClasses['pinnedColumns--right']}`);
    const renderZone = document.querySelector(`.${gridClasses.virtualScrollerRenderZone}`);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    const cell = getCell(0, 0);
    fireEvent.mouseEnter(cell);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
  });

  it('should remove .Mui-hovered from the entire row when the mouse leaves the row', () => {
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }} />);
    const cell = getCell(0, 0);
    fireEvent.mouseEnter(cell);
    const leftColumns = document.querySelector(`.${gridClasses['pinnedColumns--left']}`);
    const rightColumns = document.querySelector(`.${gridClasses['pinnedColumns--right']}`);
    const renderZone = document.querySelector(`.${gridClasses.virtualScrollerRenderZone}`);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).to.have.class('Mui-hovered');
    fireEvent.mouseLeave(cell);
    expect(leftColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(rightColumns!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
    expect(renderZone!.querySelector('[data-rowindex="0"]')).not.to.have.class('Mui-hovered');
  });

  it('should update the render zone offset after resize', () => {
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
    const renderZone = document.querySelector(
      `.${gridClasses.virtualScrollerRenderZone}`,
    ) as HTMLDivElement;
    // @ts-expect-error need to migrate helpers to TypeScript
    expect(renderZone).toHaveInlineStyle({ transform: 'translate3d(100px, 0px, 0px)' });
    const columnHeader = getColumnHeaderCell(0);
    const separator = columnHeader.querySelector(`.${gridClasses['columnSeparator--resizable']}`);
    fireEvent.mouseDown(separator, { clientX: 100 });
    fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
    fireEvent.mouseUp(separator);
    // @ts-expect-error need to migrate helpers to TypeScript
    expect(renderZone).toHaveInlineStyle({ transform: 'translate3d(110px, 0px, 0px)' });
  });

  it('should update the column headers offset after resize', () => {
    render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
    const columnHeadersInner = document.querySelector(
      `.${gridClasses.columnHeadersInner}`,
    ) as HTMLDivElement;
    // @ts-expect-error need to migrate helpers to TypeScript
    expect(columnHeadersInner).toHaveInlineStyle({ transform: 'translate3d(100px, 0px, 0px)' });
    const columnHeader = getColumnHeaderCell(0);
    const separator = columnHeader.querySelector(`.${gridClasses['columnSeparator--resizable']}`);
    fireEvent.mouseDown(separator, { clientX: 100 });
    fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
    fireEvent.mouseUp(separator);
    // @ts-expect-error need to migrate helpers to TypeScript
    expect(columnHeadersInner).toHaveInlineStyle({ transform: 'translate3d(110px, 0px, 0px)' });
  });

  it('should not allow to drag pinned columns', () => {
    render(
      <TestCase
        nbCols={3}
        initialState={{ pinnedColumns: { left: ['id'], right: ['price1M'] } }}
      />,
    );
    expect(getColumnHeaderCell(0).firstChild).to.have.attribute('draggable', 'false');
    expect(getColumnHeaderCell(2).firstChild).to.have.attribute('draggable', 'false');
  });

  it('should not allow to drop a column on top of a pinned column', () => {
    render(<TestCase nbCols={3} initialState={{ pinnedColumns: { right: ['price1M'] } }} />);
    expect(
      document.querySelector('.MuiDataGrid-pinnedColumnHeaders--right')?.textContent,
    ).to.deep.equal('1M');
    const dragCol = getColumnHeaderCell(1).firstChild!;
    const targetCell = getCell(0, 2)!;
    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(
      document.querySelector('.MuiDataGrid-pinnedColumnHeaders--right')?.textContent,
    ).to.deep.equal('1M');
  });

  it('should filter out invalid columns when blocking a column from being dropped', () => {
    render(<TestCase nbCols={3} initialState={{ pinnedColumns: { left: ['foo', 'bar'] } }} />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair', '1M']);
    const dragCol = getColumnHeaderCell(0).firstChild!;
    const targetCell = getCell(0, 1)!;
    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['Currency Pair', 'id', '1M']);
  });

  describe('props: onPinnedColumnsChange', () => {
    it('shoull call when a column is pinned', () => {
      const handlePinnedColumnsChange = spy();
      render(<TestCase onPinnedColumnsChange={handlePinnedColumnsChange} />);
      apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left);
      expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
        left: ['currencyPair'],
        right: [],
      });
      apiRef.current.pinColumn('price17M', GridPinnedPosition.right);
      expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
        left: ['currencyPair'],
        right: ['price17M'],
      });
    });

    it('shoull not change the pinned columns when it is called', () => {
      const handlePinnedColumnsChange = spy();
      render(
        <TestCase
          pinnedColumns={{ left: ['currencyPair'] }}
          onPinnedColumnsChange={handlePinnedColumnsChange}
        />,
      );
      expect(
        document.querySelectorAll(`.${gridClasses['pinnedColumns--left']} [role="cell"]`),
      ).to.have.length(1);
      apiRef.current.pinColumn('price17M', GridPinnedPosition.left);
      expect(
        document.querySelectorAll(`.${gridClasses['pinnedColumns--left']} [role="cell"]`),
      ).to.have.length(1);
      expect(handlePinnedColumnsChange.lastCall.args[0]).to.deep.equal({
        left: ['currencyPair', 'price17M'],
        right: [],
      });
    });
  });

  describe('props: pinnedColumns', () => {
    it('shoull pin the columns specified', () => {
      render(<TestCase pinnedColumns={{ left: ['currencyPair'] }} />);
      const leftColumns = document.querySelector(
        `.${gridClasses['pinnedColumns--left']}`,
      ) as HTMLDivElement;
      expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
    });

    it("should not change the pinned columns if the prop didn't change", () => {
      render(<TestCase pinnedColumns={{ left: ['currencyPair'] }} />);
      expect(
        document.querySelector(
          `.${gridClasses['pinnedColumns--left']} [data-field="currencyPair"]`,
        ),
      ).not.to.equal(null);
      apiRef.current.pinColumn('price17M', GridPinnedPosition.left);
      expect(
        document.querySelector(
          `.${gridClasses['pinnedColumns--left']} [data-field="currencyPair"]`,
        ),
      ).not.to.equal(null);
    });

    it('shoull filter our duplicated columns', () => {
      render(<TestCase pinnedColumns={{ left: ['currencyPair'], right: ['currencyPair'] }} />);
      const leftColumns = document.querySelector(
        `.${gridClasses['pinnedColumns--left']}`,
      ) as HTMLDivElement;
      expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      expect(document.querySelector(`.${gridClasses['pinnedColumns--right']}`)).to.equal(null);
    });
  });

  describe('props: disableColumnPinning', () => {
    it('should not add any button to the column menu', () => {
      render(<TestCase disableColumnPinning />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]');
      fireEvent.click(menuIconButton);
      expect(screen.queryByRole('menuitem', { name: 'Pin to left' })).to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Pin to right' })).to.equal(null);
    });

    ['pinColumn', 'unpinColumn', 'getPinnedColumns', 'setPinnedColumns', 'isColumnPinned'].forEach(
      (methodName) => {
        it(`should throw an error when calling \`apiRef.current.${methodName}\``, () => {
          render(<TestCase disableColumnPinning />);
          expect(() => {
            apiRef.current[methodName]();
          }).to.throw();
        });
      },
    );
  });

  describe('apiRef', () => {
    it('should reorder the columns to render the left pinned columns before all other columns', () => {
      render(<TestCase initialState={{ pinnedColumns: { left: ['currencyPair', 'price1M'] } }} />);
      const leftColumns = document.querySelector(
        `.${gridClasses['pinnedColumns--left']}`,
      ) as HTMLDivElement;
      const renderZone = document.querySelector(
        `.${gridClasses.virtualScrollerRenderZone}`,
      ) as HTMLDivElement;
      expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      expect(leftColumns.querySelector('[data-field="price1M"]')).not.to.equal(null);
      expect(renderZone.querySelector('[data-field="currencyPair"]')).to.equal(null);
      expect(renderZone.querySelector('[data-field="price1M"]')).to.equal(null);
    });

    it('should reorder the columns to render the right pinned columns after all other columns', () => {
      render(<TestCase initialState={{ pinnedColumns: { right: ['price16M', 'price17M'] } }} />);
      const rightColumns = document.querySelector(
        `.${gridClasses['pinnedColumns--right']}`,
      ) as HTMLDivElement;
      const renderZone = document.querySelector(
        `.${gridClasses.virtualScrollerRenderZone}`,
      ) as HTMLDivElement;
      expect(rightColumns.querySelector('[data-field="price16M"]')).not.to.equal(null);
      expect(rightColumns.querySelector('[data-field="price17M"]')).not.to.equal(null);
      expect(renderZone.querySelector('[data-field="price16M"]')).to.equal(null);
      expect(renderZone.querySelector('[data-field="price17M"]')).to.equal(null);
    });

    it('should not crash if a non-existent column is pinned', () => {
      expect(() => {
        render(<TestCase initialState={{ pinnedColumns: { left: ['currency'] } }} />);
        render(<TestCase initialState={{ pinnedColumns: { right: ['currency'] } }} />);
      }).not.to.throw();
    });

    describe('pinColumn', () => {
      it('should pin the given column', () => {
        render(<TestCase />);
        const renderZone = document.querySelector(
          `.${gridClasses.virtualScrollerRenderZone}`,
        ) as HTMLDivElement;
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left);
        const leftColumns = document.querySelector(
          `.${gridClasses['pinnedColumns--left']}`,
        ) as HTMLDivElement;
        expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        expect(renderZone.querySelector('[data-field="currencyPair"]')).to.equal(null);
      });

      it('should change the side when called on a pinned column', () => {
        render(<TestCase />);
        const renderZone = document.querySelector(
          `.${gridClasses.virtualScrollerRenderZone}`,
        ) as HTMLDivElement;
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);

        apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left);
        const leftColumns = document.querySelector(
          `.${gridClasses['pinnedColumns--left']}`,
        ) as HTMLDivElement;
        expect(leftColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
        expect(renderZone.querySelector('[data-field="currencyPair"]')).to.equal(null);

        apiRef.current.pinColumn('currencyPair', GridPinnedPosition.right);
        const rightColumns = document.querySelector(
          `.${gridClasses['pinnedColumns--right']}`,
        ) as HTMLDivElement;
        expect(document.querySelector(`.${gridClasses['pinnedColumns--left']}`)).to.equal(null);
        expect(rightColumns.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      });

      it('should not change the columns when called on a pinned column with the same side ', () => {
        render(<TestCase />);
        apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left);
        const leftColumns = document.querySelector(
          `.${gridClasses['pinnedColumns--left']}`,
        ) as HTMLDivElement;
        expect(leftColumns.querySelector('[data-id="0"]')?.children).to.have.length(1);
        apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left);
        expect(leftColumns.querySelector('[data-id="0"]')?.children).to.have.length(1);
      });
    });

    describe('unpinColumn', () => {
      it('should unpin the given column', () => {
        render(<TestCase />);
        apiRef.current.pinColumn('currencyPair', GridPinnedPosition.left);
        expect(document.querySelector(`.${gridClasses['pinnedColumns--left']}`)).not.to.equal(null);
        apiRef.current.unpinColumn('currencyPair');
        expect(document.querySelector(`.${gridClasses['pinnedColumns--left']}`)).to.equal(null);
        const renderZone = document.querySelector(
          `.${gridClasses.virtualScrollerRenderZone}`,
        ) as HTMLDivElement;
        expect(renderZone.querySelector('[data-field="currencyPair"]')).not.to.equal(null);
      });
    });

    describe('isColumnPinned', () => {
      it('should return the correct value', () => {
        render(
          <TestCase initialState={{ pinnedColumns: { left: ['id'], right: ['price16M'] } }} />,
        );
        expect(apiRef.current.isColumnPinned('id')).to.equal(GridPinnedPosition.left);
        expect(apiRef.current.isColumnPinned('price16M')).to.equal(GridPinnedPosition.right);
        expect(apiRef.current.isColumnPinned('currencyPair')).to.equal(false);
      });
    });
  });

  describe('column menu', () => {
    it('should pin the column to the left when clicking the "Pin to left" button', () => {
      render(<TestCase />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]');
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to left' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should pin the column to the right when clicking the "Pin to right" button', () => {
      render(<TestCase />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]');
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to right' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--right']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should allow to invert the side when clicking on "Pin to right" on a left pinned column', () => {
      render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]');
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to right' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).to.equal(null);
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--right']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should allow to invert the side when clicking on "Pin to left" on a right pinned column', () => {
      render(<TestCase initialState={{ pinnedColumns: { right: ['id'] } }} />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]');
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Pin to left' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--right']} [data-field="id"]`),
      ).to.equal(null);
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).not.to.equal(null);
    });

    it('should allow to unpin a pinned column when clicking "Unpin"', () => {
      render(<TestCase initialState={{ pinnedColumns: { left: ['id'] } }} />);
      const columnCell = document.querySelector('[role="columnheader"][data-field="id"]')!;
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]');
      fireEvent.click(menuIconButton);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Unpin' }));
      expect(
        document.querySelector(`.${gridClasses['pinnedColumns--left']} [data-field="id"]`),
      ).to.equal(null);
    });
  });
});

import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
  // @ts-expect-error need to migrate helpers to TypeScript
  createEvent,
} from 'test/utils';
import { expect } from 'chai';
import { useFakeTimers, spy } from 'sinon';
import {
  GridApiRef,
  GridComponentProps,
  useGridApiRef,
  XGrid,
  GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS,
} from '@material-ui/x-grid';
import { getColumnHeaderCell, getCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Columns', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  const Test = (props: Partial<GridComponentProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  describe('showColumnMenu', () => {
    it('should open the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.showColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.not.equal(null));
    });

    it('should set the correct id and aria-labelledby', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.showColumnMenu('brand');
      await waitFor(() => {
        const menu = screen.queryByRole('menu');
        expect(menu.id).to.match(/^mui-[0-9]+/);
        expect(menu.getAttribute('aria-labelledby')).to.match(/^mui-[0-9]+/);
      });
    });
  });

  describe('toggleColumnMenu', () => {
    it('should toggle the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.toggleColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.not.equal(null));
      apiRef!.current.toggleColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));
    });
  });

  describe('resizing', () => {
    const columns = [{ field: 'brand', width: 100 }];

    let clock;

    beforeEach(() => {
      clock = useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should allow to resize columns with the mouse', () => {
      render(<Test columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      );
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseUp(separator);
      expect(getColumnHeaderCell(0).style.width).to.equal('110px');
      expect(getCell(1, 0).style.width).to.equal('110px');
    });

    it('should allow to resize columns with the touch', () => {
      render(<Test columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      )!;
      const now = Date.now();
      const touchStartEvent = createEvent.touchStart(separator);
      // Safari lacks support for constructing a TouchEvent with changedTouches
      Object.defineProperty(touchStartEvent, 'changedTouches', {
        value: [{ identifier: now, target: separator, clientX: 100 }],
      });
      fireEvent(separator, touchStartEvent);
      const touchMoveEvent = createEvent.touchMove(separator);
      Object.defineProperty(touchMoveEvent, 'changedTouches', {
        value: [{ identifier: now, target: separator, clientX: 110 }],
      });
      fireEvent(separator, touchMoveEvent);
      const touchEndEvent = createEvent.touchEnd(separator);
      Object.defineProperty(touchEndEvent, 'changedTouches', {
        value: [{ identifier: now, target: separator, clientX: 110 }],
      });
      fireEvent(separator, touchEndEvent);
      expect(getColumnHeaderCell(0).style.width).to.equal('110px');
      expect(getCell(1, 0).style.width).to.equal('110px');
    });

    it('should call onColumnResize during resizing', () => {
      const onColumnResize = spy();
      render(<Test onColumnResize={onColumnResize} columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      );
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseMove(separator, { clientX: 120, buttons: 1 });
      fireEvent.mouseUp(separator);
      expect(onColumnResize.callCount).to.equal(2);
      expect(onColumnResize.args[0][0].width).to.equal(110);
      expect(onColumnResize.args[1][0].width).to.equal(120);
    });

    it('should call onColumnWidthChange after resizing', async () => {
      const onColumnWidthChange = spy();
      render(<Test onColumnWidthChange={onColumnWidthChange} columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      );
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseMove(separator, { clientX: 120, buttons: 1 });
      expect(onColumnWidthChange.callCount).to.equal(0);
      fireEvent.mouseUp(separator);
      clock.tick(0);
      expect(onColumnWidthChange.callCount).to.equal(1);
      expect(onColumnWidthChange.args[0][0].width).to.equal(120);
    });
  });
});

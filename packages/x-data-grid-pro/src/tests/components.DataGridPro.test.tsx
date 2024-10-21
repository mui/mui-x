import * as React from 'react';
import { createRenderer, EventType, fireEvent } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  DataGridPro,
  gridClasses,
  useGridApiRef,
  DataGridProProps,
  GridApi,
} from '@mui/x-data-grid-pro';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { getCell, getRow } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DataGridPro/> - Components', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function TestCase(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    const data = useBasicDemoData(100, 1);
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...data} disableVirtualization {...props} />
      </div>
    );
  }

  describe('footer', () => {
    it('should hide the row count if `hideFooterRowCount` prop is set', () => {
      render(<TestCase hideFooterRowCount />);
      expect(document.querySelector(`.${gridClasses.rowCount}`)).to.equal(null);
    });

    it('should throw a console error if hideFooterRowCount is used with pagination', () => {
      expect(() => render(<TestCase hideFooterRowCount pagination />)).toErrorDev(
        'MUI X: The `hideFooterRowCount` prop has no effect when the pagination is enabled.',
      );
    });
  });

  describe('components', () => {
    (
      [
        ['onClick', 'cellClick'],
        ['onDoubleClick', 'cellDoubleClick'],
        ['onMouseDown', 'cellMouseDown'],
        ['onMouseUp', 'cellMouseUp'],
        ['onDragEnter', 'cellDragEnter'],
        ['onDragOver', 'cellDragOver'],
      ] as const
    ).forEach(([prop, event]) => {
      it(`should still publish the '${event}' event when overriding the '${prop}' prop in slots.cell`, () => {
        const propHandler = spy();
        const eventHandler = spy();
        render(<TestCase slotProps={{ cell: { [prop]: propHandler } }} />);
        apiRef!.current.subscribeEvent(event, eventHandler);

        expect(propHandler.callCount).to.equal(0);
        expect(eventHandler.callCount).to.equal(0);

        const eventToFire = prop.replace(/^on([A-Z])/, (match) =>
          match.slice(2).toLowerCase(),
        ) as EventType; // for example onDoubleClick -> doubleClick
        const cell = getCell(0, 0);

        if (event !== 'cellMouseUp') {
          fireEvent.mouseUp(cell);
        }

        fireEvent[eventToFire](cell);

        expect(propHandler.callCount).to.equal(1);
        expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
        expect(eventHandler.callCount).to.equal(1);
      });
    });

    it(`should still publish the 'cellKeyDown' event when overriding the 'onKeyDown' prop in slots.cell`, () => {
      const propHandler = spy();
      const eventHandler = spy();
      render(<TestCase slotProps={{ cell: { onKeyDown: propHandler } }} />);
      apiRef!.current.subscribeEvent('cellKeyDown', eventHandler);

      expect(propHandler.callCount).to.equal(0);
      expect(eventHandler.callCount).to.equal(0);

      fireUserEvent.mousePress(getCell(0, 0));
      fireEvent.keyDown(getCell(0, 0));

      expect(propHandler.callCount).to.equal(1);
      expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
      expect(eventHandler.callCount).to.equal(1);
    });

    (
      [
        ['onClick', 'rowClick'],
        ['onDoubleClick', 'rowDoubleClick'],
      ] as const
    ).forEach(([prop, event]) => {
      it(`should still publish the '${event}' event when overriding the '${prop}' prop in slots.row`, () => {
        const propHandler = spy();
        const eventHandler = spy();
        render(<TestCase slotProps={{ row: { [prop]: propHandler } }} />);
        apiRef!.current.subscribeEvent(event, eventHandler);

        expect(propHandler.callCount).to.equal(0);
        expect(eventHandler.callCount).to.equal(0);

        const eventToFire = prop.replace(/^on([A-Z])/, (match) =>
          match.slice(2).toLowerCase(),
        ) as EventType; // for example onDoubleClick -> doubleClick
        fireEvent[eventToFire](getRow(0));

        expect(propHandler.callCount).to.equal(1);
        expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
        expect(eventHandler.callCount).to.equal(1);
      });
    });
  });
});

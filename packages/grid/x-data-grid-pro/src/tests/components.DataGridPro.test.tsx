import * as React from 'react';
import { createRenderer, fireEvent } from '@material-ui/monorepo/test/utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  DataGridPro,
  gridClasses,
  useGridApiRef,
  GridApiRef,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { useData } from 'packages/storybook/src/hooks/useData';
import { getCell, getRow } from 'test/utils/helperFn';

describe('<DataGridPro/> - Components', () => {
  const { render } = createRenderer();

  let apiRef: GridApiRef;
  const TestCase = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    const data = useData(100, 1);
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...data} disableVirtualization {...props} />
      </div>
    );
  };

  describe('footer', () => {
    it('should hide the row count if `hideFooterRowCount` prop is set', () => {
      render(<TestCase hideFooterRowCount />);
      expect(document.querySelector(`.${gridClasses.rowCount}`)).to.equal(null);
    });

    it('should throw a console error if hideFooterRowCount is used with pagination', () => {
      expect(() => render(<TestCase hideFooterRowCount pagination />))
        // @ts-expect-error need to migrate helpers to TypeScript
        .toErrorDev(
          'MUI: The `hideFooterRowCount` prop has no effect when the pagination is enabled.',
        );
    });
  });

  describe('components', () => {
    [
      ['onClick', 'cellClick'],
      ['onDoubleClick', 'cellDoubleClick'],
      ['onMouseDown', 'cellMouseDown'],
      ['onMouseUp', 'cellMouseUp'],
      ['onDragEnter', 'cellDragEnter'],
      ['onDragOver', 'cellDragOver'],
    ].forEach(([prop, event]) => {
      it(`should still publish the '${event}' event when overriding the '${prop}' prop in components.cell`, () => {
        const propHandler = spy();
        const eventHandler = spy();
        render(<TestCase componentsProps={{ cell: { [prop]: propHandler } }} />);
        apiRef!.current.subscribeEvent(event, eventHandler);

        expect(propHandler.callCount).to.equal(0);
        expect(eventHandler.callCount).to.equal(0);

        const eventToFire = prop.replace(/^on([A-Z])/, (match) => match.slice(2).toLowerCase()); // e.g. onDoubleClick -> doubleClick
        fireEvent[eventToFire](getCell(0, 0));

        expect(propHandler.callCount).to.equal(1);
        expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
        expect(eventHandler.callCount).to.equal(1);
      });
    });

    it(`should still publish the 'cellKeyDown' event when overriding the 'onKeyDown' prop in components.cell`, () => {
      const propHandler = spy();
      const eventHandler = spy();
      render(<TestCase componentsProps={{ cell: { onKeyDown: propHandler } }} />);
      apiRef!.current.subscribeEvent('cellKeyDown', eventHandler);

      expect(propHandler.callCount).to.equal(0);
      expect(eventHandler.callCount).to.equal(0);

      fireEvent.mouseUp(getCell(0, 0));
      fireEvent.click(getCell(0, 0));
      fireEvent.keyDown(getCell(0, 0));

      expect(propHandler.callCount).to.equal(1);
      expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
      expect(eventHandler.callCount).to.equal(1);
    });

    [
      ['onClick', 'rowClick'],
      ['onDoubleClick', 'rowDoubleClick'],
    ].forEach(([prop, event]) => {
      it(`should still publish the '${event}' event when overriding the '${prop}' prop in components.row`, () => {
        const propHandler = spy();
        const eventHandler = spy();
        render(<TestCase componentsProps={{ row: { [prop]: propHandler } }} />);
        apiRef!.current.subscribeEvent(event, eventHandler);

        expect(propHandler.callCount).to.equal(0);
        expect(eventHandler.callCount).to.equal(0);

        const eventToFire = prop.replace(/^on([A-Z])/, (match) => match.slice(2).toLowerCase()); // e.g. onDoubleClick -> doubleClick
        fireEvent[eventToFire](getRow(0));

        expect(propHandler.callCount).to.equal(1);
        expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
        expect(eventHandler.callCount).to.equal(1);
      });
    });
  });
});

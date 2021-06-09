import * as React from 'react';
import { createClientRenderStrictMode, fireEvent } from 'test/utils';
import { expect } from 'chai';
import { XGrid, GridComponentProps, GridToolbar } from '@material-ui/x-grid';
import { getCell, getColumnValues, getRow } from 'test/utils/helperFn';
import { GridSelectionModel } from '../../../_modules_/grid/models/gridSelectionModel';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Control', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        isPublished: false,
      },
      {
        id: 1,
        brand: 'Adidas',
        isPublished: true,
      },
      {
        id: 2,
        brand: 'Puma',
        isPublished: true,
      },
    ],
    columns: [{field: 'brand'}, {field: 'isPublished', type: 'boolean'}],
  };

  const TestCase = (props: Partial<GridComponentProps>) => {
    const {rows, columns, ...others} = props;
    return (
      <div style={{width: 300, height: 300}}>
        <XGrid
          autoHeight={isJSDOM}
          columns={columns || baselineProps.columns}
          rows={rows || baselineProps.rows}
          {...others}
        />
      </div>
    );
  };
  describe.only('control Selection', () => {

    it('should not update the selection model when the selectionModelProp is set', () => {
      const selectionModel: GridSelectionModel = [1];
      render(<TestCase selectionModel={selectionModel}/>);

      const firstRow = getRow(0);
      expect(firstRow).to.not.have.class('Mui-selected');

      const secondRow = getRow(1);
      expect(secondRow).to.have.class('Mui-selected');

      // fireEvent.click(getCell(0, 0));
      // expect(firstRow).to.not.have.class('Mui-selected');
    });
  });
});

import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-ignore
  fireEvent
} from 'test/utils';
import { expect } from 'chai';
import { XGrid, GridComponentProps } from '@material-ui/x-grid';
import { getCell, getRow } from 'test/utils/helperFn';
import { spy } from 'sinon';
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
    columns: [{ field: 'brand' }, { field: 'isPublished', type: 'boolean' }],
  };

  const TestCase = (props: Partial<GridComponentProps>) => {
    const { rows, columns, ...others } = props;
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          autoHeight={isJSDOM}
          columns={columns || baselineProps.columns}
          rows={rows || baselineProps.rows}
          {...others}
        />
      </div>
    );
  };

  describe('control Selection', () => {

    it('should update the selection state when neither the model nor the onChange are set', () => {
      render(<TestCase />);
      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).to.have.class('Mui-selected');
    });

    it('should not update the selection model when the selectionModelProp is set', () => {
      const selectionModel: GridSelectionModel = [1];
      render(<TestCase selectionModel={selectionModel} />);

      expect(getRow(0)).to.not.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');
      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).to.not.have.class('Mui-selected');
    });

    it('should update the selection state when the model is not set, but the onChange is set', () => {
      const onModelChange = spy();
      render(<TestCase onSelectionModelChange={onModelChange} />);

      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).to.have.class('Mui-selected');
console.log(onModelChange.firstCall.args[0])
console.log(onModelChange.lastCall.args[0])
      expect(onModelChange.callCount).to.equal(1);
      expect(onModelChange.firstCall.firstArg).to.deep.equal([0]);
    });

    it('should control selection state when the model and the onChange are set', () => {
      const ControlCase = (props: Partial<GridComponentProps>) => {
        const { rows, columns, ...others } = props;
        const [selectionModel, setSelectionModel] = React.useState<any>([0]);
        const handleSelectionChange = React.useCallback((newModel) => {
          if (newModel.length) {
            setSelectionModel([...newModel, 2]);
            return;
          }
          setSelectionModel(newModel);
        }, []);

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid
              autoHeight={isJSDOM}
              columns={columns || baselineProps.columns}
              rows={rows || baselineProps.rows}
              selectionModel={selectionModel}
              onSelectionModelChange={handleSelectionChange}
              {...others}
            />
          </div>
        );
      };

      render(<ControlCase />);

      expect(getRow(0)).to.have.class('Mui-selected');
      fireEvent.click(getCell(1, 0));
      expect(getRow(0)).to.not.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');
      expect(getRow(2)).to.have.class('Mui-selected');
    });
  });
});

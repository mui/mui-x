import { ApiRef, FilterModel, LinkOperator, useApiRef } from '@material-ui/data-grid';
import { XGrid } from '@material-ui/x-grid/XGrid';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import * as React from 'react';
import { getColumnValues, raf, sleep } from 'test/utils/helperFn';
import { createClientRenderStrictMode } from 'test/utils/index';

describe.only('<XGrid />', function() {
  this.timeout(30000);

  const baselineProps = {
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
    columns: [{field: 'brand'}],
  };

  describe('Filter: ', () => {
    let setProps: any;
    let apiRef: ApiRef;

    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    const TestCase = (props: { rows?: any[], model: FilterModel }) => {
      const {model, rows} = props;
      apiRef = useApiRef();
      return (
        <div style={{width: 300, height: 300}}>
          <XGrid
            apiRef={apiRef}
            {...baselineProps}
            rows={rows || baselineProps.rows}
            filterModel={model}
            disableColumnFilter={false}
          />
        </div>
      );
    };
    beforeEach(() => {
      const model = {
        items: [{
          columnField: 'brand', value: 'a', operatorValue: 'contains'
        }]
      };

      render(<TestCase model={model}/>);
      // setProps = renderResult.setProps;
    });

    it('should apply the filterModel prop correctly', () => {
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should apply the filterModel prop correctly on ApiRef setRows', async () => {
      const newRows = [
        {
          id: 3,
          brand: 'Asics',
        },
        {
          id: 4,
          brand: 'RedBull',
        },
        {
          id: 5,
          brand: 'Hugo',
        },
      ];
      apiRef.current.setRows(newRows);
      await sleep(100);
      expect(getColumnValues()).to.deep.equal(['Asics']);
    });

    it('should apply the filterModel prop correctly on ApiRef update row data', async () => {
      apiRef.current.updateRows([{id:1, brand: 'Fila' }]);
      apiRef.current.updateRows([{id: 0, brand: 'Patagonia' }]);
      await sleep(100);
      apiRef.current.getRowModels().map(
        row=> console.log(`${row.id} ${row.brand}`)
      );
      apiRef.current.onFilterModelChange((params)=> {
        params.filterModel.items.map(item=> JSON.stringify(item));
      })
      expect(getColumnValues()).to.deep.equal(['Patagonia', 'Fila', 'Puma']);
    });

    it('should allow apiRef to setFilterModel', async () => {
      apiRef.current.setFilterModel({
        items: [{
          columnField: 'brand', value: 'a', operatorValue: 'startsWith'
        }]
      });
      await sleep(100);

      expect(getColumnValues()).to.deep.equal(['Adidas']);
    });
    it('should allow multiple filter', async () => {
      const model = {
        items: [{
          columnField: 'brand', value: 'a', operatorValue: 'contains'
        },
          {
            columnField: 'brand', value: 'm', operatorValue: 'contains'
          }]
      };
      render(<TestCase model={model}/>);
      await sleep(100);

      expect(getColumnValues()).to.deep.equal(['Puma']);
    });

    it('should allow multiple filter via apiRef', async () => {
      const model = {
        items: [{
          columnField: 'brand', value: 'a', operatorValue: 'startsWith'
        },
          {
            columnField: 'brand', value: 's', operatorValue: 'endsWith'
          }]
      };
      apiRef.current.setFilterModel(model);
      await sleep(100);
      expect(getColumnValues()).to.deep.equal(['Adidas']);
    });

    it('should allow multiple filter and changing the LinkOperator', async () => {

      const model: FilterModel = {
        items: [{
          columnField: 'brand', value: 'a', operatorValue: 'startsWith'
        },
          {
            columnField: 'brand', value: 'a', operatorValue: 'endsWith'
          }],
        linkOperator:LinkOperator.Or
      };
      render(<TestCase model={model}/>);
      await sleep(100);

      expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    });
  });
});

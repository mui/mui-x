import { ApiRef, FilterModel, LinkOperator, useApiRef , XGrid } from '@material-ui/x-grid';
import { expect } from 'chai';
import * as React from 'react';
import { getColumnValues, sleep } from 'test/utils/helperFn';
import { createClientRenderStrictMode } from 'test/utils';

describe('<XGrid /> - Filter', () => {
  const render = createClientRenderStrictMode();
  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  let apiRef: ApiRef;

  const TestCase = (props: { rows?: any[]; model: FilterModel }) => {
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
      columns: [{ field: 'brand' }],
    };

    const { model, rows } = props;
    apiRef = useApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
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

  const renderBrandContainsA = () => {
    const model = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'contains',
        },
      ],
    };

    render(<TestCase model={model} />, {strict: false});
  };

  it('should apply the filterModel prop correctly', () => {
    renderBrandContainsA();
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly on ApiRef setRows', async () => {
    renderBrandContainsA();
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
    renderBrandContainsA();
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Patagonia' }]);
    await sleep(100);
    expect(getColumnValues()).to.deep.equal(['Patagonia', 'Fila', 'Puma']);
  });

  it('should allow apiRef to setFilterModel', async () => {
    renderBrandContainsA();
    apiRef.current.setFilterModel({
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
      ],
    });
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });
  it('should allow multiple filter and default to AND', async () => {
    const model = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'contains',
        },
        {
          columnField: 'brand',
          value: 'm',
          operatorValue: 'contains',
        },
      ],
    };
    render(<TestCase model={model} />);

    expect(getColumnValues()).to.deep.equal(['Puma']);
  });

  it('should allow multiple filter via apiRef', async () => {
    renderBrandContainsA();
    const model = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
        {
          columnField: 'brand',
          value: 's',
          operatorValue: 'endsWith',
        },
      ],
    };
    apiRef.current.setFilterModel(model);
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });

  it('should allow multiple filter and changing the LinkOperator', async () => {
    const model: FilterModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'endsWith',
        },
      ],
      linkOperator: LinkOperator.Or,
    };
    render(<TestCase model={model} />);

    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });
});

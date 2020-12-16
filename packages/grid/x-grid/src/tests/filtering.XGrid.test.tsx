import { ApiRef, FilterModel, LinkOperator, useApiRef, XGrid } from '@material-ui/x-grid';
import { expect } from 'chai';
import * as React from 'react';
import { useFakeTimers } from 'sinon';
import { getColumnValues } from 'test/utils/helperFn';
import { createClientRenderStrictMode } from 'test/utils';

describe('<XGrid /> - Filter', () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  // TODO v5: replace with createClientRender
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

  const model = {
    items: [
      {
        columnField: 'brand',
        value: 'a',
        operatorValue: 'contains',
      },
    ],
  };

  it('should apply the filterModel prop correctly', () => {
    render(<TestCase model={model} />);

    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly on ApiRef setRows', () => {
    render(<TestCase model={model} />, { strict: false });

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
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  it('should apply the filterModel prop correctly on ApiRef update row data', () => {
    render(<TestCase model={model} />, { strict: false });
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Patagonia' }]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Patagonia', 'Fila', 'Puma']);
  });

  it('should allow apiRef to setFilterModel', () => {
    render(<TestCase model={model} />, { strict: false });
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

  it('should allow multiple filter and default to AND', () => {
    const newModel = {
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
    render(<TestCase model={newModel} />);

    expect(getColumnValues()).to.deep.equal(['Puma']);
  });

  it('should allow multiple filter via apiRef', () => {
    render(<TestCase model={model} />, { strict: false });
    const newModel = {
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
    apiRef.current.setFilterModel(newModel);
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });

  it('should allow multiple filter and changing the LinkOperator', () => {
    const newModel: FilterModel = {
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
    render(<TestCase model={newModel} />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });
});

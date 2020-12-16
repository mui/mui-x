import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';
import { getColumnValues } from 'test/utils/helperFn';

describe('<DataGrid /> - Filter', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

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

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  const TestCase = (props: {
    rows?: any[];
    columns?: any[];
    operator?: string;
    value?: string;
  }) => {
    const { operator, value, rows, columns } = props;
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          columns={columns || baselineProps.columns}
          rows={rows || baselineProps.rows}
          filterModel={{
            items: [
              {
                columnField: 'brand',
                value,
                operatorValue: operator,
              },
            ],
          }}
          disableColumnFilter={false}
        />
      </div>
    );
  };

  it('should apply the filterModel prop correctly', () => {
    render(<TestCase value={'a'} operator={'contains'} />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly when row prop changes', () => {
    render(
      <TestCase
        value={'a'}
        operator={'contains'}
        rows={[
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
        ]}
      />,
    );
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  it('should allow operator startsWith', () => {
    const { setProps } = render(<TestCase value={'a'} operator={'contains'} />);
    setProps({
      operator: 'startsWith',
    });
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });

  it('should allow operator endsWith', () => {
    const { setProps } = render(<TestCase value={'a'} operator={'contains'} />);
    setProps({
      operator: 'endsWith',
    });
    expect(getColumnValues()).to.deep.equal(['Puma']);
  });

  it('should allow operator equal', () => {
    const { setProps } = render(<TestCase value={'a'} operator={'contains'} />);
    setProps({
      operator: 'equals',
      value: 'nike',
    });
    expect(getColumnValues()).to.deep.equal(['Nike']);
  });

  it('should support new dataset', () => {
    const { setProps } = render(<TestCase value={'a'} operator={'contains'} />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    setProps({
      rows: [
        {
          id: 0,
          country: 'France',
        },
        {
          id: 1,
          country: 'UK',
        },
        {
          id: 12,
          country: 'US',
        },
      ],
      columns: [{ field: 'country' }],
    });
    expect(getColumnValues()).to.deep.equal(['France', 'UK', 'US']);
  });
});

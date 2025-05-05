import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridListViewColDef,
  GridRowsProp,
} from '@mui/x-data-grid-pro';

const rows: GridRowsProp = [{ id: '123567', title: 'test' }];

const columns: GridColDef[] = [{ field: 'id' }, { field: 'title' }];

const listColumn: GridListViewColDef = {
  field: 'listColumn',
  renderCell: (params) => <div data-testid="list-column">Title: {params.row.title}</div>,
};

describe('<DataGridPro /> - List view', () => {
  const { render } = createRenderer();

  function Test(props: Partial<DataGridProProps>) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro columns={columns} rows={rows} {...props} />
      </div>
    );
  }

  it('should not render list column when list view is not enabled', () => {
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro columns={columns} rows={rows} listViewColumn={listColumn} />
      </div>,
    );
    expect(screen.queryByTestId('list-column')).to.equal(null);
  });

  it('should render list column when list view is enabled', () => {
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro columns={columns} rows={rows} listView listViewColumn={listColumn} />
      </div>,
    );
    expect(screen.getByTestId('list-column')).not.to.equal(null);
    expect(screen.getByTestId('list-column')).to.have.text('Title: test');
  });

  it('should render list column when `listView` prop updates', () => {
    const { setProps } = render(<Test listViewColumn={listColumn} />);
    expect(screen.queryByTestId('list-column')).to.equal(null);

    setProps({ listView: true });

    expect(screen.getByTestId('list-column')).not.to.equal(null);
    expect(screen.getByTestId('list-column')).to.have.text('Title: test');

    setProps({ listView: false });

    expect(screen.queryByTestId('list-column')).to.equal(null);
  });

  it('should update cell contents when the `renderCell` function changes', () => {
    const { setProps } = render(<Test listView listViewColumn={listColumn} />);

    setProps({
      listViewColumn: {
        ...listColumn,
        renderCell: (params) => <div data-testid="list-column">ID: {params.row.id}</div>,
      },
    } as Partial<DataGridProProps>);

    expect(screen.getByTestId('list-column')).to.have.text('ID: 123567');
  });

  it('should warn if the `listViewColumn` prop is not provided when `listView` is enabled', () => {
    expect(() => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro columns={columns} rows={rows} listView />
        </div>,
      );
    }).toWarnDev(
      [
        'MUI X: The `listViewColumn` prop must be set if `listView` is enabled.',
        'To fix, pass a column definition to the `listViewColumn` prop, e.g. `{ field: "example", renderCell: (params) => <div>{params.row.id}</div> }`.',
        'For more details, see https://mui.com/x/react-data-grid/list-view/',
      ].join('\n'),
    );
  });
});

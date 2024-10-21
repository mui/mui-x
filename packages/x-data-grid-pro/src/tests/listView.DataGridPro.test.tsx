import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridListColDef,
  GridRowsProp,
} from '@mui/x-data-grid-pro';

const rows: GridRowsProp = [{ id: '123567', title: 'test' }];

const columns: GridColDef[] = [{ field: 'id' }, { field: 'title' }];

const listColumn: GridListColDef = {
  field: 'listColumn',
  renderCell: (params) => <div data-testid="list-column">Title: {params.row.title}</div>,
};

describe('<DataGridPro /> - List view', () => {
  const { render } = createRenderer();

  it('should not render list column when list view is not enabled', () => {
    render(<DataGridPro columns={columns} rows={rows} unstable_listColumn={listColumn} />);
    expect(screen.queryByTestId('list-column')).to.equal(null);
  });

  it('should render list column when list view is enabled', () => {
    render(
      <DataGridPro
        columns={columns}
        rows={rows}
        unstable_listView
        unstable_listColumn={listColumn}
      />,
    );
    expect(screen.getByTestId('list-column')).not.to.equal(null);
    expect(screen.getByTestId('list-column')).to.have.text('Title: test');
  });

  it('should render list column when `unstable_listView` prop updates', () => {
    const { setProps } = render(
      <DataGridPro columns={columns} rows={rows} unstable_listColumn={listColumn} />,
    );
    expect(screen.queryByTestId('list-column')).to.equal(null);

    setProps({ unstable_listView: true });

    expect(screen.getByTestId('list-column')).not.to.equal(null);
    expect(screen.getByTestId('list-column')).to.have.text('Title: test');

    setProps({ unstable_listView: false });

    expect(screen.queryByTestId('list-column')).to.equal(null);
  });

  it('should update cell contents when the `renderCell` function changes', () => {
    const { setProps } = render(
      <DataGridPro
        columns={columns}
        rows={rows}
        unstable_listView
        unstable_listColumn={listColumn}
      />,
    );

    setProps({
      unstable_listColumn: {
        ...listColumn,
        renderCell: (params) => <div data-testid="list-column">ID: {params.row.id}</div>,
      },
    } as Partial<DataGridProProps>);

    expect(screen.getByTestId('list-column')).to.have.text('ID: 123567');
  });

  it('should warn if the `unstable_listColumn` prop is not provided when `unstable_listView` is enabled', () => {
    expect(() => {
      render(<DataGridPro columns={columns} rows={rows} unstable_listView />);
    }).toWarnDev(
      'MUI X: The `unstable_listColumn` prop must be set if `unstable_listView` is enabled.',
    );
  });
});

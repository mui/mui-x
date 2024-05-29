import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, ErrorBoundary, screen } from '@mui/internal-test-utils';
import { DataGrid, DataGridProps, GridRowModel, GridColDef } from '@mui/x-data-grid';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const getDefaultProps = (nbColumns: number) => {
  const columns: GridColDef[] = [];
  const row: GridRowModel = {};

  for (let i = 1; i <= nbColumns; i += 1) {
    columns.push({ field: `col${i}` });
    row[`col${i}`] = i;
  }

  return {
    disableVirtualization: true,
    columns,
    rows: [{ id: 0, ...row }],
    autoHeight: isJSDOM,
  };
};

type TestDataGridProps = Omit<DataGridProps, 'columns' | 'rows'> &
  Partial<Pick<DataGridProps, 'rows' | 'columns'>> & { nbColumns: number };

describe('<DataGrid /> - Column grouping', () => {
  const { render } = createRenderer();

  function TestDataGrid(props: TestDataGridProps) {
    const { nbColumns, ...other } = props;
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...getDefaultProps(nbColumns)} {...other} />
      </div>
    );
  }

  describe('Header grouping columns', () => {
    it('should add one header row when columns have a group', () => {
      render(
        <TestDataGrid
          nbColumns={2}
          columnGroupingModel={[{ groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] }]}
        />,
      );
      expect(screen.queryAllByRole('row')).to.have.length(3);
    });

    it('should add header rows to match max depth of column groups', () => {
      render(
        <TestDataGrid
          nbColumns={3}
          columnGroupingModel={[
            {
              groupId: 'col123',
              children: [
                { groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] },
                { field: 'col3' },
              ],
            },
          ]}
        />,
      );
      expect(screen.queryAllByRole('row')).to.have.length(4);
    });

    it('should add correct aria-colspan, aria-colindex on headers', () => {
      render(
        <TestDataGrid
          nbColumns={3}
          columnGroupingModel={[
            {
              groupId: 'col123',
              children: [
                { groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] },
                { field: 'col3' },
              ],
            },
          ]}
        />,
      );

      const row1Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="1"] [role="columnheader"]',
      );
      const row2Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="2"] [role="columnheader"]',
      );

      expect(
        Array.from(row1Headers).map((header) => header.getAttribute('aria-colspan')),
      ).to.deep.equal(['3']);
      expect(
        Array.from(row1Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1']);

      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colspan')),
      ).to.deep.equal(['2', '1']);
      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1', '3']);
    });

    it('should support non connexe groups', () => {
      render(
        <TestDataGrid
          nbColumns={4}
          columnGroupingModel={[
            {
              groupId: 'col134',
              children: [
                { groupId: 'col13', children: [{ field: 'col1' }, { field: 'col3' }] },
                { field: 'col4' },
              ],
            },
          ]}
        />,
      );

      const row1Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="1"] [role="columnheader"]',
      );
      const row2Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="2"] [role="columnheader"]',
      );

      expect(
        Array.from(row1Headers).map((header) => header.getAttribute('aria-colspan')),
      ).to.deep.equal(['1', '1', '2']);
      expect(
        Array.from(row1Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1', '2', '3']);

      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colspan')),
      ).to.deep.equal(['1', '1', '1', '1']);
      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1', '2', '3', '4']);
    });

    it('should only consider visible columns non connexe groups', () => {
      const { setProps } = render(
        <TestDataGrid
          nbColumns={3}
          columnGroupingModel={[
            {
              groupId: 'col12',
              children: [{ field: 'col1' }, { groupId: 'col2', children: [{ field: 'col2' }] }],
            },
          ]}
        />,
      );

      // 2 header groups, 1 header, 1 row
      expect(screen.queryAllByRole('row')).to.have.length(4);

      // hide the column with 2 nested groups
      setProps({ columnVisibilityModel: { col2: false } });
      expect(screen.queryAllByRole('row')).to.have.length(3);

      // hide the last  column with a group
      setProps({ columnVisibilityModel: { col1: false, col2: false } });
      expect(screen.queryAllByRole('row')).to.have.length(2);
    });

    it('should update headers when `columnGroupingModel` is modified', () => {
      const { setProps } = render(
        <TestDataGrid
          nbColumns={3}
          columnGroupingModel={[
            {
              groupId: 'col12',
              children: [{ field: 'col1' }, { groupId: 'col2', children: [{ field: 'col2' }] }],
            },
          ]}
        />,
      );

      // 2 header groups, 1 header, 1 row
      expect(screen.queryAllByRole('row')).to.have.length(4);

      // remove the top group
      setProps({ columnGroupingModel: [{ groupId: 'col2', children: [{ field: 'col2' }] }] });
      expect(screen.queryAllByRole('row')).to.have.length(3);
    });

    it('should split empty group cell if they are children of different group', () => {
      render(
        <TestDataGrid
          nbColumns={3}
          columnGroupingModel={[
            {
              groupId: 'col1',
              children: [{ field: 'col1' }],
            },
            {
              groupId: 'col2',
              children: [{ field: 'col2' }],
            },
            {
              groupId: 'col3',
              children: [
                {
                  groupId: 'col3bis',
                  children: [{ field: 'col3' }],
                },
              ],
            },
          ]}
        />,
      );

      const row2Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="2"] [role="columnheader"]',
      );

      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colspan')),
      ).to.deep.equal(['1', '1', '1']);
      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1', '2', '3']);
    });

    it('should merge empty group cell if they are children of the group', () => {
      render(
        <TestDataGrid
          nbColumns={3}
          columnGroupingModel={[
            {
              groupId: 'col12',
              children: [{ field: 'col1' }, { field: 'col2' }],
            },
            {
              groupId: 'col3',
              children: [
                {
                  groupId: 'col3bis',
                  children: [{ field: 'col3' }],
                },
              ],
            },
          ]}
        />,
      );

      const row2Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="2"] [role="columnheader"]',
      );

      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colspan')),
      ).to.deep.equal(['2', '1']);
      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1', '3']);
    });

    it('should not throw warning when all columns are hidden', () => {
      const { setProps } = render(
        <TestDataGrid
          nbColumns={3}
          columnGroupingModel={[
            {
              groupId: 'col123',
              children: [
                { groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] },
                { field: 'col3' },
              ],
            },
          ]}
        />,
      );

      setProps({
        columnVisibilityModel: {
          col1: false,
          col2: false,
          col3: false,
        },
      });
    });

    // See https://github.com/mui/mui-x/issues/8602
    it('should not throw when both `columns` and `columnGroupingModel` are updated', () => {
      const defaultProps = getDefaultProps(2);
      const { setProps } = render(
        <TestDataGrid
          nbColumns={0}
          {...defaultProps}
          columnGroupingModel={[
            {
              groupId: 'testGroup',
              children: [{ field: 'col1' }, { field: 'col2' }],
            },
          ]}
        />,
      );

      setProps({
        columns: [...defaultProps.columns, { field: 'newColumn' }],
        columnGroupingModel: [
          {
            groupId: 'testGroup',
            children: [{ field: 'col1' }, { field: 'col2' }, { field: 'newColumn' }],
          },
        ],
      });

      const row1Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="1"] [role="columnheader"]',
      );
      const row2Headers = document.querySelectorAll<HTMLElement>(
        '[aria-rowindex="2"] [role="columnheader"]',
      );

      expect(
        Array.from(row1Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1']);
      expect(
        Array.from(row2Headers).map((header) => header.getAttribute('aria-colindex')),
      ).to.deep.equal(['1', '2', '3']);
    });
  });

  // TODO: remove the skip. I failed to test if an error is thrown
  // eslint-disable-next-line mocha/no-skipped-tests
  describe.skip('error messages', () => {
    function TestWithError(props: TestDataGridProps) {
      return (
        <ErrorBoundary>
          <TestDataGrid {...props} />
        </ErrorBoundary>
      );
    }

    it('should log an error if two groups have the same id', () => {
      expect(() => {
        render(
          <TestWithError
            nbColumns={2}
            columnGroupingModel={[
              {
                groupId: 'col12',
                children: [{ field: 'col1' }, { groupId: 'col12', children: [{ field: 'col2' }] }],
              },
            ]}
          />,
        );
      }).toErrorDev();
    });

    it('should log an error if a columns is referenced in two groups', () => {
      expect(() => {
        render(
          <TestWithError
            nbColumns={3}
            columnGroupingModel={[
              {
                groupId: 'col12',
                children: [{ field: 'col1' }, { field: 'col2' }],
              },
              {
                groupId: 'col23',
                children: [{ field: 'col2' }, { field: 'col3' }],
              },
            ]}
          />,
        );
      }).toErrorDev();
    });

    it('should log an error if a group have no id', () => {
      expect(() => {
        try {
          render(
            <TestWithError
              nbColumns={2}
              columnGroupingModel={[
                {
                  // @ts-ignore
                  groupId: undefined,
                  children: [
                    { field: 'col1' },
                    { groupId: 'col12', children: [{ field: 'col2' }] },
                  ],
                },
              ]}
            />,
          );
        } catch (error) {
          console.error(error);
        }
      }).toErrorDev(
        'MUI-DataGrid: an element of the columnGroupingModel does not have either `field` or `groupId`',
      );
    });

    it('should log a warning if a group has no children', () => {
      expect(() => {
        render(
          <TestWithError
            nbColumns={2}
            columnGroupingModel={[
              {
                groupId: 'col12',
                children: [],
              },
            ]}
          />,
        );
      }).toWarnDev('MUI-DataGrid: group groupId=col12 has no children.');
      expect(() => {
        render(
          <TestWithError
            nbColumns={2}
            columnGroupingModel={[
              // @ts-ignore
              {
                groupId: 'col12',
              },
            ]}
          />,
        );
      }).toWarnDev('MUI-DataGrid: group groupId=col12 has no children.');
    });
  });
});

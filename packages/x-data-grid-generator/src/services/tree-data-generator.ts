import { DataGridPremiumProps, GridRowModel } from '@mui/x-data-grid-premium';
import { GridDemoData } from './real-data-service';
import { randomArrayItem } from './random-generator';

export interface AddPathToDemoDataOptions {
  /**
   * The field used to generate the path
   * If not defined, the tree data will not be built
   */
  groupingField?: string;
  /**
   * The depth of the tree
   * @default 1
   */
  maxDepth?: number;
  /**
   * The average amount of children in a node
   * @default 2
   */
  averageChildren?: number;
}

export interface DemoTreeDataValue
  extends Pick<DataGridPremiumProps, 'getTreeDataPath' | 'treeData' | 'groupingColDef'>,
    GridDemoData {}

interface RowWithParentIndex {
  value: GridRowModel;
  parentIndex: number | null;
}

export const addTreeDataOptionsToDemoData = (
  data: GridDemoData,
  options: AddPathToDemoDataOptions = {},
): DemoTreeDataValue => {
  const { averageChildren = 2, maxDepth = 1, groupingField } = options;

  const hasTreeData = maxDepth > 1 && groupingField != null;
  if (!hasTreeData) {
    return data;
  }

  if (data.rows.length > 1000) {
    throw new Error('MUI X: useDemoData tree data mode only works up to 1000 rows.');
  }

  const rowsByTreeDepth: Record<
    number,
    { rows: { [index: number]: RowWithParentIndex }; rowIndexes: number[] }
  > = {};
  const rowsCount = data.rows.length;

  const groupingCol = data.columns.find((col) => col.field === options.groupingField);

  if (!groupingCol) {
    throw new Error('MUI X: The tree data grouping field does not exist.');
  }

  data.initialState!.columns!.columnVisibilityModel![groupingField] = false;

  for (let i = 0; i < rowsCount; i += 1) {
    const row = data.rows[i];

    const currentChunk = Math.floor((i * (averageChildren ** maxDepth - 1)) / rowsCount) + 1;
    const currentDepth = Math.floor(Math.log(currentChunk) / Math.log(averageChildren));

    if (!rowsByTreeDepth[currentDepth]) {
      rowsByTreeDepth[currentDepth] = { rows: {}, rowIndexes: [] };
    }

    rowsByTreeDepth[currentDepth].rows[i] = { value: row, parentIndex: null };
    rowsByTreeDepth[currentDepth].rowIndexes.push(i);
  }

  Object.entries(rowsByTreeDepth).forEach(([depthStr, { rows }]) => {
    const depth = Number(depthStr);

    Object.values(rows).forEach((row) => {
      const path: string[] = [];
      let previousRow: RowWithParentIndex | null = null;
      for (let k = depth; k >= 0; k -= 1) {
        let rowTemp: RowWithParentIndex;
        if (k === depth) {
          if (depth > 0) {
            row.parentIndex = Number(randomArrayItem(rowsByTreeDepth[depth - 1].rowIndexes));
          }
          rowTemp = row;
        } else {
          rowTemp = rowsByTreeDepth[k].rows[previousRow!.parentIndex!];
        }

        path.unshift(rowTemp.value[groupingField!]);

        previousRow = rowTemp;
      }

      row.value.path = path;
    });
  });

  return {
    ...data,
    groupingColDef: {
      headerName: groupingCol.headerName ?? groupingCol.field,
      width: 250,
    },
    getTreeDataPath: (row) => row.path,
    treeData: true,
  };
};

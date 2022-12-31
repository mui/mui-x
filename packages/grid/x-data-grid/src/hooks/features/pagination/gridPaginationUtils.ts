import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { buildWarning } from '../../../utils/warning';
import { GridSignature } from '../../utils';

const MAX_PAGE_SIZE = 100;

export const defaultPageSize = (autoPageSize: boolean) => (autoPageSize ? 0 : 100);

export const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

export const noRowCountInServerMode = buildWarning(
  [
    "MUI: the 'rowCount' prop is undefined while using paginationMode='server'",
    'For more detail, see http://mui.com/components/data-grid/pagination/#basic-implementation',
  ],
  'error',
);

export const throwIfPageSizeExceedsTheLimit = (
  pageSize: number,
  signatureProp: DataGridProcessedProps['signature'],
) => {
  if (signatureProp === GridSignature.DataGrid && pageSize > MAX_PAGE_SIZE) {
    throw new Error(
      [
        'MUI: `pageSize` cannot exceed 100 in the MIT version of the DataGrid.',
        'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.',
      ].join('\n'),
    );
  }
};

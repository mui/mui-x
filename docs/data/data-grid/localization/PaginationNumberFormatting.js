import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { enUS as locale } from '@mui/x-data-grid/locales';

const LOCALE = 'en-US'; // replace with your locale

const formatNumber = (value) => {
  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    try {
      const result = new Intl.NumberFormat(LOCALE).format(Number(value));
      return result === 'NaN' ? String(value) : result;
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const paginationDisplayedRows = ({ from, to, count, estimated }) => {
  if (!estimated) {
    return `${formatNumber(from)}–${formatNumber(to)} sur ${
      count !== -1 ? formatNumber(count) : `plus de ${formatNumber(to)}`
    }`;
  }
  const estimatedLabel =
    estimated && estimated > to
      ? `environ ${formatNumber(estimated)}`
      : `plus de ${formatNumber(to)}`;
  return `${formatNumber(from)}–${formatNumber(to)} sur ${
    count !== -1 ? formatNumber(count) : estimatedLabel
  }`;
};

const localeText = {
  ...locale.components.MuiDataGrid.defaultProps.localeText,
  paginationDisplayedRows,
};

export default function PaginationNumberFormatting() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        pagination
        paginationMode="server"
        pageSizeOptions={[10000, 20000]}
        paginationModel={{ page: 1, pageSize: 10000 }}
        rowCount={1000000}
        localeText={localeText}
      />
    </div>
  );
}

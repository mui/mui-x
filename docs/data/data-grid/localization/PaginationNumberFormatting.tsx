import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

// ======================================================
// TODO: replace with your locale
import { frFR as locale } from '@mui/x-data-grid/locales';

const LOCALE = 'fr-FR';
// ======================================================

function formatNumber(value: number | string) {
  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    try {
      const result = new Intl.NumberFormat(LOCALE).format(Number(value));
      return result === 'NaN' ? String(value) : result;
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function paginationDisplayedRows({
  from,
  to,
  count,
  estimated,
}: {
  from: number;
  to: number;
  count: number;
  estimated?: number;
}) {
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
}

const localeText = {
  ...locale.components.MuiDataGrid.defaultProps.localeText,
  paginationDisplayedRows,
};

export default function PaginationNumberFormatting() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100000,
    maxColumns: 6,
  });
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} localeText={localeText} />
    </div>
  );
}

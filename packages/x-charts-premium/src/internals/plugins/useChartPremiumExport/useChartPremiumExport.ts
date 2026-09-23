import type { ChartPlugin } from '@mui/x-charts/internals';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../../excelExport/defaults';
import type {
  ChartExcelExportOptions,
  UseChartPremiumExportSignature,
} from './useChartPremiumExport.types';

const EXCEL_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function triggerDownload(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export const useChartPremiumExport: ChartPlugin<UseChartPremiumExportSignature> = ({ store }) => {
  const getDataAsExcel = async (options: ChartExcelExportOptions = {}) => {
    const {
      includeHiddenSeries = DEFAULT_CHART_EXCEL_OPTIONS.includeHiddenSeries,
      includeFormattedValues = DEFAULT_CHART_EXCEL_OPTIONS.includeFormattedValues,
      escapeFormulas = DEFAULT_CHART_EXCEL_OPTIONS.escapeFormulas,
      // Left undefined on purpose: `buildChartExcelWorkbook` owns its default.
      includeHeaders,
    } = options;

    // Snapshot before awaiting, so the export reflects the chart as it was when asked.
    const state = store.state;

    // Lazy, so a chart that is never exported does not ship the extractors.
    const { getChartExcelTables, buildChartExcelWorkbook } = await import('../../excelExport');

    const tables = getChartExcelTables(state, {
      includeHiddenSeries,
      includeFormattedValues,
      escapeFormulas,
    });

    return buildChartExcelWorkbook(tables, { includeHeaders });
  };

  const exportAsExcel = async (options?: ChartExcelExportOptions) => {
    try {
      const workbook = await getDataAsExcel(options);
      if (!workbook) {
        return;
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buffer], { type: EXCEL_MIME_TYPE }));
      triggerDownload(url, `${options?.fileName || document.title || 'untitled'}.xlsx`);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('MUI X Charts: Error exporting chart as Excel:', error);
    }
  };

  return {
    publicAPI: { getDataAsExcel, exportAsExcel },
    instance: { getDataAsExcel, exportAsExcel },
  };
};

useChartPremiumExport.params = {};

useChartPremiumExport.getDefaultizedParams = ({ params }) => ({
  ...params,
});

useChartPremiumExport.getInitialState = () => ({});

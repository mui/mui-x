import type { ChartPlugin } from '@mui/x-charts/internals';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../../excelExport/chartExcelData.types';
import { getChartExcelTables } from '../../excelExport/getChartExcelTables';
import { buildChartExcelWorkbook } from '../../excelExport/buildChartExcelWorkbook';
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
      includeHeaders = true,
    } = options;

    const tables = getChartExcelTables(store.state, {
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
      triggerDownload(url, `${options?.fileName || document.title}.xlsx`);
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

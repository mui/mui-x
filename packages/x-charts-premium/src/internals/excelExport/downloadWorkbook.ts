import type * as Excel from '@mui/x-internal-exceljs-fork';

const EXCEL_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * Serializes a workbook and hands it to the browser as a download.
 * `fileName` carries no extension.
 */
export async function downloadWorkbook(workbook: Excel.Workbook, fileName: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], { type: EXCEL_MIME_TYPE }));

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${fileName || 'untitled'}.xlsx`;
  anchor.click();

  URL.revokeObjectURL(url);
}

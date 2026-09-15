import { describe, expect, it } from 'vitest';
import Excel from '@mui/x-internal-exceljs-fork';
import { buildChartExcelWorkbook } from './buildChartExcelWorkbook';
import type { ChartExcelTable } from './chartExcelData.types';

const categoryTable = (rows: ChartExcelTable['rows']): ChartExcelTable => ({
  id: 'category',
  columns: [
    { key: 'series', header: 'series' },
    { key: 'category', header: 'category' },
    { key: 'value', header: 'value' },
  ],
  rows,
});

describe('buildChartExcelWorkbook', () => {
  it('writes a header row and one row per data point', async () => {
    const workbook = await buildChartExcelWorkbook([
      categoryTable([
        { series: 'Sales', category: 'France', value: 68 },
        { series: 'Sales', category: 'Spain', value: 47 },
      ]),
    ]);

    const worksheet = workbook!.worksheets[0];

    expect(worksheet.getCell('A1').value).to.equal('series');
    expect(worksheet.getCell('B1').value).to.equal('category');
    expect(worksheet.getCell('C1').value).to.equal('value');
    expect(worksheet.getCell('A2').value).to.equal('Sales');
    expect(worksheet.getCell('B2').value).to.equal('France');
    expect(worksheet.getCell('C2').value).to.equal(68);
    expect(worksheet.getCell('C3').value).to.equal(47);
  });

  it('names the sheet after the table', async () => {
    const workbook = await buildChartExcelWorkbook([categoryTable([{ series: 'A' }])]);

    expect(workbook!.worksheets[0].name).to.equal('category');
  });

  it('writes one worksheet per table', async () => {
    const workbook = await buildChartExcelWorkbook([
      categoryTable([{ series: 'A' }]),
      {
        id: 'scatter',
        columns: [
          { key: 'x', header: 'x' },
          { key: 'y', header: 'y' },
        ],
        rows: [{ x: 1, y: 2 }],
      },
    ]);

    expect(workbook!.worksheets.map((worksheet) => worksheet.name)).to.deep.equal([
      'category',
      'scatter',
    ]);
  });

  it('writes dates with a date format, so Excel does not show serial numbers', async () => {
    const date = new Date('2026-01-02T00:00:00Z');
    const workbook = await buildChartExcelWorkbook([
      categoryTable([
        { series: 'A', category: date, value: 1.5 },
        { series: 'A', category: 'France', value: 2 },
      ]),
    ]);

    // Round-trip through the written file: the in-memory cell is a Date either way.
    const buffer = await workbook!.xlsx.writeBuffer();
    const reloaded = new Excel.Workbook();
    await reloaded.xlsx.load(buffer);
    const worksheet = reloaded.worksheets[0];

    expect(worksheet.getCell('B2').value instanceof Date).to.equal(true);
    expect(worksheet.getCell('B2').numFmt).to.equal('dd.mm.yyyy hh:mm');
    expect(worksheet.getCell('B3').value).to.equal('France');
    expect(worksheet.getCell('B3').numFmt).to.equal(undefined);
    expect(typeof worksheet.getCell('C2').value).to.equal('number');
  });

  it('omits the header row when asked', async () => {
    const workbook = await buildChartExcelWorkbook(
      [categoryTable([{ series: 'Sales', category: 'France', value: 68 }])],
      { includeHeaders: false },
    );

    expect(workbook!.worksheets[0].getCell('A1').value).to.equal('Sales');
  });

  it('returns null when there is nothing to export, since a workbook needs a sheet', async () => {
    expect(await buildChartExcelWorkbook([])).to.equal(null);
  });
});

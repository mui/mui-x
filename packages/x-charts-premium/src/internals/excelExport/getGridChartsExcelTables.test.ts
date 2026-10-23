import { describe, expect, it } from 'vitest';
import { getGridChartsExcelTables } from './getGridChartsExcelTables';

const dimension = (label: string, data: (string | number | Date | null)[]) => ({
  id: label,
  label,
  data,
});

const value = (label: string, data: (number | null)[]) => ({ id: label, label, data });

describe('getGridChartsExcelTables', () => {
  it('writes one row per data point per series', () => {
    const [table] = getGridChartsExcelTables(
      [dimension('Country', ['France', 'Spain'])],
      [value('Population', [68, 47]), value('GDP', [2.8, 1.4])],
    );

    expect(table.id).to.equal('gridCharts');
    expect(table.columns.map((column) => column.header)).to.deep.equal([
      'Country',
      'series',
      'value',
    ]);
    expect(table.rows).to.deep.equal([
      { dimension0: 'France', series: 'Population', value: 68 },
      { dimension0: 'Spain', series: 'Population', value: 47 },
      { dimension0: 'France', series: 'GDP', value: 2.8 },
      { dimension0: 'Spain', series: 'GDP', value: 1.4 },
    ]);
  });

  it('keeps a column per dimension, where the renderer joins them into one label', () => {
    const [table] = getGridChartsExcelTables(
      [dimension('Country', ['France', 'France']), dimension('City', ['Paris', 'Lyon'])],
      [value('Population', [2.1, 0.5])],
    );

    expect(table.columns.map((column) => column.header)).to.deep.equal([
      'Country',
      'City',
      'series',
      'value',
    ]);
    expect(table.rows).to.deep.equal([
      { dimension0: 'France', dimension1: 'Paris', series: 'Population', value: 2.1 },
      { dimension0: 'France', dimension1: 'Lyon', series: 'Population', value: 0.5 },
    ]);
  });

  it('repeats a category instead of numbering it, as the renderer has to', () => {
    const [table] = getGridChartsExcelTables(
      [dimension('City', ['Paris', 'Paris'])],
      [value('Visits', [1, 2])],
    );

    expect(table.rows.map((row) => row.dimension0)).to.deep.equal(['Paris', 'Paris']);
  });

  it('writes dates and nulls without coercing them to text', () => {
    const date = new Date('2026-01-02T00:00:00Z');
    const [table] = getGridChartsExcelTables(
      [dimension('Day', [date, null])],
      [value('Sales', [5, null])],
    );

    expect(table.rows[0].dimension0).to.equal(date);
    expect(table.rows[0].value).to.equal(5);
    expect(table.rows[1].dimension0).to.equal(null);
    expect(table.rows[1].value).to.equal(null);
  });

  it('escapes text Excel would evaluate, and can be told not to', () => {
    const [escaped] = getGridChartsExcelTables(
      [dimension('Formula', ['=1+1'])],
      [value('Sales', [1])],
    );
    const [raw] = getGridChartsExcelTables(
      [dimension('Formula', ['=1+1'])],
      [value('Sales', [1])],
      { escapeFormulas: false },
    );

    expect(escaped.rows[0].dimension0).to.equal("'=1+1");
    expect(raw.rows[0].dimension0).to.equal('=1+1');
  });

  it('pads a series that is shorter than the dimension', () => {
    const [table] = getGridChartsExcelTables(
      [dimension('Country', ['France', 'Spain', 'Italy'])],
      [value('Population', [68])],
    );

    expect(table.rows).to.have.length(3);
    expect(table.rows[1].value).to.equal(null);
  });

  it('returns nothing when there is no value selected', () => {
    expect(getGridChartsExcelTables([dimension('Country', ['France'])], [])).to.deep.equal([]);
  });

  it('exports values with no dimension selected', () => {
    const [table] = getGridChartsExcelTables([], [value('Population', [68, 47])]);

    expect(table.columns.map((column) => column.header)).to.deep.equal(['series', 'value']);
    expect(table.rows).to.have.length(2);
  });
});

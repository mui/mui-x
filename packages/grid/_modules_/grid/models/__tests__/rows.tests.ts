import { createRowModel, RowData } from '../rows';

describe('Row: createRowModel', () => {
  it('should have an id', () => {
    const row = {
      name: 'damien',
    };
    const expectedError = [
      'Material-UI: The data grid component requires all rows to have a unique id property.',
      'A row was provided without in the rows prop:',
      JSON.stringify(row),
    ].join('\n');
    expect(() => createRowModel(<RowData>(<unknown>row))).toThrow(expectedError);
  });
});

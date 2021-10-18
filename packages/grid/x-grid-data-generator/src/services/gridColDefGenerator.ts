import { GridColDef } from '@mui/x-data-grid-pro';

export interface GridDataGeneratorContext {
  /**
   * Values already attributed to this column.
   * Only defined if the column has the uniqueness mode activated.
   * The keys represents the random value and the value represents the amount of rows that already have this value.
   * This allows to data generators to add a suffix to the returned value to force the uniqueness.
   */
  values?: Record<string, number>;
}

export interface GridColDefGenerator extends GridColDef {
  generateData?: (row: any, context: GridDataGeneratorContext) => any;

  /**
   * If `true`, each row will have a distinct value
   * @default false
   */
  dataGeneratorUniquenessEnabled?: boolean;
}

export const vars = {
  spacing: (size: number) => `calc(var(--DataGrid-t-spacing-unit) * ${size})`,
  spacingUnit: '--DataGrid-t-spacing-unit',

  palette: {
    background: {
      default: '--DataGrid-t-palette-background-default',
      /** Equivalent to "paper", used for elements floating above other ones. */
      elevated: '--DataGrid-t-palette-background-elevated',
    }
  }
}

import * as React from 'react';
import HyperFormula from 'hyperformula';

export interface HyperFormulaContextValue {
  /**
   * The HyperFormula instance.
   */
  hf: HyperFormula;
  /**
   * The sheet ID for the current sheet.
   */
  sheetId: number;
  /**
   * Version counter that increments on any HyperFormula change.
   * Components can use this to trigger re-renders when data changes.
   */
  version: number;
  /**
   * Mapping of column field names to their HyperFormula column indices.
   */
  columnFieldMap: Map<string, number>;
}

export const HyperFormulaContext =
  React.createContext<HyperFormulaContextValue | null>(null);

/**
 * Hook to access the HyperFormula context.
 * Throws an error if used outside of a HyperFormulaContext provider.
 */
export function useHyperFormula(): HyperFormulaContextValue {
  const context = React.useContext(HyperFormulaContext);
  if (!context) {
    throw new Error(
      'useHyperFormula must be used within a HyperFormulaContext provider',
    );
  }
  return context;
}

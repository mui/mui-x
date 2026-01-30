import * as React from 'react';

export const HyperFormulaContext = React.createContext(null);

/**
 * Hook to access the HyperFormula context.
 * Throws an error if used outside of a HyperFormulaContext provider.
 */
export function useHyperFormula() {
  const context = React.useContext(HyperFormulaContext);
  if (!context) {
    throw new Error(
      'useHyperFormula must be used within a HyperFormulaContext provider',
    );
  }
  return context;
}

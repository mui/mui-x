export type SymbolsTypes = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
// Returns the index of a defined shape
export function getSymbol(shape: SymbolsTypes): number {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);

  return symbolNames.indexOf(shape) || 0;
}

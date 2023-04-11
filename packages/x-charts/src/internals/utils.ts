export type SymbolsTypes = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
// Returns a either a defined shape
export function getSymbol(shape: SymbolsTypes): number {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);

  return symbolNames.indexOf(shape) || 0;
}

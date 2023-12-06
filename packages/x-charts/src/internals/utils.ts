export type SymbolsTypes = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
// Returns the index of a defined shape
export function getSymbol(shape: SymbolsTypes): number {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);

  return symbolNames.indexOf(shape) || 0;
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

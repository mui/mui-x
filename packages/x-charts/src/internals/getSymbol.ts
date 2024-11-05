export type SymbolsTypes = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';

export function getSymbol(shape: SymbolsTypes): number {
  // prettier-ignore
  switch (shape) {
    case 'circle':   return 0;
    case 'cross':    return 1;
    case 'diamond':  return 2;
    case 'square':   return 3;
    case 'star':     return 4;
    case 'triangle': return 5;
    case 'wye':      return 6;
    default:         return 0;
  }
}

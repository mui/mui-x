import createKeyboardFocusHandler from '../../../internals/createKeyboardFocusHandler';

const outSeriesTypes: Set<'bar' | 'line' | 'scatter'> = new Set(['bar', 'line', 'scatter']);

export default createKeyboardFocusHandler(outSeriesTypes);

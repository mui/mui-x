import createKeyboardFocusHandler from '../../internals/createKeyboardFocusHandler';

const outSeriesTypes: Set<'pie'> = new Set(['pie']);

export default createKeyboardFocusHandler(outSeriesTypes);

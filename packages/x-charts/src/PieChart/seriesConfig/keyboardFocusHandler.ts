import createKeyboardFocusHandler from '../../internals/createKeyboardFocusHandler';

const outSeriesTypes: Set<'pie'> = new Set(['pie']);

const keyboardFocusHandler = createKeyboardFocusHandler(outSeriesTypes);

export default keyboardFocusHandler;

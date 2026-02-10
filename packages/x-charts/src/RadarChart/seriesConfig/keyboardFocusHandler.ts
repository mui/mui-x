import createKeyboardFocusHandler from '../../internals/createKeyboardFocusHandler';

const outSeriesTypes: Set<'radar'> = new Set(['radar']);

export default createKeyboardFocusHandler(outSeriesTypes, true);

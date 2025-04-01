const { addHook } = require('pirates');

const IGNORE_EXTENSIONS = ['.css'];

addHook((_code, _filename) => '', { exts: IGNORE_EXTENSIONS });

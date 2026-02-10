"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphemeCount = void 0;
var segmenter = typeof window !== 'undefined' && 'Intl' in window && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;
function getGraphemeCountFallback(text) {
    return text.length;
}
function getGraphemeCountModern(text) {
    var segments = segmenter.segment(text);
    var count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention,no-underscore-dangle
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
        var _unused = segments_1[_i];
        count += 1;
    }
    return count;
}
/** Returns the number of graphemes (basically characters) present in {@link text}. */
exports.getGraphemeCount = segmenter ? getGraphemeCountModern : getGraphemeCountFallback;

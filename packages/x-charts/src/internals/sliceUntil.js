"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliceUntil = void 0;
var segmenter = typeof window !== 'undefined' && 'Intl' in window && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;
function sliceUntilFallback(text, endIndex) {
    return text.slice(0, endIndex);
}
function sliceUntilModern(text, endIndex) {
    var segments = segmenter.segment(text);
    var newText = '';
    var i = 0;
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
        var segment = segments_1[_i];
        newText += segment.segment;
        i += 1;
        if (i >= endIndex) {
            break;
        }
    }
    return newText;
}
/** Creates a slice of {@link text} from the start until the {@link endIndex}th grapheme (basically character). */
exports.sliceUntil = segmenter ? sliceUntilModern : sliceUntilFallback;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesTextFitInRect = doesTextFitInRect;
exports.ellipsize = ellipsize;
var getGraphemeCount_1 = require("./getGraphemeCount");
var degToRad_1 = require("./degToRad");
var sliceUntil_1 = require("./sliceUntil");
var ELLIPSIS = '…';
function doesTextFitInRect(text, config) {
    var width = config.width, height = config.height, measureText = config.measureText;
    var angle = (0, degToRad_1.degToRad)(config.angle);
    var textSize = measureText(text);
    var angledWidth = Math.abs(textSize.width * Math.cos(angle)) + Math.abs(textSize.height * Math.sin(angle));
    var angledHeight = Math.abs(textSize.width * Math.sin(angle)) + Math.abs(textSize.height * Math.cos(angle));
    return angledWidth <= width && angledHeight <= height;
}
/** This function finds the best place to clip the text to add an ellipsis.
 *  This function assumes that the {@link doesTextFit} never returns true for longer text after returning false for
 *  shorter text.
 *
 *  @param text Text to ellipsize if needed
 *  @param doesTextFit a function that returns whether a string fits inside a container.
 */
function ellipsize(text, doesTextFit) {
    if (doesTextFit(text)) {
        return text;
    }
    var shortenedText = text;
    var step = 1;
    var by = 1 / 2;
    var graphemeCount = (0, getGraphemeCount_1.getGraphemeCount)(text);
    var newLength = graphemeCount;
    var lastLength = graphemeCount;
    var longestFittingText = null;
    do {
        lastLength = newLength;
        newLength = Math.floor(graphemeCount * by);
        if (newLength === 0) {
            break;
        }
        shortenedText = (0, sliceUntil_1.sliceUntil)(text, newLength).trim();
        var fits = doesTextFit(shortenedText + ELLIPSIS);
        step += 1;
        if (fits) {
            longestFittingText = shortenedText;
            by += 1 / Math.pow(2, step);
        }
        else {
            by -= 1 / Math.pow(2, step);
        }
    } while (Math.abs(newLength - lastLength) !== 1);
    return longestFittingText ? longestFittingText + ELLIPSIS : '';
}

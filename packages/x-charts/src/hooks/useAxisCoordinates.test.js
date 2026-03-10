"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var useAxisCoordinates_1 = require("./useAxisCoordinates");
var drawingArea = {
    left: 50,
    top: 20,
    width: 400,
    height: 300,
    right: 50,
    bottom: 30,
};
(0, vitest_1.describe)('getXAxisCoordinates', function () {
    (0, vitest_1.it)('returns null when position is "none"', function () {
        var result = (0, useAxisCoordinates_1.getXAxisCoordinates)(drawingArea, {
            position: 'none',
            offset: 0,
            height: 30,
        });
        (0, vitest_1.expect)(result).to.equal(null);
    });
    (0, vitest_1.it)('returns correct coordinates for bottom position', function () {
        var result = (0, useAxisCoordinates_1.getXAxisCoordinates)(drawingArea, {
            position: 'bottom',
            offset: 0,
            height: 30,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 50,
            top: 320, // drawingArea.top + drawingArea.height + offset = 20 + 300 + 0
            right: 450, // drawingArea.left + drawingArea.width = 50 + 400
            bottom: 350, // top + axisHeight = 320 + 30
        });
    });
    (0, vitest_1.it)('returns correct coordinates for bottom position with offset', function () {
        var result = (0, useAxisCoordinates_1.getXAxisCoordinates)(drawingArea, {
            position: 'bottom',
            offset: 10,
            height: 30,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 50,
            top: 330, // drawingArea.top + drawingArea.height + offset = 20 + 300 + 10
            right: 450,
            bottom: 360, // top + axisHeight = 330 + 30
        });
    });
    (0, vitest_1.it)('returns correct coordinates for top position', function () {
        var result = (0, useAxisCoordinates_1.getXAxisCoordinates)(drawingArea, {
            position: 'top',
            offset: 0,
            height: 30,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 50,
            top: -10, // drawingArea.top - axisHeight - offset = 20 - 30 - 0
            right: 450,
            bottom: 20, // top + axisHeight = -10 + 30
        });
    });
    (0, vitest_1.it)('returns correct coordinates for top position with offset', function () {
        var result = (0, useAxisCoordinates_1.getXAxisCoordinates)(drawingArea, {
            position: 'top',
            offset: 5,
            height: 30,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 50,
            top: -15, // drawingArea.top - axisHeight - offset = 20 - 30 - 5
            right: 450,
            bottom: 15, // top + axisHeight = -15 + 30
        });
    });
    (0, vitest_1.it)('defaults to bottom position when position is undefined', function () {
        var result = (0, useAxisCoordinates_1.getXAxisCoordinates)(drawingArea, {
            position: undefined,
            offset: 0,
            height: 30,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 50,
            top: 320, // same as bottom position
            right: 450,
            bottom: 350,
        });
    });
});
(0, vitest_1.describe)('getYAxisCoordinates', function () {
    (0, vitest_1.it)('returns null when position is "none"', function () {
        var result = (0, useAxisCoordinates_1.getYAxisCoordinates)(drawingArea, {
            position: 'none',
            offset: 0,
            width: 40,
        });
        (0, vitest_1.expect)(result).to.equal(null);
    });
    (0, vitest_1.it)('returns correct coordinates for left position', function () {
        var result = (0, useAxisCoordinates_1.getYAxisCoordinates)(drawingArea, {
            position: 'left',
            offset: 0,
            width: 40,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 10, // drawingArea.left - axisWidth - offset = 50 - 40 - 0
            top: 20,
            right: 50, // left + axisWidth = 10 + 40
            bottom: 320, // drawingArea.top + drawingArea.height = 20 + 300
        });
    });
    (0, vitest_1.it)('returns correct coordinates for left position with offset', function () {
        var result = (0, useAxisCoordinates_1.getYAxisCoordinates)(drawingArea, {
            position: 'left',
            offset: 10,
            width: 40,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 0, // drawingArea.left - axisWidth - offset = 50 - 40 - 10
            top: 20,
            right: 40, // left + axisWidth = 0 + 40
            bottom: 320,
        });
    });
    (0, vitest_1.it)('returns correct coordinates for right position', function () {
        var result = (0, useAxisCoordinates_1.getYAxisCoordinates)(drawingArea, {
            position: 'right',
            offset: 0,
            width: 40,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 450, // drawingArea.left + drawingArea.width + offset = 50 + 400 + 0
            top: 20,
            right: 490, // left + axisWidth = 450 + 40
            bottom: 320,
        });
    });
    (0, vitest_1.it)('returns correct coordinates for right position with offset', function () {
        var result = (0, useAxisCoordinates_1.getYAxisCoordinates)(drawingArea, {
            position: 'right',
            offset: 15,
            width: 40,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 465, // drawingArea.left + drawingArea.width + offset = 50 + 400 + 15
            top: 20,
            right: 505, // left + axisWidth = 465 + 40
            bottom: 320,
        });
    });
    (0, vitest_1.it)('defaults to left position when position is undefined', function () {
        var result = (0, useAxisCoordinates_1.getYAxisCoordinates)(drawingArea, {
            position: undefined,
            offset: 0,
            width: 40,
        });
        (0, vitest_1.expect)(result).to.deep.equal({
            left: 10, // same as left position
            top: 20,
            right: 50,
            bottom: 320,
        });
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var useTicks_1 = require("./useTicks");
var internals_1 = require("../internals");
describe('applyTickSpacing', function () {
    it('should return all domain values when tickSpacing allows it', function () {
        var domain = ['A', 'B', 'C', 'D', 'E'];
        var range = [0, 500];
        var tickSpacing = 100;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
    });
    it('should filter domain values when tickSpacing requires it', function () {
        var domain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        var range = [0, 100];
        var tickSpacing = 50;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A', 'F']);
    });
    it('should handle reversed range', function () {
        var domain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        var range = [100, 0];
        var tickSpacing = 50;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A', 'F']);
    });
    it('should handle ticks when range is not entirely divisible by the spacing', function () {
        var domain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        var range = [0, 100];
        var tickSpacing = 33;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A', 'E', 'I']);
    });
    it('should return only first element when tickSpacing is very large', function () {
        var domain = ['A', 'B', 'C', 'D', 'E'];
        var range = [0, 100];
        var tickSpacing = 500;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A']);
    });
    it('should handle small ranges with many domain values', function () {
        var domain = Array.from({ length: 100 }, function (_, i) { return "Item".concat(i); });
        var range = [0, 100];
        var tickSpacing = 20;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['Item0', 'Item20', 'Item40', 'Item60', 'Item80']);
    });
    it('should handle numeric domain values', function () {
        var domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var range = [0, 100];
        var tickSpacing = 50;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal([0, 5]);
    });
    it('should handle single element domain', function () {
        var domain = ['A'];
        var range = [0, 100];
        var tickSpacing = 50;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A']);
    });
    it('should handle zero range span', function () {
        var domain = ['A', 'B', 'C'];
        var range = [50, 50];
        var tickSpacing = 10;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A']);
    });
    it('should handle zero tick spacing', function () {
        var domain = ['A', 'B', 'C'];
        var range = [0, 100];
        var tickSpacing = 0;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A', 'B', 'C']);
    });
    it('should handle return all domain elements', function () {
        var domain = ['A', 'B', 'C', 'D'];
        var range = [0, 100];
        var tickSpacing = 25;
        var result = (0, useTicks_1.applyTickSpacing)(domain, range, tickSpacing);
        expect(result).to.deep.equal(['A', 'B', 'C', 'D']);
    });
});
describe('getTicks', function () {
    it('applies tickInterval before tickSpacing', function () {
        var scale = (0, internals_1.scaleBand)(Array.from({ length: 1000 }).map(function (_, i) { return "".concat(i); }), [0, 500]);
        var ticks = (0, useTicks_1.getTicks)({
            scale: scale,
            tickInterval: function (tick) { return tick % 101 === 0; },
            tickSpacing: 50,
            tickNumber: 5,
            isInside: function () { return true; },
        });
        expect(ticks.map(function (t) { return t.value; })).to.deep.equal([
            '0',
            '101',
            '202',
            '303',
            '404',
            '505',
            '606',
            '707',
            '808',
            '909',
        ]);
    });
});

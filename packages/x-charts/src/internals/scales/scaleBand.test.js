"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scaleBand_1 = require("./scaleBand");
describe('scaleBand', function () {
    it('scaleBand() has the expected defaults', function () {
        var s = (0, scaleBand_1.scaleBand)();
        expect(s.domain()).to.deep.equal([]);
        expect(s.range()).to.deep.equal([0, 1]);
        expect(s.bandwidth()).to.equal(1);
        expect(s.step()).to.equal(1);
        expect(s.round()).to.equal(false);
        expect(s.paddingInner()).to.equal(0);
        expect(s.paddingOuter()).to.equal(0);
        expect(s.align()).to.equal(0.5);
    });
    it('band(value) computes discrete bands in a continuous range', function () {
        var s = (0, scaleBand_1.scaleBand)([0, 960]);
        expect(s('foo')).to.equal(undefined);
        s.domain(['foo', 'bar']);
        expect(s('foo')).to.equal(0);
        expect(s('bar')).to.equal(480);
        s.domain(['a', 'b', 'c']).range([0, 120]);
        expect(s.domain().map(s)).to.deep.equal([0, 40, 80]);
        expect(s.bandwidth()).to.equal(40);
        s.padding(0.2);
        expect(s.domain().map(s)).to.deep.equal([7.5, 45, 82.5]);
        expect(s.bandwidth()).to.equal(30);
    });
    it('band(value) returns undefined for values outside the domain', function () {
        var s = (0, scaleBand_1.scaleBand)(['a', 'b', 'c'], [0, 1]);
        expect(s('d')).to.equal(undefined);
        expect(s('e')).to.equal(undefined);
        expect(s('f')).to.equal(undefined);
    });
    it('band(value) does not implicitly add values to the domain', function () {
        var s = (0, scaleBand_1.scaleBand)(['a', 'b', 'c'], [0, 1]);
        s('d');
        s('e');
        expect(s.domain()).to.deep.equal(['a', 'b', 'c']);
    });
    it('band.step() returns the distance between the starts of adjacent bands', function () {
        var s = (0, scaleBand_1.scaleBand)([0, 960]);
        expect(s.domain(['foo']).step()).to.equal(960);
        expect(s.domain(['foo', 'bar']).step()).to.equal(480);
        expect(s.domain(['foo', 'bar', 'baz']).step()).to.equal(320);
        s.padding(0.5);
        expect(s.domain(['foo']).step()).to.equal(640);
        expect(s.domain(['foo', 'bar']).step()).to.equal(384);
    });
    it('band.bandwidth() returns the width of the band', function () {
        var s = (0, scaleBand_1.scaleBand)([0, 960]);
        expect(s.domain([]).bandwidth()).to.equal(960);
        expect(s.domain(['foo']).bandwidth()).to.equal(960);
        expect(s.domain(['foo', 'bar']).bandwidth()).to.equal(480);
        expect(s.domain(['foo', 'bar', 'baz']).bandwidth()).to.equal(320);
        s.padding(0.5);
        expect(s.domain([]).bandwidth()).to.equal(480);
        expect(s.domain(['foo']).bandwidth()).to.equal(320);
        expect(s.domain(['foo', 'bar']).bandwidth()).to.equal(192);
    });
    it('band.domain([]) computes reasonable band and step values', function () {
        var s = (0, scaleBand_1.scaleBand)([0, 960]).domain([]);
        expect(s.step()).to.equal(960);
        expect(s.bandwidth()).to.equal(960);
        s.padding(0.5);
        expect(s.step()).to.equal(960);
        expect(s.bandwidth()).to.equal(480);
        s.padding(1);
        expect(s.step()).to.equal(960);
        expect(s.bandwidth()).to.equal(0);
    });
    it('band.domain([value]) computes a reasonable singleton band, even with padding', function () {
        var s = (0, scaleBand_1.scaleBand)([0, 960]).domain(['foo']);
        expect(s('foo')).to.equal(0);
        expect(s.step()).to.equal(960);
        expect(s.bandwidth()).to.equal(960);
        s.padding(0.5);
        expect(s('foo')).to.equal(320);
        expect(s.step()).to.equal(640);
        expect(s.bandwidth()).to.equal(320);
        s.padding(1);
        expect(s('foo')).to.equal(480);
        expect(s.step()).to.equal(480);
        expect(s.bandwidth()).to.equal(0);
    });
    it('band.domain(values) recomputes the bands', function () {
        var s = (0, scaleBand_1.scaleBand)().domain(['a', 'b', 'c']).rangeRound([0, 100]);
        expect(s.domain().map(s)).to.deep.equal([1, 34, 67]);
        expect(s.bandwidth()).to.equal(33);
        s.domain(['a', 'b', 'c', 'd']);
        expect(s.domain().map(s)).to.deep.equal([0, 25, 50, 75]);
        expect(s.bandwidth()).to.equal(25);
    });
    it('band.domain(domain) accepts an iterable', function () {
        expect((0, scaleBand_1.scaleBand)()
            .domain(new Set(['a', 'b', 'c']))
            .domain()).to.deep.equal(['a', 'b', 'c']);
    });
    it('band.domain(values) makes a copy of the specified domain values', function () {
        var domain = ['red', 'green'];
        var s = (0, scaleBand_1.scaleBand)().domain(domain);
        domain.push('blue');
        expect(s.domain()).to.deep.equal(['red', 'green']);
    });
    it('band.domain() returns a copy of the domain', function () {
        var s = (0, scaleBand_1.scaleBand)().domain(['red', 'green']);
        var domain = s.domain();
        expect(domain).to.deep.equal(['red', 'green']);
        domain.push('blue');
        expect(s.domain()).to.deep.equal(['red', 'green']);
    });
    it('band.range(values) can be descending', function () {
        var s = (0, scaleBand_1.scaleBand)().domain(['a', 'b', 'c']).range([120, 0]);
        expect(s.domain().map(s)).to.deep.equal([80, 40, 0]);
        expect(s.bandwidth()).to.equal(40);
        s.padding(0.2);
        expect(s.domain().map(s)).to.deep.equal([82.5, 45, 7.5]);
        expect(s.bandwidth()).to.equal(30);
    });
    it('band.range(values) makes a copy of the specified range values', function () {
        var range = [1, 2];
        var s = (0, scaleBand_1.scaleBand)().range(range);
        range.push('blue');
        expect(s.range()).to.deep.equal([1, 2]);
    });
    it('band.range() returns a copy of the range', function () {
        var s = (0, scaleBand_1.scaleBand)().range([1, 2]);
        var range = s.range();
        expect(range).to.deep.equal([1, 2]);
        range.push('blue');
        expect(s.range()).to.deep.equal([1, 2]);
    });
    it('band.range(values) accepts an iterable', function () {
        var s = (0, scaleBand_1.scaleBand)().range(new Set([1, 2]));
        expect(s.range()).to.deep.equal([1, 2]);
    });
    it('band.rangeRound(values) accepts an iterable', function () {
        var s = (0, scaleBand_1.scaleBand)().rangeRound(new Set([1, 2]));
        expect(s.range()).to.deep.equal([1, 2]);
    });
    it('band.range(values) coerces values to numbers', function () {
        var s = (0, scaleBand_1.scaleBand)().range(['1.0', '2.0']);
        expect(s.range()).to.deep.equal([1, 2]);
    });
    it('band.rangeRound(values) coerces values to numbers', function () {
        var s = (0, scaleBand_1.scaleBand)().rangeRound(['1.0', '2.0']);
        expect(s.range()).to.deep.equal([1, 2]);
    });
    it('band.paddingInner(p) specifies the inner padding p', function () {
        var s = (0, scaleBand_1.scaleBand)().domain(['a', 'b', 'c']).range([120, 0]).paddingInner(0.1).round(true);
        expect(s.domain().map(s)).to.deep.equal([83, 42, 1]);
        expect(s.bandwidth()).to.equal(37);
        s.paddingInner(0.2);
        expect(s.domain().map(s)).to.deep.equal([85, 43, 1]);
        expect(s.bandwidth()).to.equal(34);
    });
    it('band.paddingInner(p) coerces p to a number <= 1', function () {
        var s = (0, scaleBand_1.scaleBand)();
        expect(s.paddingInner('1.0').paddingInner()).to.equal(1);
        expect(s.paddingInner('-1.0').paddingInner()).to.equal(-1);
        expect(s.paddingInner('2.0').paddingInner()).to.equal(1);
        expect(Number.isNaN(s.paddingInner(NaN).paddingInner())).to.equal(true);
    });
    it('band.paddingOuter(p) specifies the outer padding p', function () {
        var s = (0, scaleBand_1.scaleBand)()
            .domain(['a', 'b', 'c'])
            .range([120, 0])
            .paddingInner(0.2)
            .paddingOuter(0.1);
        expect(s.domain().map(s)).to.deep.equal([84, 44, 4]);
        expect(s.bandwidth()).to.equal(32);
        s.paddingOuter(1);
        expect(s.domain().map(s)).to.deep.equal([75, 50, 25]);
        expect(s.bandwidth()).to.equal(20);
    });
    it('band.paddingOuter(p) coerces p to a number', function () {
        var s = (0, scaleBand_1.scaleBand)();
        expect(s.paddingOuter('1.0').paddingOuter()).to.equal(1);
        expect(s.paddingOuter('-1.0').paddingOuter()).to.equal(-1);
        expect(s.paddingOuter('2.0').paddingOuter()).to.equal(2);
        expect(Number.isNaN(s.paddingOuter(NaN).paddingOuter())).to.equal(true);
    });
    it('band.rangeRound(values) is an alias for band.range(values).round(true)', function () {
        var s = (0, scaleBand_1.scaleBand)().domain(['a', 'b', 'c']).rangeRound([0, 100]);
        expect(s.range()).to.deep.equal([0, 100]);
        expect(s.round()).to.equal(true);
    });
    it('band.round(true) computes discrete rounded bands in a continuous range', function () {
        var s = (0, scaleBand_1.scaleBand)().domain(['a', 'b', 'c']).range([0, 100]).round(true);
        expect(s.domain().map(s)).to.deep.equal([1, 34, 67]);
        expect(s.bandwidth()).to.equal(33);
        s.padding(0.2);
        expect(s.domain().map(s)).to.deep.equal([7, 38, 69]);
        expect(s.bandwidth()).to.equal(25);
    });
    it('band.copy() copies all fields', function () {
        var s1 = (0, scaleBand_1.scaleBand)()
            .domain(['red', 'green'])
            .range([1, 2])
            .round(true)
            .paddingInner(0.1)
            .paddingOuter(0.2);
        var s2 = s1.copy();
        expect(s2.domain()).to.deep.equal(s1.domain());
        expect(s2.range()).to.deep.equal(s1.range());
        expect(s2.round()).to.equal(s1.round());
        expect(s2.paddingInner()).to.equal(s1.paddingInner());
        expect(s2.paddingOuter()).to.equal(s1.paddingOuter());
    });
    it('band.copy() isolates changes to the domain', function () {
        var s1 = (0, scaleBand_1.scaleBand)().domain(['foo', 'bar']).range([0, 2]);
        var s2 = s1.copy();
        s1.domain(['red', 'blue']);
        expect(s2.domain()).to.deep.equal(['foo', 'bar']);
        expect(s1.domain().map(s1)).to.deep.equal([0, 1]);
        expect(s2.domain().map(s2)).to.deep.equal([0, 1]);
        s2.domain(['red', 'blue']);
        expect(s1.domain()).to.deep.equal(['red', 'blue']);
        expect(s1.domain().map(s1)).to.deep.equal([0, 1]);
        expect(s2.domain().map(s2)).to.deep.equal([0, 1]);
    });
    it('band.copy() isolates changes to the range', function () {
        var s1 = (0, scaleBand_1.scaleBand)().domain(['foo', 'bar']).range([0, 2]);
        var s2 = s1.copy();
        s1.range([3, 5]);
        expect(s2.range()).to.deep.equal([0, 2]);
        expect(s1.domain().map(s1)).to.deep.equal([3, 4]);
        expect(s2.domain().map(s2)).to.deep.equal([0, 1]);
        s2.range([5, 7]);
        expect(s1.range()).to.deep.equal([3, 5]);
        expect(s1.domain().map(s1)).to.deep.equal([3, 4]);
        expect(s2.domain().map(s2)).to.deep.equal([5, 6]);
    });
    // TODO align tests for padding & round
});

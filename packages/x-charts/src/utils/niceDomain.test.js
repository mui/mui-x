"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var niceDomain_1 = require("./niceDomain");
describe('niceDomain', function () {
    it('should return a nice domain for linear scale', function () {
        var domain = [0.7, 9.3];
        var nice = (0, niceDomain_1.niceDomain)('linear', domain);
        expect(nice).toEqual([0, 10]);
    });
    it('should return a nice domain for log scale', function () {
        var domain = [3, 97];
        var nice = (0, niceDomain_1.niceDomain)('log', domain);
        expect(nice).toEqual([1, 100]);
    });
    it('should return a nice domain for time scale', function () {
        var domain = [new Date('2023-01-15'), new Date('2023-03-20')];
        var nice = (0, niceDomain_1.niceDomain)('time', domain, 4);
        expect(nice).toEqual([new Date('2023-01-01'), new Date('2023-04-01')]);
    });
    it('should return a nice domain for time scale when timestamps are provided', function () {
        var domain = [new Date('2023-01-15').getTime(), new Date('2023-03-20').getTime()];
        var nice = (0, niceDomain_1.niceDomain)('time', domain, 4);
        expect(nice).toEqual([new Date('2023-01-01'), new Date('2023-04-01')]);
    });
    it('should return a nice domain for utc scale', function () {
        var domain = [new Date('2023-01-15'), new Date('2023-03-20')];
        var nice = (0, niceDomain_1.niceDomain)('utc', domain, 4);
        expect(nice).toEqual([new Date('2023-01-01'), new Date('2023-04-01')]);
    });
    it('should return a nice domain for linear scale depending on the tick count', function () {
        var domain = [29, 72];
        expect((0, niceDomain_1.niceDomain)('linear', domain, 5)).toEqual([20, 80]);
        expect((0, niceDomain_1.niceDomain)('linear', domain, 11)).toEqual([25, 75]);
    });
});

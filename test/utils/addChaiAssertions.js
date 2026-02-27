"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
chai.use(function (chaiAPI, utils) {
    chaiAPI.Assertion.addMethod('toEqualDateTime', function toEqualDateTime(expectedDate, message) {
        // eslint-disable-next-line no-underscore-dangle
        var actualDate = this._obj;
        // Luxon dates don't have a `toISOString` function, we need to convert to the JS date first
        var cleanActualDate = typeof actualDate.toJSDate === 'function' ? actualDate.toJSDate() : actualDate;
        var cleanExpectedDate;
        if (typeof expectedDate === 'string') {
            cleanExpectedDate = new Date(expectedDate);
        }
        else if (typeof expectedDate.toJSDate === 'function') {
            cleanExpectedDate = expectedDate.toJSDate();
        }
        else {
            cleanExpectedDate = expectedDate;
        }
        var assertion = new chaiAPI.Assertion(cleanActualDate.toISOString(), message);
        // TODO: Investigate if `as any` can be removed after https://github.com/DefinitelyTyped/DefinitelyTyped/issues/48634 is resolved.
        utils.transferFlags(this, assertion, false);
        assertion.to.equal(cleanExpectedDate.toISOString());
    });
});

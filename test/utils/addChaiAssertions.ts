import chai from 'chai';

// https://stackoverflow.com/a/46755166/3406963
declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Matcher with useful error messages if the dates don't match.
       */
      toEqualDateTime(expected: Date): void;
    }
  }
}

chai.use((chaiAPI, utils) => {
  chai.Assertion.addMethod('toEqualDateTime', function toEqualDateTime(expectedDate, message) {
    // eslint-disable-next-line no-underscore-dangle
    const actualDate = this._obj;

    // Luxon dates don't have a `toISOString` function, we need to convert to the JS date first
    const cleanActualDate =
      typeof actualDate.toJSDate === 'function' ? actualDate.toJSDate() : actualDate;
    const cleanExpectedDate =
      typeof expectedDate.toJSDate === 'function' ? expectedDate.toJSDate() : expectedDate;

    const assertion = new chai.Assertion(cleanActualDate.toISOString(), message);
    // TODO: Investigate if `as any` can be removed after https://github.com/DefinitelyTyped/DefinitelyTyped/issues/48634 is resolved.
    utils.transferFlags(this as any, assertion, false);
    assertion.to.equal(cleanExpectedDate.toISOString());
  });
});

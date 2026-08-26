import { chai } from 'vitest';
// https://stackoverflow.com/a/46755166/3406963
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface Assertion {
      /**
       * Matcher with useful error messages if the dates don't match.
       */
      toEqualDateTime(expected: any): void;
    }
  }
}

// Luxon and Temporal values have no `toISOString`.
const toJSDate = (date: any) => {
  if (typeof date.toJSDate === 'function') {
    return date.toJSDate();
  }
  if (typeof date.epochMilliseconds === 'number') {
    return new Date(date.epochMilliseconds);
  }
  return date;
};

chai.use((chaiAPI, utils) => {
  chaiAPI.Assertion.addMethod('toEqualDateTime', function toEqualDateTime(expectedDate, message) {
    // eslint-disable-next-line no-underscore-dangle
    const actualDate = this._obj;

    const cleanActualDate = toJSDate(actualDate);

    const cleanExpectedDate =
      typeof expectedDate === 'string' ? new Date(expectedDate) : toJSDate(expectedDate);

    const assertion = new chaiAPI.Assertion(cleanActualDate.toISOString(), message);
    // TODO: Investigate if `as any` can be removed after https://github.com/DefinitelyTyped/DefinitelyTyped/issues/48634 is resolved.
    utils.transferFlags(this as any, assertion, false);
    assertion.to.equal(cleanExpectedDate.toISOString());
  });
});

export {};

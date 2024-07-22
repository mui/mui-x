declare module 'chai' {
  global {
    export namespace Chai {
      interface Assertion {
        /**
         * Matcher with useful error messages if the dates don't match.
         */
        toEqualDateTime(expected: any): void;
      }
    }
  }
}

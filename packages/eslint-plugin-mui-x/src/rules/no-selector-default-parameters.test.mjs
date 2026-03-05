import { afterAll, it, describe } from 'vitest';
import { RuleTester } from '@typescript-eslint/rule-tester';
import TSESlintParser from '@typescript-eslint/parser';
import rule from './no-selector-default-parameters.mjs';

RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: TSESlintParser,
  },
});

ruleTester.run('no-selector-default-parameters', rule, {
  valid: [
    {
      name: 'createSelector with no default params',
      code: `createSelector(inputSelector, (data, param) => data)`,
    },
    {
      name: 'createSelectorMemoized with no default params',
      code: `createSelectorMemoized(inputSelector, (data, param) => data)`,
    },
    {
      name: 'createSelectorMemoizedWithOptions with no default params',
      code: `createSelectorMemoizedWithOptions()(inputSelector, (data, param) => data)`,
    },
    {
      name: 'regular function with default params (not a selector)',
      code: `someOtherFunction(inputSelector, (data, param = 'default') => data)`,
    },
    {
      name: 'createSelector with no arguments',
      code: `createSelector()`,
    },
    {
      name: 'createSelector where last arg is not a function',
      code: `createSelector(inputSelector, someVariable)`,
    },
  ],
  invalid: [
    {
      name: 'createSelector with arrow function default param',
      code: `createSelector(inputSelector, (data, param = 'default') => data)`,
      errors: [{ messageId: 'no-default-param' }],
    },
    {
      name: 'createSelectorMemoized with arrow function default param',
      code: `createSelectorMemoized(inputSelector, (data, param = 'default') => data)`,
      errors: [{ messageId: 'no-default-param' }],
    },
    {
      name: 'createSelectorMemoizedWithOptions with arrow function default param',
      code: `createSelectorMemoizedWithOptions()(inputSelector, (data, param = 'default') => data)`,
      errors: [{ messageId: 'no-default-param' }],
    },
    {
      name: 'createSelector with function expression default param',
      code: `createSelector(inputSelector, function(data, param = 'default') { return data; })`,
      errors: [{ messageId: 'no-default-param' }],
    },
    {
      name: 'createSelector with destructured default',
      code: `createSelector(inputSelector, (data, { field = 'name' } = {}) => data)`,
      errors: [
        { messageId: 'no-default-param' },
        { messageId: 'no-default-param' },
      ],
    },
    {
      name: 'createSelector with multiple default params',
      code: `createSelector(inputSelector, (data, a = 1, b = 2) => data)`,
      errors: [
        { messageId: 'no-default-param' },
        { messageId: 'no-default-param' },
      ],
    },
  ],
});

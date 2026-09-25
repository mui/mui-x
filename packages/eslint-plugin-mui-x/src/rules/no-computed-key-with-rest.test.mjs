import { afterAll, it, describe } from 'vitest';
import { RuleTester } from '@typescript-eslint/rule-tester';
import TSESlintParser from '@typescript-eslint/parser';
import rule from './no-computed-key-with-rest.mjs';

RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: TSESlintParser,
  },
});

ruleTester.run('no-computed-key-with-rest', rule, {
  valid: [
    {
      name: 'identifier key next to a rest element',
      code: `
const removeField = (model: Record<string, string>, field: string) => {
  const { [field]: removed, ...rest } = model;
  return rest;
};
      `,
    },
    {
      name: 'literal key next to a rest element',
      code: `
const removeField = (model: Record<string, string>) => {
  const { ['field']: removed, ...rest } = model;
  return rest;
};
      `,
    },
    {
      name: 'member expression key without a rest element',
      code: `
const readField = (model: Record<string, string>, colDef: { field: string }) => {
  const { [colDef.field]: value } = model;
  return value;
};
      `,
    },
    {
      name: 'member expression key hoisted into a variable',
      code: `
const removeField = (model: Record<string, string>, colDef: { field: string }) => {
  const { field } = colDef;
  const { [field]: removed, ...rest } = model;
  return rest;
};
      `,
    },
    {
      name: 'static key next to a rest element',
      code: `
const removeField = (model: { field: string; other: string }) => {
  const { field, ...rest } = model;
  return rest;
};
      `,
    },
  ],
  invalid: [
    {
      name: 'member expression key next to a rest element',
      code: `
const removeField = (model: Record<string, string>, colDef: { field: string }) => {
  const { [colDef.field]: removed, ...rest } = model;
  return rest;
};
      `,
      errors: [{ messageId: 'computed-key', line: 3, column: 12 }],
    },
    {
      name: 'optional member expression key next to a rest element',
      code: `
const removeField = (model: Record<string, string>, colDef?: { field: string }) => {
  const { [colDef?.field as string]: removed, ...rest } = model;
  return rest;
};
      `,
      errors: [{ messageId: 'computed-key', line: 3, column: 12 }],
    },
    {
      name: 'call expression key next to a rest element',
      code: `
const removeField = (model: Record<string, string>, getField: () => string) => {
  const { [getField()]: removed, ...rest } = model;
  return rest;
};
      `,
      errors: [{ messageId: 'computed-key', line: 3, column: 12 }],
    },
    {
      name: 'computed key next to a rest element and a used binding',
      code: `
const removeField = (model: Record<string, string>, colDef: { field: string }) => {
  const { [colDef.field]: removed, ...rest } = model;
  return [removed, rest];
};
      `,
      errors: [{ messageId: 'computed-key', line: 3, column: 12 }],
    },
    {
      name: 'computed key in a nested pattern',
      code: `
const removeField = (state: { model: Record<string, string> }, colDef: { field: string }) => {
  const {
    model: { [colDef.field]: removed, ...rest },
  } = state;
  return rest;
};
      `,
      errors: [{ messageId: 'computed-key', line: 4, column: 15 }],
    },
  ],
});

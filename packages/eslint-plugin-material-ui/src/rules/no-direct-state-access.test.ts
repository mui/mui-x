import { afterAll, it, describe } from 'vitest';
import { RuleTester } from '@typescript-eslint/rule-tester';
import TSESlintParser from '@typescript-eslint/parser';
import rule from './no-direct-state-access';
import path from 'node:path';

RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: TSESlintParser,
    parserOptions: {
      tsconfigRootDir: path.join(__dirname, '../fixtures'),
      project: './tsconfig.json',
    },
  },
});

ruleTester.run('no-direct-state-access', rule, {
  valid: [
    `
const useCustomHook = (apiRef: GridApiRef) => {
  const state = apiRef.current.state;
}
    `,
    `
const useCustomHook = (api: any) => {
  const rows = api.current.state.rows;
}
    `,
    `
const useCustomHook = (api: any) => {
  const rows = gridRowsSelector(api.current.state);
}
    `,
  ],
  invalid: [
    {
      code: `
type GridApiRef = React.MutableRefObject<any>;
const useCustomHook = (apiRef: GridApiRef) => {
  const rows = apiRef.current.state.rows;
}
          `,
      errors: [{ messageId: 'direct-access', line: 4, column: 16 }],
    },
    {
      code: `
type GridApiRef = React.MutableRefObject<any>;
const useGridApiContext = (): GridApiRef => { return {} };
const useCustomHook = () => {
  const apiRef = useGridApiContext();
  const rows = apiRef.current.state.rows;
}
          `,
      errors: [{ messageId: 'direct-access', line: 6, column: 16 }],
    },
    {
      code: `
type GridApiRef = React.MutableRefObject<any>;
const useGridApiContext = (): GridApiRef => { return {} };
const useCustomHook = () => {
  const apiRef = useGridApiContext();
  const { rows } = apiRef.current.state;
}
          `,
      errors: [{ messageId: 'direct-access', line: 6, column: 9 }],
    },
  ],
});

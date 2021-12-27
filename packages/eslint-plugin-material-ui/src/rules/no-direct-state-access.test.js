// @eslint/eslintrc uses the presence of `document` to detect if it's on node or web.
// By having a document but not a real browser, the tests here fail.
// TODO setup JSDOM only before those tests that need it.
const originalDocument = global.document;
global.document = undefined;

const path = require('path');
const { TSESLint } = require('@typescript-eslint/experimental-utils');
const rule = require('./no-direct-state-access');

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    tsconfigRootDir: path.join(__dirname, '../fixtures'),
    project: './tsconfig.json',
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

global.document = originalDocument;

// moment ships per-locale entry points as plain .js files without `.d.ts`
// shims. Provide an ambient module declaration so TS accepts side-effect
// imports like `import 'moment/locale/de'` under `noUncheckedSideEffectImports`
// (which TS 6 turns on by default).
//
// Kept under `test/utils/` rather than in a package's `src/` so it stays
// out of the published `.d.ts` build output. Reference this file from any
// package's `tsconfig.json` `include` that needs it.
declare module 'moment/locale/*' {}

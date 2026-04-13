# `@mui/internal-docs-infra` OOM on large component types — diagnosis

**Scope:** `@mui/internal-docs-infra@0.7.1-canary.1`, specifically
`pipeline/loadServerTypes/typeHighlighting.mjs::formatInlineTypeAsHast`.

## Symptom

Running `pnpm dev` on mui-x docs with a `types.ts` page entry that calls
`createTypes(import.meta.url, DataGrid)` produces a 500 after ~100s with:

```
⨯ ./pages/x/api/data-grid/types.data-grid.ts
Error: fail to memory allocation
...
⨯ ./pages/x/api/data-grid/types.data-grid.ts
RuntimeError: memory access out of bounds
    at wasm://wasm/001ce0fe:wasm-function[218]:0x26b63
    at wasm://wasm/001ce0fe:wasm-function[202]:0x23386
```

The WASM module with hash `001ce0fe` is **Oniguruma**, consumed by
`@wooorm/starry-night` for TextMate-grammar syntax highlighting.

## Root cause

`formatInlineTypeAsHast(typeText, unionPrintWidth)` is called once per
individual type string that needs syntax highlighting. It is **not memoized**.

Instrumenting the call site to log every input for DataGrid revealed:

- **1947 total calls** over the ~100s extraction window
- **5 unique input strings** (sizes: 1848 and 5779 chars each, repeated)
- Average ~389 calls per unique input

Each call pipes the text through `transformHtmlCodeInline` →
`parseSource` → Oniguruma's regex VM. Oniguruma runs inside a fixed-size
WebAssembly linear memory buffer; each regex match allocates scratch
space inside that buffer. With thousands of redundant invocations on
the same inputs, the WASM heap fragments and eventually overruns.

This is **not** a "single huge input" failure. The inputs are all well
under any reasonable size cap. It is a cumulative resource leak via call
count.

## Where the duplication comes from

`buildHighlightedExports()` in `highlightTypes.mjs` builds a map of
`{ExportName.Props, .DataAttributes, .CssVariables}` entries, each of
which calls `formatInlineTypeAsHast` on a synthetic object type string.
Separately, `highlightTypesMeta()` walks every prop and calls
`formatInlineTypeAsHast` on each prop's `typeText` and `shortType`.

For DataGrid, many props share the same nested structural type
(e.g. `GridColDef<R, V, F>`, `GridRowModesModel`, `GridCallbackDetails`).
Each reference re-enters the formatter with the same string. Multiply
~400 props × shared types × multiple fields (type/shortType/default/
detailedType) and you land at ~2000 calls with ~5 unique strings.

## Fix

**Filed as mui-public branch `jcquintas/fix-highlightTypes-memoization`
(commit `e60dafa2`).** Wraps `formatInlineTypeAsHast` with a
`Map<string, Promise<HastRoot>>` keyed on
`${unionPrintWidth ?? ''}:${typeText}`. Deep-clones the cached result on
return to prevent downstream mutation from poisoning the cache.
Adds 4 regression tests under `typeHighlighting > memoization`.

```js
const __cache = new Map();
const impl = async function (typeText, unionPrintWidth) { /* original body */ };
export async function formatInlineTypeAsHast(typeText, unionPrintWidth) {
  const key = `${unionPrintWidth ?? ''}:${typeText}`;
  let cached = __cache.get(key);
  if (!cached) {
    cached = impl(typeText, unionPrintWidth);
    __cache.set(key, cached);
  }
  const result = await cached;
  return structuredClone(result);
}
```

## Verification

With the above patch applied locally to the installed
`@mui/internal-docs-infra` under `node_modules/.pnpm`:

- `/x/api/data-grid/data-grid` compiles in **63s** (previously: crash)
- `/x/api/charts/gauge` compiles in ~8s cold / ~140ms warm (unchanged)
- No `RuntimeError: memory access out of bounds`
- The 6 `Unable to handle a type with flag "TemplateLiteral"` warnings
  are unrelated and survive the fix — they come from
  `typescript-api-extractor/dist/parsers/typeResolver.js:295` and are a
  separate best-effort fallback, not a crash path.

## Related concerns worth filing separately

1. **`typeResolver.js:295` silently downgrades `TemplateLiteral` types
   to `any`.** The warning doesn't surface to the build user and the
   downgraded types appear in docs as `any`, which is a correctness bug.
2. **DataGrid's extracted type shape is wrong.** Even with the OOM
   fixed, the extractor only surfaces 1 prop (`pagination`) on DataGrid
   and emits ~40 `BasePropsOverrides` augmentation interfaces as
   additional types. The generic component signature isn't being fully
   instantiated. Separate investigation needed.
3. **`loadTypescriptConfig.mts` `extends` resolver.** Doesn't handle
   node_modules package specifiers. Worked around by flattening
   mui-x's root tsconfig in commit `efe32b0bf9`.

## Repro steps on this branch

1. Check out `docs-apitest-infra`.
2. Apply the memoization patch above to
   `node_modules/.pnpm/@mui+internal-docs-infra@*/node_modules/@mui/internal-docs-infra/pipeline/loadServerTypes/typeHighlighting.mjs`.
3. `cd docs && PORT=3099 pnpm dev`
4. `curl -L http://localhost:3099/x/api/data-grid/data-grid` → HTTP 200
5. Without the patch, same command → 500 after ~100s with the WASM
   stack trace above.

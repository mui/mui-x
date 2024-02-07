# Profiling

This folder contains a build config to enable low-level profiling with [d8](https://v8.dev/docs/d8).

#### Requirements

- A `V8` build (debug or not). Either install the package or build from source.
- A linux system or docker container.
- The `perf` tool

## Usage

Create a test case, see [./src/filtering.ts](./src/filtering.ts) for an example.

Build it with:

```
npx webpack --env=target=./src/filtering.ts
```

And run the test case:

```
perf record -g ~/src/v8/v8/x64.debug/d8 --perf-basic-prof ./build/bundle.js
```

The perf report can be inspected with `perf report` or any other tool such as
[hotspot](https://github.com/KDAB/hotspot).

## Building V8

- Checkout the code: https://v8.dev/docs/source-code
- Build: https://v8.dev/docs/build-gn

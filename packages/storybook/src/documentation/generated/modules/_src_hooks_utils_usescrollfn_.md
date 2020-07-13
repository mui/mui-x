[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/utils/useScrollFn"](_src_hooks_utils_usescrollfn_.md)

# Module: "src/hooks/utils/useScrollFn"

## Index

### Interfaces

- [ScrollParams](../interfaces/_src_hooks_utils_usescrollfn_.scrollparams.md)

### Type aliases

- [ScrollFn](_src_hooks_utils_usescrollfn_.md#scrollfn)

### Functions

- [useScrollFn](_src_hooks_utils_usescrollfn_.md#usescrollfn)

## Type aliases

### ScrollFn

Ƭ **ScrollFn**: _function_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useScrollFn.ts:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useScrollFn.ts#L10)_

#### Type declaration:

▸ (`v`: [ScrollParams](../interfaces/_src_hooks_utils_usescrollfn_.scrollparams.md)): _void_

**Parameters:**

| Name | Type                                                                        |
| ---- | --------------------------------------------------------------------------- |
| `v`  | [ScrollParams](../interfaces/_src_hooks_utils_usescrollfn_.scrollparams.md) |

## Functions

### useScrollFn

▸ **useScrollFn**(`scrollingElementRef`: RefObject‹HTMLDivElement›, `onScroll?`: [ScrollFn](_src_hooks_utils_usescrollfn_.md#scrollfn)): _[[ScrollFn](_src_hooks_utils_usescrollfn_.md#scrollfn), [ScrollFn](_src_hooks_utils_usescrollfn_.md#scrollfn)]_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useScrollFn.ts:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useScrollFn.ts#L12)_

**Parameters:**

| Name                  | Type                                                  |
| --------------------- | ----------------------------------------------------- |
| `scrollingElementRef` | RefObject‹HTMLDivElement›                             |
| `onScroll?`           | [ScrollFn](_src_hooks_utils_usescrollfn_.md#scrollfn) |

**Returns:** _[[ScrollFn](_src_hooks_utils_usescrollfn_.md#scrollfn), [ScrollFn](_src_hooks_utils_usescrollfn_.md#scrollfn)]_

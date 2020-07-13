[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/utils/useLogger"](_src_hooks_utils_uselogger_.md)

# Module: "src/hooks/utils/useLogger"

## Index

### Interfaces

- [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)

### Type aliases

- [LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn)

### Variables

- [LOG_LEVELS](_src_hooks_utils_uselogger_.md#const-log_levels)
- [factory](_src_hooks_utils_uselogger_.md#let-factory)
- [forceDebug](_src_hooks_utils_uselogger_.md#const-forcedebug)
- [isDebugging](_src_hooks_utils_uselogger_.md#const-isdebugging)

### Functions

- [defaultFactory](_src_hooks_utils_uselogger_.md#const-defaultfactory)
- [getAppender](_src_hooks_utils_uselogger_.md#const-getappender)
- [noop](_src_hooks_utils_uselogger_.md#const-noop)
- [useLogger](_src_hooks_utils_uselogger_.md#uselogger)
- [useLoggerFactory](_src_hooks_utils_uselogger_.md#useloggerfactory)

### Object literals

- [noopLogger](_src_hooks_utils_uselogger_.md#const-nooplogger)

## Type aliases

### LoggerFactoryFn

Ƭ **LoggerFactoryFn**: _function_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:54](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L54)_

#### Type declaration:

▸ (`name`: string): _[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `name` | string |

## Variables

### `Const` LOG_LEVELS

• **LOG_LEVELS**: _string[]_ = ['debug', 'info', 'warn', 'error']

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L22)_

---

### `Let` factory

• **factory**: _[LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn) | null_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:57](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L57)_

---

### `Const` forceDebug

• **forceDebug**: _boolean_ = localStorage.getItem('DEBUG') != null

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:4](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L4)_

---

### `Const` isDebugging

• **isDebugging**: _boolean_ = process.env.NODE_ENV !== 'production' || forceDebug

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:5](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L5)_

## Functions

### `Const` defaultFactory

▸ **defaultFactory**(`logLevel`: string): _(Anonymous function)_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:45](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L45)_

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `logLevel` | string |

**Returns:** _(Anonymous function)_

---

### `Const` getAppender

▸ **getAppender**(`name`: string, `logLevel`: string, `appender`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)): _[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L23)_

**Parameters:**

| Name       | Type                                                          | Default |
| ---------- | ------------------------------------------------------------- | ------- |
| `name`     | string                                                        | -       |
| `logLevel` | string                                                        | -       |
| `appender` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) | console |

**Returns:** _[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)_

---

### `Const` noop

▸ **noop**(): _void_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L15)_

**Returns:** _void_

---

### useLogger

▸ **useLogger**(`name`: string): _[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:80](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L80)_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `name` | string |

**Returns:** _[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)_

---

### useLoggerFactory

▸ **useLoggerFactory**(`customLogger?`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) | [LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn), `logLevel`: string | boolean): _void_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:58](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L58)_

**Parameters:**

| Name            | Type                                                                                                                                   | Default |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `customLogger?` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) &#124; [LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn) | -       |
| `logLevel`      | string &#124; boolean                                                                                                                  | "info"  |

**Returns:** _void_

## Object literals

### `Const` noopLogger

### ▪ **noopLogger**: _object_

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L16)_

### debug

• **debug**: _[noop](_src_hooks_utils_uselogger_.md#const-noop)_ = noop

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L17)_

### error

• **error**: _[noop](_src_hooks_utils_uselogger_.md#const-noop)_ = noop

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L20)_

### info

• **info**: _[noop](_src_hooks_utils_uselogger_.md#const-noop)_ = noop

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L18)_

### warn

• **warn**: _[noop](_src_hooks_utils_uselogger_.md#const-noop)_ = noop

_Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L19)_

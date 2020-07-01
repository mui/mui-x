[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/utils/useLogger"](_src_hooks_utils_uselogger_.md)

# Module: "src/hooks/utils/useLogger"

## Index

### Interfaces

* [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)

### Type aliases

* [LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn)

### Variables

* [LOG_LEVELS](_src_hooks_utils_uselogger_.md#const-log_levels)
* [factory](_src_hooks_utils_uselogger_.md#let-factory)
* [forceDebug](_src_hooks_utils_uselogger_.md#const-forcedebug)
* [isDebugging](_src_hooks_utils_uselogger_.md#const-isdebugging)

### Functions

* [defaultFactory](_src_hooks_utils_uselogger_.md#const-defaultfactory)
* [getAppender](_src_hooks_utils_uselogger_.md#const-getappender)
* [noop](_src_hooks_utils_uselogger_.md#const-noop)
* [useLogger](_src_hooks_utils_uselogger_.md#uselogger)
* [useLoggerFactory](_src_hooks_utils_uselogger_.md#useloggerfactory)

### Object literals

* [noopLogger](_src_hooks_utils_uselogger_.md#const-nooplogger)

## Type aliases

###  LoggerFactoryFn

Ƭ **LoggerFactoryFn**: *function*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:52](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L52)*

#### Type declaration:

▸ (`name`: string): *[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

## Variables

### `Const` LOG_LEVELS

• **LOG_LEVELS**: *string[]* = ['debug', 'info', 'warn', 'error']

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:22](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L22)*

___

### `Let` factory

• **factory**: *[LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn) | null*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:55](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L55)*

___

### `Const` forceDebug

• **forceDebug**: *boolean* = localStorage.getItem('DEBUG') != null

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:4](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L4)*

___

### `Const` isDebugging

• **isDebugging**: *boolean* = process.env.NODE_ENV !== 'production' || forceDebug

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:5](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L5)*

## Functions

### `Const` defaultFactory

▸ **defaultFactory**(`logLevel`: string): *(Anonymous function)*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:45](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`logLevel` | string |

**Returns:** *(Anonymous function)*

___

### `Const` getAppender

▸ **getAppender**(`name`: string, `logLevel`: string, `appender`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)): *[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:23](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L23)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`name` | string | - |
`logLevel` | string | - |
`appender` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) | console |

**Returns:** *[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)*

___

### `Const` noop

▸ **noop**(): *void*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:15](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L15)*

**Returns:** *void*

___

###  useLogger

▸ **useLogger**(`name`: string): *[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:73](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *[Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)*

___

###  useLoggerFactory

▸ **useLoggerFactory**(`customLogger?`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) | [LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn), `logLevel`: string | boolean): *void*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:56](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L56)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`customLogger?` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) &#124; [LoggerFactoryFn](_src_hooks_utils_uselogger_.md#loggerfactoryfn) | - |
`logLevel` | string &#124; boolean | "info" |

**Returns:** *void*

## Object literals

### `Const` noopLogger

### ▪ **noopLogger**: *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:16](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L16)*

###  debug

• **debug**: *[noop](_src_hooks_utils_uselogger_.md#const-noop)* = noop

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:17](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L17)*

###  error

• **error**: *[noop](_src_hooks_utils_uselogger_.md#const-noop)* = noop

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:20](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L20)*

###  info

• **info**: *[noop](_src_hooks_utils_uselogger_.md#const-noop)* = noop

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:18](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L18)*

###  warn

• **warn**: *[noop](_src_hooks_utils_uselogger_.md#const-noop)* = noop

*Defined in [packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts:19](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/utils/useLogger.ts#L19)*

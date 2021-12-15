<p align="center">
  <a href="https://mui.com/" rel="noopener" target="_blank"><img width="150" src="https://mui.com/static/logo.svg" alt="MUI logo"></a>
</p>

<h1 align="center">MUI X DataGrid overview</h1>

Welcome on the documentation for contributor. If you want to use DataGrid components for your project, the [documention for developpers](https://mui.com/components/data-grid/getting-started/) is more appropriate.
Here we will discuss about how the code is structure, to simplify codebase navigation, and onboard new contributor.

# Where is the code?

Most of the code is in `packages/grid/_modules_/grid/`. From this folder, you will find the two most important folders:

- `./components` which contains all the React components. These files are responsible for displaying the grid an listen for user interactions.
- `./hooks` which contains all the logic of the DataGrid.
  - `hooks/core` defines logics for developers: initialization of the grid, error handling, translations, ...
  - `hooks/utils` defines logics for contributors: manipulating the state, managing events, ...
  - `hooks/features` defines logics for end-users: selection, filtering, editing, ...

The `./models` folder is mostly for type definition, except `./models/colDef` which also contains the default values of the column definition for each [column type](https://mui.com/components/data-grid/columns/#column-types).

The other part of the codebase that could interest you are

- `packages/grid/_modules_/x-data-grid/src/tests/`
- `packages/grid/_modules_/x-data-grid-pro/src/tests/`

which respectively contains the unit tests for `DataGrid` and `DataGridPro` features.

# How does it works?

![Workflow Scheme](./img/overviewSchemDark.svg#gh-dark-mode-only)
![Workflow Scheme](./img/overviewSchemLight.svg#gh-light-mode-only)

## Accessing state

The react components can access to the state with either selectors or getter methods.
Here is an example.

```js
const apiRef = useGridApiContext();

const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
const addFilterLabel = apiRef.current.getLocaleText('filterPanelAddFilter');
```

## Updating state

To update the state, the component can either call a setter or publish an event. Here are example with updating cell editing by setter, and handling cell key down by dispatching `GridEvents.cellKeyDown` event.

```js
apiRef.current.setEditCellValue(newParams, event);
apiRef.current.publishEvent(GridEvents.cellKeyDown, params, event as any);
```

Publishing an events allows to trigger multiple features. For example, `GridEvents.cellKeyDown` is listen by the focus, edit and navigation feature hooks. Each of them define an event handler which will trigger their logic.

```js
useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
```

The other interest of events is that developers can listen them by subscribing to the event for example [the documentation](https://mui.com/components/data-grid/events/) or by providing a `on<Event>` prop such as `onEditCellPropsChange`.

# Specific features

Here you wil find more precision about how some features are designed.

- [filtering](./filtering)
- virtualization (TODO)
- print (TODO)

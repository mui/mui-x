# Changelog

> For full v8 changelog, please refer to the [v.8x branch](https://github.com/mui/mui-x/blob/v8.x/CHANGELOG.md).

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 9.0.0-alpha.0

_Feb 13, 2026_

We'd like to extend a big thank you to the 21 contributors who made this release possible. Here are some highlights ✨:

- [DataGrid][Pickers] Add `thTH` translations (#21116) @siriwatknp
- [pickers] Add `AdapterDayjsBuddhist` adapter (#20984) @siriwatknp

Special thanks go out to these community members for their valuable contributions:
@Copilot, @jhe-iqbis

The following team members contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @brijeshb42, @cherniavskii, @dav-is, @flaviendelangle, @Janpot, @JCQuintas, @mapache-salvaje, @MBilalShafi, @michelengelen, @mj12albert, @noraleonte, @oliviertassinari, @rita-codes, @romgrk, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@9.0.0-alpha.0`

- [DataGrid][docs] Add high-level competitor comparison to Overview doc (DX-117) (#20870) @mapache-salvaje
- [DataGrid] Update default `logicOperator` behavior in filtering docs (#21098) @michelengelen
- [DataGrid][docs] Remove Bundling section from quickstart (#21177) @MBilalShafi
- [DataGrid][Pickers] Add `thTH` translations (#21116) @siriwatknp
- [DataGrid] Fix initial filter value state in CustomMultiValueOperator demo (#21217) @sai6855

#### `@mui/x-data-grid-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-alpha.0`, plus:

- [DataGridPro] Cleanup outdated rows on `dataSource` reference update (#21138) @MBilalShafi

#### `@mui/x-data-grid-premium@9.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-alpha.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.0-alpha.0`

- [pickers] Add `AdapterDayjsBuddhist` adapter (#20984) @siriwatknp

#### `@mui/x-date-pickers-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-alpha.0`.

### Charts

#### `@mui/x-charts@9.0.0-alpha.0`

- [charts] Add Legend actions (#20404) @JCQuintas
- [charts] Add `Chart` suffix to MUI Classes (#21042) @JCQuintas
- [charts] Add `axesGap` props to put space between axes (#20904) @alexfauquette
- [charts] Add `cleanIdentifier` function to charts series instance (#20832) @JCQuintas
- [charts] Add `initialHiddenItems` prop to set initial state (#20894) @JCQuintas
- [charts] Add `useXAxisCoordinates` and `useYAxisCoordinates` hooks (#20972) @bernardobelchior
- [charts] Add axis slots and expose axis ticks hooks (#20935) @bernardobelchior
- [charts] Change `line` legend marker to be a line (#21059) @JCQuintas
- [charts] Codemod test pattern with function (#21111) @JCQuintas
- [charts] Control the item tooltip (#20617) @alexfauquette
- [charts] Enable keyboard navigation in radar chart (#20765) @alexfauquette
- [charts] Export `CartesianChartSeriesType` and `StackableChartSeriesType` (#21012) @bernardobelchior
- [charts] Export plugins from premium (#20866) @JCQuintas
- [charts] Filter hidden series from axis tooltip (#21273) @Copilot
- [charts] Fix cleanup function in useChartInteractionListener to correctly remove event listeners with options (#21218) @sai6855
- [charts] Fix import rename in codemod (#21112) @JCQuintas
- [charts] Fix multiple exports of `HighlightScope` (#21270) @bernardobelchior
- [charts] Fix test inconsistency in charts (#20907) @JCQuintas
- [charts] Fix tooltip position for stacked line series (#20901) @alexfauquette
- [charts] Make Highlight scope a generic (#21189) @alexfauquette
- [charts] Make `LegendItemParams.type` required (#21003) @alexfauquette
- [charts] Make `seriesId` a string only (#20997) @alexfauquette
- [charts] Make the `useChartRootRef` support typing parameter (#21023) @alexfauquette
- [charts] Memoize HeatmapItem to avoid re-render when fading/highlighting (#20865) @bernardobelchior
- [charts] Move AxisId to `data-axis-id` attribute instead of class (#21037) @JCQuintas
- [charts] Move `cleanIdentifier` and `serializeIdentifier` instance methods to `useChartSeriesConfig` plugin (#21025) @JCQuintas
- [charts] Move `seriesConfig` to `useChartSeriesConfig` plugin (#21004) @JCQuintas
- [charts] Move element refs to `useChartElementRef` plugin (#21099) @JCQuintas
- [charts] Move types related to `seriesConfig` into the `useChartSeriesConfig` plugin folder (#21026) @JCQuintas
- [charts] Remove `data-has-focused-item` from `ChartsSurface` (#21255) @bernardobelchior
- [charts] Remove default generic of item identifiers (#21182) @alexfauquette
- [charts] Remove deprecated `id` from `LegendItemParams` (#21055) @alexfauquette
- [charts] Remove deprecated `ChartApi` export from `ChartContainer` (#20975) @JCQuintas
- [charts] Remove deprecated `useAxisTooltip` in favor of `useAxesTooltip` (#20962) @Copilot
- [charts] Remove deprecated series type helpers and functions (#20998) @alexfauquette
- [charts] Rename `ChartContainer` to `ChartsContainer` (#21173) @JCQuintas
- [charts] Rename `TickItemType` to `TickItem` (#21008) @bernardobelchior
- [charts] Replace props `id` by `seriesId` when necessary (#21057) @alexfauquette
- [charts] Revert `touch-action: pan-y` removal when zoom is disabled (#20852) @bernardobelchior
- [charts] The `useXxxSeries([])` return empty array (#21001) @alexfauquette
- [charts] Use `NumberValue` in domain limit function (#21054) @JCQuintas

#### `@mui/x-charts-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-alpha.0`, plus:

- [charts-pro] Add border radius to Heatmap (#20931) @bernardobelchior
- [charts-pro] Add keyboard navigation to funnel (#20766) @alexfauquette
- [charts-pro] Add keyboard navigation to heatmap (#20786) @alexfauquette
- [charts-pro] Add keyboard navigation to sankey (#20777) @alexfauquette
- [charts-pro] Fix Heatmap's `onItemClick` not triggering (#21016) @bernardobelchior
- [charts-pro] Fix crash when two same-direction axes have a zoom preview (#20916) @bernardobelchior
- [charts-pro] Handle edge case in export image (#21190) @bernardobelchior
- [charts-pro] Prefer global pointer interaction tracker in Heatmap (#20697) @bernardobelchior
- [charts-pro] Support composition for Sankey (#20604) @alexfauquette
- [charts-pro] Update Heatmap identifier (#21124) @alexfauquette
- [charts-pro] Update default value of `hideLegend` prop in `Heatmap` (#20961) @Copilot

#### `@mui/x-charts-premium@9.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-alpha.0`, plus:

- [charts-premium] Add WebGL renderer to Heatmap (#20756) @bernardobelchior
- [charts-premium] Add `ChartContainerPremium` (#20910) @bernardobelchior
- [charts-premium] Add `HeatmapPremium` (#20930) @bernardobelchior
- [charts-premium] Add keyboard navigation to range-bar (#21272) @alexfauquette
- [charts-premium] Extract `HeatmapSVGPlot` from `HeatmapPlot` component (#21015) @bernardobelchior
- [charts-premium] Fix `ChartDataProviderPremium` tests (#20868) @bernardobelchior
- [charts-premium] Fix links in comments for chart containers and data providers (#21105) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@9.0.0-alpha.0`

_No changes._

#### `@mui/x-tree-view-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-alpha.0`, plus:

- [RichTreeViewPro] Add support for virtualization (#20780) @flaviendelangle

### Codemod

#### `@mui/x-codemod@9.0.0-alpha.0`

- [codemod] Document and Clean the codemod utils (#21014) @alexfauquette

### Docs

- [docs] Add focus highlight in composition snipets (#20614) @alexfauquette
- [docs] Add simple candlestick chart demo (#20912) @bernardobelchior
- [docs] Fix Waterfall Chart documentation badge from Pro to Premium (#20888) @Copilot
- [docs] Fix broken links on Data Grid Editing sub-pages (#20911) @arminmeh
- [docs] Fix docs API for HeatmapPremium (#21137) @alexfauquette
- [docs] Fix horizontal overflow in heatmap docs (#20968) @bernardobelchior
- [docs] Move Range Bar Chart to existing charts (#21120) @bernardobelchior
- [docs] Prepare the scheduler doc for the alpha (#21268) @flaviendelangle
- [docs] Rewording of the heatmap item click (#20987) @alexfauquette
- [scheduler][docs] Create the Quickstart page (#20913) @flaviendelangle
- [charts][docs] Revise the Charts CSP doc (#20906) @mapache-salvaje
- [charts][docs] Revise the Charts Composition doc (#20032) @mapache-salvaje
- [charts][docs] Revise the Charts Hooks Overview doc (#20921) @mapache-salvaje
- [charts][docs] Revise the Charts Legend doc (#20821) @mapache-salvaje
- [charts][docs] Revise the Charts Localization doc (#20800) @mapache-salvaje
- [charts][docs] Revise the Charts Plugins doc (#20933) @mapache-salvaje
- [charts][docs] Revise the Charts Stacking doc (#20830) @mapache-salvaje
- [charts][docs] Revise the Charts Styling doc (#20835) @mapache-salvaje
- [charts][docs] Revise the Charts Toolbar doc (#20867) @mapache-salvaje
- [charts][docs] Revise the Charts Tooltip doc (#20869) @mapache-salvaje
- [charts][docs] Revise the Charts Zoom and Pan doc (#20893) @mapache-salvaje
- [DataGrid][docs] Add a recipe for handling long text cell (#20754) @siriwatknp

### Core

- [code-infra] Add `MUI_TEST_ENV` global (#21187) @Janpot
- [code-infra] Fix `material-ui/disallow-react-api-in-server-components` (#20909) @JCQuintas
- [code-infra] Fix `renameImports` codemod not preserving comments (#20977) @JCQuintas
- [code-infra] Fix the label comparison to use lower case (#20934) @brijeshb42
- [code-infra] Github action to sync title and label (#20922) @brijeshb42
- [code-infra] Ignore scheduler demo with random data (#20982) @JCQuintas
- [code-infra] Improve `codemod` testing setup (#20981) @JCQuintas
- [code-infra] Only ignore renovate[bot] in changelog generation script (#21185) @bernardobelchior
- [code-infra] Prepare for v9 (#20860) @JCQuintas
- [code-infra] Set `rasterizehtml` version in pnpm catalog (#21175) @bernardobelchior
- [code-infra] Update codeowners (#20886) @JCQuintas
- [code-infra] V9 preparation (#20928) @JCQuintas
- [code-infra] eslint rule rename (#21172) @Janpot
- [code-infra][docs] V9 charts migration doc kickoff (#20973) @JCQuintas
- [docs-infra] Add Cookie Banner and Analytics Provider (#21228) @dav-is
- [docs-infra] Fix missing slots section on API page (#20915) @Janpot
- [docs-infra] Fix two broken links (#20914) @Janpot
- [docs-infra] Port demo changes (#20971) @Janpot
- [internal] Add information about codemods to AGENTS.md (#21011) @bernardobelchior
- [internal] Fix codemod versioning instructions in `AGENTS.md` (#21024) @bernardobelchior
- [internal] Fix missing generated props in master (#21142) @bernardobelchior
- [internal] Headless sorting plugin (#21089) @arminmeh
- [internal] Remove duplicate code (#20896) @oliviertassinari

### Miscellaneous

- Bump next to ^15.5.11 (#21171) @Copilot
- [core] Fix CI (#21223) @flaviendelangle
- [PoC] Headless data grid (#20645) @cherniavskii

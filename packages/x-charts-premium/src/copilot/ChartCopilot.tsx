'use client';
import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { styled } from '@mui/material/styles';
import type { ChatAdapter, ChatOnFinish, ChatSuggestion } from '@mui/x-chat-headless';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ChartsRenderer, type ChartsRendererProps } from '../ChartsRenderer';
import { EMPTY_CHART_COPILOT_STATE, type ChartCopilotState } from './chartState';
import type { AnnotationSpec } from './annotations/types';
import { EMPTY_FOCUS, resolveZoomData, type ChartFocusState } from './chartFocusState';
import { resolveForRenderer, type ChartCopilotDataset } from './resolveForRenderer';
import { resolveAnnotations, resolveOverlaySeries } from './resolveAnnotations';
import { useChartsCopilot, type UseChartsCopilotReturn } from './useChartsCopilot';
import { getChartsCopilotLocalStorageAdapterController } from './createChartsCopilotLocalStorageAdapter';
import { type DEFAULT_CHART_GUARDS } from './guards';
import { useChartCopilotHistory } from './history';
import {
  AnalyzeMenu,
  AnswerBanner,
  ChartDataTable,
  ChartsCopilotPanel,
  ChartsCopilotPanelTrigger,
  ChartsCopilotProvider,
  FocusBreadcrumb,
  ProactiveAnomalyChip,
  StepHistory,
} from './panel';

const FOCUS_X_AXIS_ID = 'copilot-focus-x';

export interface ChartCopilotProps {
  /** The dataset the chart is resolved against. */
  dataset: ChartCopilotDataset;
  /** The chart state (controlled). Pair with `onStateChange`. */
  state?: ChartCopilotState;
  /** The initial chart state (uncontrolled). */
  defaultState?: ChartCopilotState;
  // Called whenever the chart state changes.
  onStateChange?: (state: ChartCopilotState) => void;
  /** Height of the rendered chart, forwarded into the renderer configuration. */
  height?: number;
  // Chat adapter (wrapping a backend chat adapter). When provided, mounts the Copilot chat UI.
  chatAdapter?: ChatAdapter;
  /** Prompt suggestions shown in the panel's empty state. */
  suggestions?: Array<ChatSuggestion | string>;
  /** Optional override for the default Copilot guards. */
  features?: Partial<typeof DEFAULT_CHART_GUARDS>;
}

interface UseChartCopilotControllerParams {
  state?: ChartCopilotState;
  defaultState?: ChartCopilotState;
  onStateChange?: (state: ChartCopilotState) => void;
}

interface ChartCopilotController {
  state: ChartCopilotState;
  setState: (next: ChartCopilotState) => void;
}

/**
 * Owns the Charts Copilot state document following the standard MUI
 * controlled/uncontrolled pattern. When `state` + `onStateChange` are provided
 * the component is controlled; otherwise it manages the state internally,
 * seeded from `defaultState`.
 */
export function useChartCopilotController(
  params: UseChartCopilotControllerParams,
): ChartCopilotController {
  const { state: stateProp, defaultState, onStateChange } = params;

  const [state, setStateInternal] = useControlled<ChartCopilotState>({
    controlled: stateProp,
    default: defaultState ?? EMPTY_CHART_COPILOT_STATE,
    name: 'ChartCopilot',
    state: 'state',
  });

  const isControlled = stateProp !== undefined && onStateChange !== undefined;

  const onStateChangeRef = React.useRef(onStateChange);
  React.useEffect(() => {
    onStateChangeRef.current = onStateChange;
  });

  const isControlledRef = React.useRef(isControlled);
  React.useEffect(() => {
    isControlledRef.current = isControlled;
  }, [isControlled]);

  const setState = React.useCallback(
    (next: ChartCopilotState) => {
      // In controlled mode the parent owns the state document: notify via
      // `onStateChange` and let it flow back through `state`. Writing the
      // internal state here would desync the controlled value and warn.
      if (!isControlledRef.current) {
        setStateInternal(next);
      }
      onStateChangeRef.current?.(next);
    },
    [setStateInternal],
  );

  return { state, setState };
}

// Contained side-by-side layout: the chart fills the main area and the Copilot
// chat lives in a collapsible column *inside* the component (not a page-level
// modal drawer), so the panel sits on the side of the chart.
const ChartCopilotRoot = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  width: '100%',
  minHeight: 0,
});

const ChartCopilotMain = styled('div')({
  flex: 1,
  minWidth: 0,
});

// Positioning context only — intentionally has no `flex-direction`/height of its
// own. `alignItems: 'stretch'` on the row stretches it to the chart column's
// height, while its single absolutely-positioned child (`ChartCopilotPanelFill`)
// contributes zero intrinsic height. That keeps the row height driven solely by
// the chart, so toggling the panel open/closed no longer resizes the chart and
// long conversations scroll inside the panel instead of growing the component.
const ChartCopilotSide = styled('div')(({ theme }) => ({
  position: 'relative',
  flexShrink: 0,
  width: 360,
  minWidth: 300,
  maxWidth: '90%',
  marginLeft: theme.spacing(1),
  borderLeft: `1px solid ${(theme.vars ?? theme).palette.divider}`,
}));

// Fills the stretched side column without adding to its content height, giving
// the panel (`PanelRoot`: flex:1; minHeight:0; overflow:hidden) a bounded height
// so its auto-scrolling message list takes over.
const ChartCopilotPanelFill = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
});

interface ChartCopilotChartProps {
  state: ChartCopilotState;
  dataset: ChartCopilotDataset;
  height?: number;
  // When provided, renders this node (e.g. the Copilot trigger) in the toolbar.
  toolbarExtra?: React.ReactNode;
  // When provided, shows the proactive anomaly suggestion chip (Copilot-only).
  onMarkAnomaly?: (spec: AnnotationSpec) => void;
  // Ephemeral Focus view state (zoom + highlight).
  focus?: ChartFocusState;
}

function ChartCopilotChart(props: ChartCopilotChartProps) {
  const { state, dataset, height, toolbarExtra, onMarkAnomaly, focus = EMPTY_FOCUS } = props;
  const { rendererProps, analyzeSeries, annotations, categories, dimensionLabel } =
    React.useMemo(() => {
      const resolved = resolveForRenderer(state, dataset);
      const configuration =
        height !== undefined ? { ...resolved.configuration, height } : resolved.configuration;

      // Overlays (SMA/trend/…) are line series, so only line/area charts host them.
      // They are computed here from the *transformed* values, never cached, so they
      // stay correct after a data-shaping change.
      const supportsOverlays = state.type === 'line' || state.type === 'area';
      const overlaySeries = supportsOverlays
        ? resolveOverlaySeries(state.overlays, resolved.values)
        : [];
      const values =
        overlaySeries.length > 0 ? [...resolved.values, ...overlaySeries] : resolved.values;

      return {
        rendererProps: { ...resolved, values, configuration } satisfies ChartsRendererProps,
        // Map the resolved (real, non-overlay) value items into the analyze shape.
        analyzeSeries: resolved.values.map((value) => ({
          id: value.id,
          label: value.label,
          data: value.data,
        })),
        annotations: resolveAnnotations(state.annotations, resolved.dimensions, resolved.values),
        categories: resolved.dimensions[0]?.data ?? [],
        dimensionLabel: resolved.dimensions[0]?.label ?? '',
      };
    }, [state, dataset, height]);

  // Inject reference lines (annotations) as children, and apply the ephemeral
  // Focus view state (zoom + highlight) as controlled props, via the renderer's
  // onRender seam — the convenience charts render children into the SVG and
  // accept the Pro zoom/highlight props.
  const focusActive = Boolean(focus.zoom || focus.highlight);
  const handleRender = React.useCallback<NonNullable<ChartsRendererProps['onRender']>>(
    (type, chartProps, Component) => {
      let nextProps: Record<string, any> = chartProps;

      // Highlight one series, fade the rest (not meaningful on a pie).
      if (focus.highlight && type !== 'pie') {
        nextProps = {
          ...nextProps,
          highlightedItem: { seriesId: focus.highlight.seriesId },
          series: (nextProps.series ?? []).map((s: Record<string, any>) => ({
            ...s,
            highlightScope: { highlight: 'series', fade: 'global' },
          })),
        };
      }

      // Controlled zoom window (line/area only).
      if (focus.zoom && (type === 'line' || type === 'area')) {
        const zoomData = resolveZoomData(focus.zoom, categories, FOCUS_X_AXIS_ID);
        if (zoomData) {
          nextProps = {
            ...nextProps,
            xAxis: (nextProps.xAxis ?? []).map((axis: Record<string, any>, index: number) =>
              index === 0 ? { ...axis, id: FOCUS_X_AXIS_ID, zoom: true } : axis,
            ),
            zoomData,
          };
        }
      }

      return (
        <Component {...nextProps}>
          {annotations.map((annotation) => (
            <ChartsReferenceLine
              key={annotation.id}
              {...(annotation.axis === 'y' ? { y: annotation.value } : { x: annotation.value })}
              label={annotation.label}
              labelAlign="start"
              lineStyle={{ strokeDasharray: '5 3' }}
            />
          ))}
        </Component>
      );
    },
    [annotations, focus, categories],
  );

  return (
    <React.Fragment>
      <AnalyzeMenu series={analyzeSeries} toolbarExtra={toolbarExtra} />
      <AnswerBanner series={analyzeSeries} />
      {onMarkAnomaly ? (
        <ProactiveAnomalyChip
          series={analyzeSeries}
          categories={categories}
          annotations={state.annotations}
          onMark={onMarkAnomaly}
        />
      ) : null}
      <ChartsRenderer
        {...rendererProps}
        onRender={annotations.length > 0 || focusActive ? handleRender : undefined}
      />
      <ChartDataTable
        dimensionLabel={dimensionLabel}
        categories={categories}
        series={analyzeSeries}
        caption={state.label}
      />
    </React.Fragment>
  );
}

interface ChartCopilotMountProps {
  inner: ChatAdapter;
  state: ChartCopilotState;
  setState: (next: ChartCopilotState) => void;
  dataset: ChartCopilotDataset;
  features?: Partial<typeof DEFAULT_CHART_GUARDS>;
  suggestions?: Array<ChatSuggestion | string>;
  height?: number;
}

/**
 * Mounts the Copilot stack: invokes `useChartsCopilot`, owns the open/close
 * state, provides the controls context to descendants (so the toolbar trigger
 * can toggle the drawer), and renders the chat panel inside a right-anchored
 * drawer. Only rendered when `chatAdapter` is supplied.
 */
function ChartCopilotMount(props: ChartCopilotMountProps) {
  const { inner, state, setState, dataset, features, suggestions, height } = props;
  const [open, setOpen] = React.useState(false);

  // Ephemeral Focus view state (zoom + highlight). NOT in the spec doc and NOT
  // historized — transient view navigation with its own breadcrumb + reset.
  const [focus, setFocus] = React.useState<ChartFocusState>(EMPTY_FOCUS);

  // Stable getters/setter so the host adapter keeps its identity across renders
  // while still reading the latest state/dataset/focus.
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const setStateRef = React.useRef(setState);
  setStateRef.current = setState;
  const datasetRef = React.useRef(dataset);
  datasetRef.current = dataset;
  const focusRef = React.useRef(focus);
  focusRef.current = focus;

  const getChartState = React.useCallback(() => stateRef.current, []);
  const getDataset = React.useCallback(() => datasetRef.current, []);
  const getFocus = React.useCallback(() => focusRef.current, []);

  // Undoable step history. `applyState` restores a prior spec on undo/reset via
  // the *raw* controller setter, so it bypasses the per-turn capture below.
  const applyState = React.useCallback((next: ChartCopilotState) => setStateRef.current(next), []);
  const history = useChartCopilotHistory(applyState, dataset.columns);

  // Proactive suggestion accepted: merge the annotation into the spec and record
  // an undoable step. Uses the raw setter (not the executor seam), so it is a
  // self-contained edit rather than part of a chat turn.
  const handleMarkAnomaly = React.useCallback(
    (spec: AnnotationSpec) => {
      const before = stateRef.current;
      const after: ChartCopilotState = {
        ...before,
        annotations: { ...(before.annotations ?? {}), [spec.id]: spec },
      };
      setStateRef.current(after);
      history.record({ before, after, hadPatches: true, columns: datasetRef.current.columns });
    },
    [history],
  );

  // Per-turn capture: `before` is the spec at the turn's first executor patch,
  // `after` is the spec at finish (recorded in `handleFinish`). The executor
  // commits through this wrapped setter; undo/reset use `applyState` instead, so
  // they never open a spurious turn.
  const turnBeforeRef = React.useRef<ChartCopilotState | null>(null);
  const turnHadPatchesRef = React.useRef(false);
  const setChartState = React.useCallback((next: ChartCopilotState) => {
    if (turnBeforeRef.current === null) {
      turnBeforeRef.current = stateRef.current;
    }
    turnHadPatchesRef.current = true;
    setStateRef.current(next);
  }, []);

  const copilot: UseChartsCopilotReturn = useChartsCopilot({
    inner,
    getChartState,
    setChartState,
    getDataset,
    getFocus,
    setFocus,
    features,
  });

  // History persistence: the local-storage adapter saves the user turn on send,
  // but the assistant reply only exists once streaming ends — persist the full
  // message list on finish so restored conversations include both sides.
  const localStorageController = React.useMemo(
    () => getChartsCopilotLocalStorageAdapterController(inner),
    [inner],
  );

  // Resume the last conversation on mount when the adapter persists history, so
  // reopening/reloading the panel restores it instead of starting on the empty
  // state (mirrors the Data Grid Copilot). Computed once — the stored id is only
  // the mount-time seed; the panel owns the active conversation thereafter.
  const [initialActiveConversationId] = React.useState(() =>
    localStorageController?.getInitialActiveConversationId(),
  );

  const handleFinish = React.useCallback<ChatOnFinish>(
    ({ message, messages }) => {
      // Record the undoable step for this turn: `before` is the spec captured at
      // the first executor patch, `after` is the latest committed spec. Keyed by
      // the assistant message id so the receipt renders under it.
      history.record({
        before: turnBeforeRef.current ?? stateRef.current,
        after: stateRef.current,
        hadPatches: turnHadPatchesRef.current,
        messageId: message.id,
      });
      turnBeforeRef.current = null;
      turnHadPatchesRef.current = false;

      // On the first turn of a fresh conversation the store's message carries no
      // conversationId yet — fall back to the id the adapter assigned and
      // persisted as the active conversation on send (read fresh from storage via
      // the controller), so the assistant reply is saved on every turn.
      const conversationId =
        message.conversationId ?? localStorageController?.getInitialActiveConversationId();
      if (!localStorageController || !conversationId) {
        return;
      }
      localStorageController.persistConversationMessages(conversationId, messages);
    },
    [localStorageController, history],
  );

  // The "+" / new-conversation button. Charts uses the high-level
  // `CopilotChatPanel` wrapper (uncontrolled conversation) and never syncs the
  // adapter-assigned conversation id back into the chat store, so the panel's
  // default reset path (`setActiveConversation(undefined)`) no-ops once the
  // store's active id is already `undefined` — the thread never clears. Own it
  // instead: revert the chart to baseline and clear receipts (mirrors the Data
  // Grid restoring baseline state on a new conversation), forget the persisted
  // active conversation so it isn't resumed, and remount the chat via
  // `chatResetKey` for a guaranteed-empty thread. The previous conversation
  // stays in localStorage and remains reachable from the history view.
  const [chatResetKey, setChatResetKey] = React.useState(0);
  const handleNewConversation = React.useCallback(() => {
    history.reset();
    setFocus(EMPTY_FOCUS);
    localStorageController?.persistActiveConversationId(undefined);
    setChatResetKey((key) => key + 1);
  }, [history, localStorageController]);

  return (
    <ChartsCopilotProvider
      open={open}
      setOpen={setOpen}
      available
      copilot={copilot}
      history={history}
    >
      <ChartCopilotRoot>
        <ChartCopilotMain>
          <FocusBreadcrumb
            focus={focus}
            seriesLabel={(seriesId) =>
              dataset.columns.find((column) => column.field === seriesId)?.headerName ?? seriesId
            }
            onReset={() => setFocus(EMPTY_FOCUS)}
          />
          <ChartCopilotChart
            state={state}
            dataset={dataset}
            height={height}
            toolbarExtra={<ChartsCopilotPanelTrigger />}
            onMarkAnomaly={handleMarkAnomaly}
            focus={focus}
          />
        </ChartCopilotMain>
        {/* Kept mounted (hidden when closed) so the conversation survives toggling. */}
        <ChartCopilotSide sx={{ display: open ? 'block' : 'none' }}>
          <ChartCopilotPanelFill>
            <StepHistory />
            <ChartsCopilotPanel
              key={chatResetKey}
              adapter={copilot.adapter}
              initialActiveConversationId={
                chatResetKey === 0 ? initialActiveConversationId : undefined
              }
              onFinish={handleFinish}
              onNewConversation={handleNewConversation}
              suggestions={suggestions}
              open={open}
              onOpenChange={setOpen}
            />
          </ChartCopilotPanelFill>
        </ChartCopilotSide>
      </ChartCopilotRoot>
    </ChartsCopilotProvider>
  );
}

/**
 * Charts Copilot host.
 *
 * Renders the existing premium `ChartsRenderer` from a serializable
 * `ChartCopilotState` document resolved against `dataset`. The state can be
 * driven externally (controlled) or managed internally (uncontrolled). When a
 * `chatAdapter` is supplied, also mounts the Copilot chat UI (toolbar trigger +
 * right-anchored drawer) wired through `useChartsCopilot`; otherwise the chart
 * is rendered on its own.
 */
function ChartCopilot(props: ChartCopilotProps) {
  const {
    dataset,
    state: stateProp,
    defaultState,
    onStateChange,
    height,
    chatAdapter,
    suggestions,
    features,
  } = props;

  const { state, setState } = useChartCopilotController({
    state: stateProp,
    defaultState,
    onStateChange,
  });

  if (!chatAdapter) {
    return (
      <ChartsCopilotProvider open={false} setOpen={() => {}} available={false}>
        <ChartCopilotChart state={state} dataset={dataset} height={height} />
      </ChartsCopilotProvider>
    );
  }

  return (
    <ChartCopilotMount
      inner={chatAdapter}
      state={state}
      setState={setState}
      dataset={dataset}
      features={features}
      suggestions={suggestions}
      height={height}
    />
  );
}

export { ChartCopilot };

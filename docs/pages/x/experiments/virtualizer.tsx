import * as React from 'react';
import Head from 'next/head';
import type { Virtualizer, VirtualizerParams } from '@mui/x-virtualizer';
import {
  ScrollContainerGrid,
  type DemoLayout,
  // This standalone experiment uses the package's demo, which has no public export.
  // eslint-disable-next-line import/no-relative-packages
} from '../../../../packages/x-virtualizer/docs/ScrollContainerGrid';

export default function VirtualizerExperiment() {
  const [mode, setMode] = React.useState<'self' | 'content' | 'window'>('content');
  const [layout, setLayout] = React.useState<DemoLayout>('sticky-grid');
  const [axes, setAxes] = React.useState<'vertical' | 'both'>('vertical');
  const [pinned, setPinned] = React.useState(true);
  const [rtl, setRtl] = React.useState(false);
  const [variableHeight, setVariableHeight] = React.useState(false);
  const [autoRowHeight, setAutoRowHeight] = React.useState(false);
  const [twoGrids, setTwoGrids] = React.useState(false);
  const [expandedBefore, setExpandedBefore] = React.useState(false);
  const [expandedAfter, setExpandedAfter] = React.useState(false);
  const [insets, setInsets] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const owner = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (mode !== 'window') {
      return undefined;
    }
    const root = owner.current!.ownerDocument.documentElement;
    const previousDirection = root.dir;
    root.dir = rtl ? 'rtl' : 'ltr';
    return () => {
      root.dir = previousDirection;
    };
  }, [mode, rtl]);
  const scrollContainer = mode === 'content' ? () => owner.current : mode;
  const toggle = (label: string, value: boolean, set: (next: boolean) => void) => (
    <label>
      <input type="checkbox" checked={value} onChange={(event) => set(event.target.checked)} />{' '}
      {label}
    </label>
  );
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui', color: '#111', background: '#fff' }}>
      <Head>
        <title>Virtualizer scroll containers</title>
      </Head>
      <h1>Virtualizer scroll containers</h1>
      <p>Experimental engine demos. Choose which container scrolls the rows and columns.</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <label>
          Scroll owner{' '}
          <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="self">Grid</option>
            <option value="content">Content area</option>
            <option value="window">Window</option>
          </select>
        </label>
        <label>
          Layout{' '}
          <select value={layout} onChange={(event) => setLayout(event.target.value as DemoLayout)}>
            <option value="list">List</option>
            <option value="sticky-list">Sticky list</option>
            <option value="sticky-grid">Sticky grid</option>
            <option value="grid">Grid</option>
            <option value="controlled-grid">Controlled grid</option>
          </select>
        </label>
        <label>
          External axes{' '}
          <select value={axes} onChange={(event) => setAxes(event.target.value as typeof axes)}>
            <option value="vertical">Vertical; grid scrolls horizontally</option>
            <option value="both">Both</option>
          </select>
        </label>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <label key={side}>
            {side[0].toUpperCase() + side.slice(1)} inset{' '}
            <input
              type="number"
              min={0}
              max={160}
              value={insets[side]}
              onChange={(event) => setInsets({ ...insets, [side]: Number(event.target.value) })}
              style={{ width: 64 }}
            />{' '}
            px
          </label>
        ))}
        {toggle('Pinned rows and columns', pinned, setPinned)}
        {toggle('RTL', rtl, setRtl)}
        {toggle('Variable row heights', variableHeight, setVariableHeight)}
        {toggle('Measure row heights', autoRowHeight, setAutoRowHeight)}
        {toggle('Two grids', twoGrids, setTwoGrids)}
      </div>
      <div style={{ border: '1px solid #aaa' }}>
        <header style={{ padding: 16, background: '#eee' }}>
          App header — outside the content scroll area
        </header>
        <div style={{ display: 'flex', minWidth: 0 }}>
          <aside style={{ padding: 16, width: 120, flexShrink: 0, background: '#f5f5f5' }}>
            Sidebar
          </aside>
          <div
            ref={owner}
            dir={rtl ? 'rtl' : 'ltr'}
            style={{
              position: 'relative',
              flex: 1,
              minWidth: 0,
              height: mode === 'content' ? 600 : undefined,
              overflow: mode === 'content' ? 'auto' : 'visible',
              overflowAnchor: 'none',
            }}
          >
            <div
              style={{ padding: 16, height: expandedBefore ? 480 : 160, boxSizing: 'border-box' }}
            >
              <p>Content preceding the grid</p>
              <button type="button" onClick={() => setExpandedBefore(!expandedBefore)}>
                Toggle content height
              </button>
            </div>
            {Array.from({ length: twoGrids ? 2 : 1 }, (_, index) => (
              <GridPanel
                key={`${mode}-${layout}-${axes}-${rtl}-${index}`}
                layout={layout}
                scrollContainer={scrollContainer}
                axes={axes}
                pinned={pinned}
                rtl={rtl}
                variableHeight={variableHeight}
                autoRowHeight={autoRowHeight}
                insets={insets}
                index={index}
              />
            ))}
            <div
              style={{ padding: 16, height: expandedAfter ? 600 : 200, boxSizing: 'border-box' }}
            >
              <p>Content following the grid</p>
              <button type="button" onClick={() => setExpandedAfter(!expandedAfter)}>
                Toggle content height
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function GridPanel(props: {
  layout: DemoLayout;
  scrollContainer: VirtualizerParams['scrollContainer'];
  axes: 'vertical' | 'both';
  pinned: boolean;
  rtl: boolean;
  variableHeight: boolean;
  autoRowHeight: boolean;
  insets: VirtualizerParams['scrollViewportInsets'];
  index: number;
}) {
  const apiRef = React.useRef<Virtualizer>(null);
  const [counts, setCounts] = React.useState({ rows: 0, columns: 0 });
  const [position, setPosition] = React.useState({ top: 20000, left: 0 });
  const onRenderContextChange = React.useCallback<
    NonNullable<VirtualizerParams['onRenderContextChange']>
  >(
    (context) => {
      const rows = context.lastRowIndex - context.firstRowIndex;
      const columns = context.lastColumnIndex - context.firstColumnIndex + (props.pinned ? 2 : 0);
      setCounts((previous) =>
        previous.rows === rows && previous.columns === columns ? previous : { rows, columns },
      );
    },
    [props.pinned],
  );
  return (
    <section style={{ marginBottom: 40 }}>
      <div
        style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
      >
        <strong>Grid {props.index + 1}</strong>
        <span>
          {counts.rows} data rows / {counts.columns} columns rendered
        </span>
        <button type="button" onClick={() => apiRef.current?.api.scrollToPosition({ top: 0 })}>
          Start
        </button>
        {(['top', 'left'] as const).map((axis) => (
          <label key={axis}>
            {axis === 'top' ? 'Top' : 'Left'}{' '}
            <input
              type="number"
              value={position[axis]}
              onChange={(event) => setPosition({ ...position, [axis]: Number(event.target.value) })}
              style={{ width: 80 }}
            />
          </label>
        ))}
        <button type="button" onClick={() => apiRef.current?.api.scrollToPosition(position)}>
          Scroll to position
        </button>
        <button type="button" onClick={() => apiRef.current?.api.refreshScrollContainer()}>
          Refresh measurements
        </button>
      </div>
      <ScrollContainerGrid
        {...props}
        apiRef={apiRef}
        onRenderContextChange={onRenderContextChange}
      />
    </section>
  );
}

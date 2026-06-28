import { describe, expect, it, vi } from 'vitest';
import { makeExecutor } from './createExecutor';
import { buildCommandRegistry } from './commandRegistry';
import { buildPatchRegistry } from './patchRegistry';
import type { HostAdapter } from './hostAdapter';
import type { CommandPack, PatchPack } from './handlers';

interface DemoState {
  sort: ReadonlyArray<{ field: string; sort: 'asc' | 'desc' }>;
  pivot: { active: boolean; model: { rows: string[]; cols: string[] } };
  carry: { lastReorder: string | null };
}

interface DemoApi {
  setSortModel: (model: DemoState['sort']) => void;
  setPivotActive: (active: boolean) => void;
  setPivotModel: (model: { rows: string[]; cols: string[] }) => void;
  customCommand: (label: string) => string;
}

function makeDemoHost(initial: DemoState = {
  sort: [],
  pivot: { active: false, model: { rows: [], cols: [] } },
  carry: { lastReorder: null },
}) {
  let state: DemoState = initial;
  let carry: { displaced: Map<string, number> } = { displaced: new Map() };

  const api: DemoApi = {
    setSortModel: vi.fn((model) => {
      state = { ...state, sort: model };
    }),
    setPivotActive: vi.fn((active) => {
      state = { ...state, pivot: { ...state.pivot, active } };
    }),
    setPivotModel: vi.fn((model) => {
      state = { ...state, pivot: { ...state.pivot, model } };
    }),
    customCommand: vi.fn((label) => `ran:${label}`),
  };

  const adapter: HostAdapter<DemoState, DemoApi> = {
    id: 'demo-host',
    api,
    snapshotState: () => state,
    onPatchToolStop: vi.fn((ctx) => {
      // Auto-activate pivot when /pivot/model patched but /pivot/active wasn't.
      if (
        ctx.appliedSlices.has('/pivot/model') &&
        !ctx.appliedSlices.has('/pivot/active') &&
        !ctx.doc.pivot.active &&
        (ctx.doc.pivot.model.rows.length > 0 || ctx.doc.pivot.model.cols.length > 0)
      ) {
        api.setPivotActive(true);
      }
    }),
    onAllToolsStop: vi.fn(),
    getCarryState: () => carry,
    setCarryState: (next) => {
      carry = next as typeof carry;
    },
  };
  return { adapter, api, getState: () => state, getCarry: () => carry };
}

const sortPack: PatchPack<HostAdapter<DemoState, DemoApi>, DemoState> = {
  id: 'demo-sort',
  handlers: [
    {
      path: '/sort',
      allowedOps: ['replace'],
      guard: 'sort',
      phase: 'view',
      tier: 2,
      plan: 'community',
      reconcile(_doc, op, ctx) {
        ctx.adapter.api.setSortModel(op.value as DemoState['sort']);
      },
    },
  ],
};

const pivotPack: PatchPack<HostAdapter<DemoState, DemoApi>, DemoState> = {
  id: 'demo-pivot',
  handlers: [
    {
      path: '/pivot/model',
      allowedOps: ['replace'],
      guard: 'pivoting',
      phase: 'pivot',
      tier: 2,
      plan: 'premium',
      reconcile(_doc, op, ctx) {
        ctx.adapter.api.setPivotModel(op.value as { rows: string[]; cols: string[] });
      },
    },
    {
      path: '/pivot/active',
      allowedOps: ['replace'],
      guard: 'pivoting',
      phase: 'pivot',
      tier: 2,
      plan: 'premium',
      reconcile(_doc, op, ctx) {
        ctx.adapter.api.setPivotActive(op.value as boolean);
      },
    },
  ],
};

const commandPack: CommandPack<HostAdapter<DemoState, DemoApi>, DemoState> = {
  id: 'demo-commands',
  handlers: [
    {
      type: 'custom.run',
      namespace: 'view',
      tier: 2,
      plan: 'community',
      guard: null,
      phase: 'view',
      run(params: { label: string }, ctx) {
        return ctx.adapter.api.customCommand(params.label);
      },
    },
  ],
};

describe('x-copilot generic executor', () => {
  it('reconciles a patch through the registry', () => {
    const host = makeDemoHost();
    const exec = makeExecutor({
      adapter: host.adapter,
      guards: { sort: true, pivoting: true, mutations: true },
      commandRegistry: buildCommandRegistry(
        { sort: true, pivoting: true, mutations: true },
        [commandPack],
      ),
      patchRegistry: buildPatchRegistry(
        { sort: true, pivoting: true, mutations: true },
        [sortPack, pivotPack],
      ),
    });
    const result = exec.applyEnvelope({
      setGridState: JSON.stringify({
        op: 'replace',
        path: '/sort',
        value: [{ field: 'name', sort: 'asc' }],
      }),
    });
    expect(result.applied).to.have.lengthOf(1);
    expect(result.applied[0]).to.deep.include({ kind: 'patch', path: '/sort' });
    expect(host.api.setSortModel).toHaveBeenCalledWith([{ field: 'name', sort: 'asc' }]);
  });

  it('runs a command via runCommands', () => {
    const host = makeDemoHost();
    const exec = makeExecutor({
      adapter: host.adapter,
      guards: { mutations: true },
      commandRegistry: buildCommandRegistry({ mutations: true }, [commandPack]),
      patchRegistry: buildPatchRegistry({ mutations: true }, []),
    });
    const result = exec.applyEnvelope({
      runCommands: JSON.stringify({ type: 'custom.run', params: { label: 'hello' } }),
    });
    expect(result.applied).to.have.lengthOf(1);
    expect(result.applied[0]).to.deep.include({ kind: 'command', type: 'custom.run' });
    expect(host.api.customCommand).toHaveBeenCalledWith('hello');
  });

  it('fires onPatchToolStop after the patch tool finishes', () => {
    const host = makeDemoHost();
    const exec = makeExecutor({
      adapter: host.adapter,
      guards: { pivoting: true, mutations: true },
      commandRegistry: buildCommandRegistry({ pivoting: true, mutations: true }, []),
      patchRegistry: buildPatchRegistry({ pivoting: true, mutations: true }, [pivotPack]),
    });
    exec.applyEnvelope({
      setGridState: JSON.stringify({
        op: 'replace',
        path: '/pivot/model',
        value: { rows: ['country'], cols: ['year'] },
      }),
    });
    expect(host.adapter.onPatchToolStop).toHaveBeenCalledTimes(1);
    // Auto-activated by the host's onPatchToolStop body.
    expect(host.api.setPivotActive).toHaveBeenCalledWith(true);
  });

  it('skips a patch when its guard is off', () => {
    const host = makeDemoHost();
    const exec = makeExecutor({
      adapter: host.adapter,
      guards: { sort: false, mutations: true },
      commandRegistry: buildCommandRegistry({ sort: false, mutations: true }, []),
      patchRegistry: buildPatchRegistry({ sort: false, mutations: true }, [sortPack]),
    });
    const result = exec.applyEnvelope({
      setGridState: JSON.stringify({
        op: 'replace',
        path: '/sort',
        value: [{ field: 'name', sort: 'asc' }],
      }),
    });
    expect(result.applied).to.have.lengthOf(0);
    // The patch path resolves to no handler because the guard filtered it out.
    expect(result.skipped[0]?.reason).to.equal('unknown');
    expect(host.api.setSortModel).not.toHaveBeenCalled();
  });

  it('honors pack pathPrefix for hybrid hosts', () => {
    // A hybrid host's state is namespaced — e.g. { grid: GridDoc, studio: StudioDoc }.
    // The Grid's reconciler pack ships handlers at `/sort` etc.; the composite
    // host registers it with pathPrefix: '/grid' so its paths become `/grid/sort`.
    interface HybridState {
      grid: DemoState;
      studio: { activeView: string | null };
    }
    const hybridState: HybridState = {
      grid: {
        sort: [],
        pivot: { active: false, model: { rows: [], cols: [] } },
        carry: { lastReorder: null },
      },
      studio: { activeView: null },
    };
    const setSortModel = vi.fn();
    const hybridAdapter: HostAdapter<HybridState, { setSortModel: typeof setSortModel }> = {
      id: 'hybrid',
      api: { setSortModel },
      snapshotState: () => hybridState,
    };
    const prefixed: PatchPack<typeof hybridAdapter, HybridState> = {
      id: 'demo-sort-rebased',
      handlers: [
        {
          path: '/sort',
          allowedOps: ['replace'],
          guard: 'sort',
          phase: 'view',
          tier: 2,
          plan: 'community',
          reconcile(_doc, op, ctx) {
            ctx.adapter.api.setSortModel(op.value);
          },
        },
      ],
      pathPrefix: '/grid',
    };
    const exec = makeExecutor<typeof hybridAdapter, HybridState>({
      adapter: hybridAdapter,
      guards: { sort: true, mutations: true },
      commandRegistry: buildCommandRegistry({ sort: true, mutations: true }, []),
      patchRegistry: buildPatchRegistry({ sort: true, mutations: true }, [prefixed]),
    });
    const result = exec.applyEnvelope({
      setGridState: JSON.stringify({
        op: 'replace',
        path: '/grid/sort',
        value: [{ field: 'name', sort: 'asc' }],
      }),
    });
    expect(result.applied).to.have.lengthOf(1);
    expect(setSortModel).toHaveBeenCalledWith([{ field: 'name', sort: 'asc' }]);
  });

  it('carries state across executor instances via the adapter', () => {
    const host = makeDemoHost();
    host.adapter.setCarryState?.({ displaced: new Map([['salary', 7]]) });

    const exec1 = makeExecutor({
      adapter: host.adapter,
      guards: { mutations: true },
      commandRegistry: buildCommandRegistry({ mutations: true }, []),
      patchRegistry: buildPatchRegistry({ mutations: true }, []),
    });
    exec1.applyEnvelope({});

    expect(host.getCarry().displaced.get('salary')).to.equal(7);
  });
});

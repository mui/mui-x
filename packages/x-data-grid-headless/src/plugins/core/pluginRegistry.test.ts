import { describe, expect, it } from 'vitest';
import type { AnyPlugin } from './plugin';
import { PluginRegistry } from './pluginRegistry';

function createTestPlugin(
  name: string,
  options: {
    dependencies?: readonly AnyPlugin[];
    order?: number;
  } = {},
): AnyPlugin {
  return {
    name,
    order: options.order,
    dependencies: options.dependencies,
    selectors: {},
    initialize: (state) => state,
    use: () => ({}),
  } as AnyPlugin;
}

describe('PluginRegistry', () => {
  it('resolves user plugins by ascending order', () => {
    const pluginA = createTestPlugin('a', { order: 30 });
    const pluginB = createTestPlugin('b', { order: 10 });
    const pluginC = createTestPlugin('c', { order: 20 });

    const registry = new PluginRegistry([], [pluginA, pluginB, pluginC]);
    const visited: string[] = [];

    registry.forEachPlugin((plugin) => {
      visited.push(plugin.name);
    });

    expect(visited).toEqual(['b', 'c', 'a']);
  });

  it('always resolves dependencies before dependent plugins', () => {
    const dep = createTestPlugin('dep', { order: 0 });
    const plugin = createTestPlugin('plugin', {
      order: 100,
      dependencies: [dep],
    });

    const registry = new PluginRegistry([], [plugin]);
    const visited: string[] = [];

    registry.forEachPlugin((currentPlugin) => {
      visited.push(currentPlugin.name);
    });

    expect(visited).toEqual(['dep', 'plugin']);
  });

  it('throws when order conflicts with dependency direction', () => {
    const dep = createTestPlugin('dep', { order: 20 });
    const plugin = createTestPlugin('plugin', {
      order: 10,
      dependencies: [dep],
    });

    expect(() => {
      new PluginRegistry([], [plugin]);
    }).toThrow(
      'Plugin order/dependency conflict: "plugin" (order: 10) depends on "dep" (order: 20)',
    );
  });

  it('getPluginsChain() returns internal plugins first, then resolved user chain', () => {
    const internalA = createTestPlugin('internal-a', { order: 10 });
    const internalB = createTestPlugin('internal-b', { order: 20 });
    const userA = createTestPlugin('user-a', { order: 40 });
    const userDep = createTestPlugin('user-dep', { order: 30 });
    const userB = createTestPlugin('user-b', {
      order: 50,
      dependencies: [userDep],
    });

    const registry = new PluginRegistry([internalA, internalB], [userA, userB]);

    expect(registry.getPluginsChain().map((plugin) => plugin.name)).toEqual([
      'internal-a',
      'internal-b',
      'user-a',
      'user-dep',
      'user-b',
    ]);
  });
});

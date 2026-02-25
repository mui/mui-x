import type { AnyPlugin, BaseApi, ExtractPluginApi, PluginRegistryApi } from './plugin';

function comparePluginsByOrder(a: AnyPlugin, b: AnyPlugin): number {
  const orderA = a.order ?? 0;
  const orderB = b.order ?? 0;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return a.name.localeCompare(b.name);
}

function resolvePluginDependencies(userPlugins: readonly AnyPlugin[]): AnyPlugin[] {
  const resolved: AnyPlugin[] = [];
  const resolvedNames = new Set<string>();
  const visiting = new Set<string>();

  function visit(plugin: AnyPlugin): void {
    if (resolvedNames.has(plugin.name)) {
      return;
    }

    if (visiting.has(plugin.name)) {
      throw new Error(
        `Circular dependency detected: plugin "${plugin.name}" depends on itself through its dependency chain.`,
      );
    }

    visiting.add(plugin.name);

    if (plugin.dependencies) {
      const sortedDependencies = [...plugin.dependencies].sort(comparePluginsByOrder);
      for (const dep of sortedDependencies) {
        if (plugin.order !== undefined && dep.order !== undefined && plugin.order < dep.order) {
          throw new Error(
            `Plugin order/dependency conflict: "${plugin.name}" (order: ${plugin.order}) depends on "${dep.name}" (order: ${dep.order}), but dependency order requires "${dep.name}" to run before "${plugin.name}". Update either the dependency relationship or the order values.`,
          );
        }
        visit(dep);
      }
    }

    visiting.delete(plugin.name);
    resolvedNames.add(plugin.name);
    resolved.push(plugin);
  }

  const sortedUserPlugins = [...userPlugins].sort(comparePluginsByOrder);
  for (const plugin of sortedUserPlugins) {
    visit(plugin);
  }

  return resolved;
}

export class PluginRegistry implements PluginRegistryApi {
  private plugins: Map<string, AnyPlugin> = new Map();
  private resolvedPluginsChain: AnyPlugin[] = [];

  constructor(internalPlugins: readonly AnyPlugin[], userPlugins: readonly AnyPlugin[]) {
    internalPlugins.forEach((plugin) => {
      this.register(plugin);
    });

    // Resolve dependencies and register user plugins in dependency order
    const resolvedUserPlugins = resolvePluginDependencies(userPlugins);
    resolvedUserPlugins.forEach((plugin) => {
      if (this.plugins.has(plugin.name)) {
        // Skip if already registered (from internal plugins)
        // This allows dependencies to be internal plugins
        return;
      }
      this.register(plugin);
    });

    const chain: AnyPlugin[] = [];
    const chainNames = new Set<string>();

    internalPlugins.forEach((plugin) => {
      if (!chainNames.has(plugin.name)) {
        chain.push(plugin);
        chainNames.add(plugin.name);
      }
    });

    resolvedUserPlugins.forEach((plugin) => {
      if (chainNames.has(plugin.name)) {
        return;
      }
      const registeredPlugin = this.plugins.get(plugin.name);
      if (registeredPlugin) {
        chain.push(registeredPlugin);
        chainNames.add(plugin.name);
      }
    });

    this.resolvedPluginsChain = chain;

    return this;
  }

  // Type guard for checking plugin availability - narrows api type
  hasPlugin<TPlugin extends AnyPlugin>(
    _api: BaseApi,
    pluginName: TPlugin['name'],
  ): _api is BaseApi & ExtractPluginApi<TPlugin> {
    return this.plugins.has(pluginName);
  }

  register(plugin: AnyPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered.`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  forEachPlugin(callback: (plugin: AnyPlugin) => void): void {
    this.resolvedPluginsChain.forEach(callback);
  }

  getPluginsChain(): readonly AnyPlugin[] {
    return this.resolvedPluginsChain;
  }
}

import type { AnyPlugin, BaseApi, ExtractPluginApi, PluginRegistryApi } from './plugin';

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
      for (const dep of plugin.dependencies) {
        visit(dep);
      }
    }

    visiting.delete(plugin.name);
    resolvedNames.add(plugin.name);
    resolved.push(plugin);
  }

  for (const plugin of userPlugins) {
    visit(plugin);
  }

  return resolved;
}

export class PluginRegistry implements PluginRegistryApi {
  private plugins: Map<string, AnyPlugin> = new Map();
  private resolvedUserPlugins: AnyPlugin[] = [];

  constructor(internalPlugins: readonly AnyPlugin[], userPlugins: readonly AnyPlugin[]) {
    internalPlugins.forEach((plugin) => {
      this.register(plugin);
    });

    // Resolve dependencies and register user plugins in dependency order
    this.resolvedUserPlugins = resolvePluginDependencies(userPlugins);
    this.resolvedUserPlugins.forEach((plugin) => {
      if (this.plugins.has(plugin.name)) {
        // Skip if already registered (from internal plugins)
        // This allows dependencies to be internal plugins
        return;
      }
      this.register(plugin);
    });

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

  forEach(callback: (plugin: AnyPlugin) => void): void {
    this.plugins.forEach(callback);
  }

  forEachUserPlugin(callback: (plugin: AnyPlugin) => void): void {
    // Use resolved order to ensure dependencies are processed first
    this.resolvedUserPlugins.forEach((plugin) => {
      if (this.plugins.has(plugin.name)) {
        callback(plugin);
      }
    });
  }
}

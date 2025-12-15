import type { Plugin } from './plugin';

export class PluginRegistry {
  private plugins: Map<string, Plugin<any, any, any, any, any>> = new Map();
  private pluginOrder: Plugin<any, any, any, any, any>[] = [];
  private internalPluginCount: number = 0;

  constructor(
    internalPlugins: readonly Plugin<any, any, any, any, any>[],
    userPlugins: readonly Plugin<any, any, any, any, any>[],
  ) {
    // Register internal plugins first (maintain order)
    internalPlugins.forEach((plugin) => {
      this.register(plugin);
    });
    this.internalPluginCount = internalPlugins.length;

    // Then register user plugins
    userPlugins.forEach((plugin) => {
      if (this.plugins.has(plugin.name)) {
        throw new Error(
          `Plugin "${plugin.name}" conflicts with an internal plugin. Please use a different name.`,
        );
      }
      this.register(plugin);
    });

    return this;
  }

  hasPlugin(id: string): boolean {
    return this.plugins.has(id);
  }

  register(plugin: Plugin<any, any, any, any, any>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered.`);
    }
    this.plugins.set(plugin.name, plugin);
    this.pluginOrder.push(plugin);
  }

  forEach(callback: (plugin: Plugin<any, any, any, any, any>) => void): void {
    // Iterate in registration order (internal plugins first)
    this.pluginOrder.forEach(callback);
  }

  forEachUserPlugin(callback: (plugin: Plugin<any, any, any, any, any>) => void): void {
    // Only iterate user plugins (skip internal ones)
    this.pluginOrder.slice(this.internalPluginCount).forEach(callback);
  }
}

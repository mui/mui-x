import type { Plugin } from './plugin';

type AnyPlugin = Plugin<any, any, any, any, any>;

export class PluginRegistry {
  private plugins: Map<string, AnyPlugin> = new Map();
  private internalPluginCount: number = 0;

  constructor(internalPlugins: readonly AnyPlugin[], userPlugins: readonly AnyPlugin[]) {
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
    const pluginsArray = Array.from(this.plugins.values());
    for (let i = this.internalPluginCount; i < pluginsArray.length; i += 1) {
      callback(pluginsArray[i]);
    }
  }
}

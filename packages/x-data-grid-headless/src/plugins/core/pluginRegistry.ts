import type { Plugin } from './plugin';

export class PluginRegistry {
  private plugins: Map<string, Plugin<any, any, any, any, any>> = new Map();

  constructor(plugins: readonly Plugin<any, any, any, any, any>[]) {
    plugins.forEach((plugin) => {
      this.register(plugin);
    });

    return this;
  }

  hasPlugin(id: string): boolean {
    return this.plugins.has(id);
  }

  register(plugin: Plugin<any, any, any, any, any>): void {
    this.plugins.set(plugin.name, plugin);
  }

  forEach(callback: (plugin: Plugin<any, any, any, any, any>) => void): void {
    this.plugins.forEach(callback);
  }
}

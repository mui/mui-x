import { MergePluginsProperty } from '../internals/models';
import { TreeViewPluginSignature } from './TreeViewPlugin';

// TODO: Stop hard-coding plugins
export type TreeViewInstance<
  TSignatures extends TreeViewPluginSignature<any, any, any, any, any>[],
> = MergePluginsProperty<TSignatures, 'instance'>;

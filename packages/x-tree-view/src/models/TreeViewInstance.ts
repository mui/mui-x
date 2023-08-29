import { MergePluginsProperty } from '../internals/models';
import { TreeViewAnyPluginSignature } from './TreeViewPlugin';

export type TreeViewInstance<TSignatures extends readonly TreeViewAnyPluginSignature[]> =
  MergePluginsProperty<TSignatures, 'instance'>;

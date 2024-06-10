import * as React from 'react';
import {
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
  TreeViewAnyPluginSignature,
  TreeViewExperimentalFeatures,
  TreeViewPublicAPI,
} from '../models';
import { UseTreeViewBaseParameters } from '../useTreeView/useTreeView.types';

export const extractPluginParamsFromProps = <
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TSlots extends MergeSignaturesProperty<TSignatures, 'slots'>,
  TSlotProps extends MergeSignaturesProperty<TSignatures, 'slotProps'>,
  TProps extends {
    slots?: TSlots;
    slotProps?: TSlotProps;
    apiRef?: React.MutableRefObject<TreeViewPublicAPI<TSignatures> | undefined>;
    experimentalFeatures?: TreeViewExperimentalFeatures<TSignatures>;
  },
>({
  props: { slots, slotProps, apiRef, experimentalFeatures, ...props },
  plugins,
  rootRef,
}: {
  props: TProps;
  plugins: ConvertSignaturesIntoPlugins<TSignatures>;
  rootRef?: React.Ref<HTMLUListElement>;
}) => {
  type PluginParams = MergeSignaturesProperty<TSignatures, 'params'>;

  const paramsLookup = {} as Record<keyof PluginParams, true>;
  plugins.forEach((plugin) => {
    Object.assign(paramsLookup, plugin.params);
  });

  const pluginParams = {
    plugins,
    rootRef,
    slots: slots ?? {},
    slotProps: slotProps ?? {},
    experimentalFeatures: experimentalFeatures ?? {},
    apiRef,
  } as UseTreeViewBaseParameters<TSignatures> & PluginParams;
  const otherProps = {} as Omit<TProps, keyof PluginParams>;

  Object.keys(props).forEach((propName) => {
    const prop = props[propName as keyof typeof props] as any;

    if (paramsLookup[propName as keyof PluginParams]) {
      pluginParams[propName as keyof PluginParams] = prop;
    } else {
      otherProps[propName as keyof typeof otherProps] = prop;
    }
  });

  return { pluginParams, slots, slotProps, otherProps };
};

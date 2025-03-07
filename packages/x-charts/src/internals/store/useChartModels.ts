import * as React from 'react';
import {
  ChartAnyPluginSignature,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
  ChartPlugin,
} from '../plugins/models';
import { ChartCorePluginSignatures } from '../plugins/corePlugins';

/**
 * Implements the same behavior as `useControlled` but for several models.
 * The controlled models are never stored in the state, and the state is only updated if the model is not controlled.
 */
export const useChartModels = <TSignatures extends readonly ChartAnyPluginSignature[]>(
  plugins: ConvertSignaturesIntoPlugins<readonly [...ChartCorePluginSignatures, ...TSignatures]>,
  props: MergeSignaturesProperty<TSignatures, 'defaultizedParams'>,
) => {
  type DefaultizedParams = MergeSignaturesProperty<TSignatures, 'defaultizedParams'>;

  const modelsRef = React.useRef<{
    [modelName: string]: {
      getDefaultValue: (params: DefaultizedParams) => any;
      isControlled: boolean;
    };
  }>({});

  const [modelsState, setModelsState] = React.useState<{ [modelName: string]: any }>(() => {
    const initialState: { [modelName: string]: any } = {};

    plugins.forEach((plugin: ChartPlugin<ChartAnyPluginSignature>) => {
      if (plugin.models) {
        Object.entries(plugin.models).forEach(([modelName, modelInitializer]) => {
          modelsRef.current[modelName] = {
            isControlled: props[modelName as keyof DefaultizedParams] !== undefined,
            getDefaultValue: modelInitializer.getDefaultValue,
          };
          initialState[modelName] = modelInitializer.getDefaultValue(props);
        });
      }
    });

    return initialState;
  });

  const models = Object.fromEntries(
    Object.entries(modelsRef.current).map(([modelName, model]) => {
      const value = props[modelName as keyof DefaultizedParams] ?? modelsState[modelName];

      return [
        modelName,
        {
          value,
          setControlledValue: (newValue: any) => {
            if (!model.isControlled) {
              setModelsState((prevState) => ({
                ...prevState,
                [modelName]: typeof newValue === 'function' ? newValue(value) : newValue,
              }));
            }
          },
          isControlled: modelsRef.current[modelName].isControlled,
        },
      ];
    }),
  ) as MergeSignaturesProperty<TSignatures, 'models'>;

  // We know that `modelsRef` do not vary across renders.
  if (process.env.NODE_ENV !== 'production') {
    Object.entries(modelsRef.current).forEach(([modelName, model]) => {
      const controlled = props[modelName as keyof DefaultizedParams];
      const newDefaultValue = model.getDefaultValue(props);

      /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps, react-compiler/react-compiler */
      React.useEffect(() => {
        if (model.isControlled !== (controlled !== undefined)) {
          console.error(
            [
              `MUI X: A component is changing the ${
                model.isControlled ? '' : 'un'
              }controlled ${modelName} state of Chart to be ${
                model.isControlled ? 'un' : ''
              }controlled.`,
              'Elements should not switch from uncontrolled to controlled (or vice versa).',
              `Decide between using a controlled or uncontrolled ${modelName} ` +
                'element for the lifetime of the component.',
              "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
              'More info: https://fb.me/react-controlled-components',
            ].join('\n'),
          );
        }
      }, [controlled]);

      const { current: defaultValue } = React.useRef(newDefaultValue);

      React.useEffect(() => {
        if (!model.isControlled && defaultValue !== newDefaultValue) {
          console.error(
            [
              `MUI X: A component is changing the default ${modelName} state of an uncontrolled Chart after being initialized. ` +
                `To suppress this warning opt to use a controlled Chart.`,
            ].join('\n'),
          );
        }
      }, [JSON.stringify(newDefaultValue)]);
    });
  }
  /* eslint-enable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */

  return models;
};

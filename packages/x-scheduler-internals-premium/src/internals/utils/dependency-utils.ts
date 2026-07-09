import { warnOnce } from '@mui/x-internals/warning';
import type { SchedulerDependency, SchedulerDependenciesState } from '../../models';

const EMPTY_DEPENDENCY_LIST: readonly SchedulerDependency[] = [];

// `updateStateFromParameters` runs on every render, so an unchanged `dependencies`
// parameter must map to the same state slice instance.
const dependenciesStateCache = new WeakMap<
  readonly SchedulerDependency[],
  SchedulerDependenciesState
>();

export function buildDependenciesState(
  dependencies: readonly SchedulerDependency[] = EMPTY_DEPENDENCY_LIST,
): SchedulerDependenciesState {
  let state = dependenciesStateCache.get(dependencies);
  if (state == null) {
    const dependencyModelLookup = new Map(
      dependencies.map((dependency) => [dependency.id, dependency]),
    );

    if (process.env.NODE_ENV !== 'production') {
      if (dependencyModelLookup.size !== dependencies.length) {
        const seen = new Set<SchedulerDependency['id']>();
        for (const dependency of dependencies) {
          if (seen.has(dependency.id)) {
            warnOnce([
              `MUI X Scheduler: Two or more dependencies share the same id "${String(dependency.id)}".`,
              'Only the last one is reachable by id, the other ones are ignored.',
            ]);
          }
          seen.add(dependency.id);
        }
      }
    }

    state = { dependencyModelList: dependencies, dependencyModelLookup };
    dependenciesStateCache.set(dependencies, state);
  }
  return state;
}

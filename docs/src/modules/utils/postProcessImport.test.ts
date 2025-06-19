import { getPickerAdapterDeps } from './getPickerAdapterDeps';
import { ADAPTER_TO_LIBRARY, postProcessImport } from './postProcessImport';

const adapterDependencies = getPickerAdapterDeps();

// @ts-expect-error, ADAPTER_DEPENDENCIES is replaced at run/build time
globalThis.ADAPTER_DEPENDENCIES = JSON.stringify(adapterDependencies);

describe('postProcessImport', () => {
  const ADAPTERS = ['AdapterDateFns', 'AdapterDayjs', 'AdapterLuxon', 'AdapterMoment'];

  describe('@mui/lab imports', () => {
    ADAPTERS.forEach((adapter) => {
      it('should provide correct adapter', () => {
        const resolvedDep = postProcessImport(`@mui/lab/${adapter}`);

        const expectedLibrary = ADAPTER_TO_LIBRARY[adapter];
        expect(resolvedDep).to.deep.equal({
          [expectedLibrary]: adapterDependencies[expectedLibrary],
        });
      });
    });
  });

  describe('@mui/x-date-pickers imports', () => {
    const ALL_ADAPTERS = [
      ...ADAPTERS,
      'AdapterDateFnsJalali',
      'AdapterMomentHijri',
      'AdapterMomentJalaali',
    ];
    ALL_ADAPTERS.forEach((adapter) => {
      it('should provide correct adapter', () => {
        const resolvedDep = postProcessImport(`@mui/x-date-pickers/${adapter}`);

        const expectedLibrary = ADAPTER_TO_LIBRARY[adapter];
        expect(resolvedDep).to.deep.equal({
          [expectedLibrary]: adapterDependencies[expectedLibrary],
        });
      });
    });
  });

  describe('@mui/x-date-pickers-pro imports', () => {
    const ALL_ADAPTERS = [
      ...ADAPTERS,
      'AdapterDateFnsJalali',
      'AdapterMomentHijri',
      'AdapterMomentJalaali',
    ];
    ALL_ADAPTERS.forEach((adapter) => {
      it('should provide correct adapter', () => {
        const resolvedDep = postProcessImport(`@mui/x-date-pickers-pro/${adapter}`);

        const expectedLibrary = ADAPTER_TO_LIBRARY[adapter];
        expect(resolvedDep).to.deep.equal({
          [expectedLibrary]: adapterDependencies[expectedLibrary],
        });
      });
    });
  });
});

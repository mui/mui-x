import { getPickerAdapterDeps } from './getPickerAdapterDeps';
import { ADAPTER_TO_LIBRARY, postProcessImport } from './postProcessImport';

const adapterDependencies = getPickerAdapterDeps();

// @ts-expect-error, ADAPTER_DEPENDENCIES is set on the global object. This will be automatically picked up the
// postProcessImport function when testing, though in production we automatically replace this with the actual value.
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

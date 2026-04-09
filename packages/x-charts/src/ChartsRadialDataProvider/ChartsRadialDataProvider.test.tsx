import * as React from 'react';
import { vi } from 'vitest';
import { createRenderer } from '@mui/internal-test-utils';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { type ChartsLocaleText } from '@mui/x-charts/locales';
import { Unstable_ChartsRadialDataProvider as ChartsRadialDataProvider } from '@mui/x-charts/ChartsRadialDataProvider';
import { useChartsSlots } from '../context/ChartsSlotsContext';
import { useStore } from '../internals/store/useStore';
import { selectorChartPolarAxisState } from '../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarAxis.selectors';
import { selectorChartCartesianAxisState } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisLayout.selectors';

describe('<ChartsRadialDataProvider />', () => {
  const { render } = createRenderer();

  it('should setup localization', () => {
    const handleContextChange = vi.fn();

    function LocaleListener() {
      const context = useChartsLocalization();
      React.useEffect(() => {
        handleContextChange(context);
      }, [context]);
      return null;
    }

    render(
      <ChartsRadialDataProvider width={100} height={100} localeText={{ noData: 'Aucune donnée' }}>
        <LocaleListener />
      </ChartsRadialDataProvider>,
    );

    const localeText: ChartsLocaleText = handleContextChange.mock.lastCall?.[0].localeText;
    expect(localeText.noData).to.equal('Aucune donnée');
    // Default values should still be available
    expect(localeText.loading).to.equal('Loading data…');
  });

  it('should propagate slots and slotProps', () => {
    const handleSlotsChange = vi.fn();
    function CustomButton() {
      return <button>custom</button>;
    }

    function SlotsListener() {
      const context = useChartsSlots();
      React.useEffect(() => {
        handleSlotsChange(context);
      }, [context]);
      return null;
    }

    render(
      <ChartsRadialDataProvider
        width={100}
        height={100}
        slots={{ baseButton: CustomButton }}
        slotProps={{ baseButton: { disabled: true } }}
      >
        <SlotsListener />
      </ChartsRadialDataProvider>,
    );

    const { slots, slotProps } = handleSlotsChange.mock.lastCall![0];
    expect(slots.baseButton).to.equal(CustomButton);
    expect(slotProps.baseButton).to.deep.equal({ disabled: true });
  });

  it('should setup a store with rotation/radius axes but not x/y axes', () => {
    const handleStoreChange = vi.fn();

    function StoreListener() {
      const store = useStore();
      React.useEffect(() => {
        const state = store.getSnapshot();
        handleStoreChange({
          polarAxis: selectorChartPolarAxisState(state),
          cartesianAxis: selectorChartCartesianAxisState(state),
        });
      });
      return null;
    }

    render(
      <ChartsRadialDataProvider
        width={100}
        height={100}
        rotationAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]}
        radiusAxis={[{ id: 'radius-1' }]}
      >
        <StoreListener />
      </ChartsRadialDataProvider>,
    );

    const { polarAxis, cartesianAxis } = handleStoreChange.mock.lastCall![0];

    // Polar axes should be defined
    expect(polarAxis).to.not.equal(undefined);
    expect(polarAxis.rotation).to.have.length(1);
    expect(polarAxis.radius).to.have.length(1);
    expect(polarAxis.radius[0].id).to.equal('radius-1');

    // Cartesian axes should not be defined
    expect(cartesianAxis).to.equal(undefined);
  });
});

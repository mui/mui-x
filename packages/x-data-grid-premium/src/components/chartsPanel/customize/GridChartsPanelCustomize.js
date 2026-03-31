import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import { GridOverlay, GridShadowScrollArea } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridChartsIntegrationContext } from '../../../hooks/utils/useGridChartIntegration';
import { Collapsible } from '../../collapsible/Collapsible';
import { CollapsibleTrigger } from '../../collapsible/CollapsibleTrigger';
import { CollapsiblePanel } from '../../collapsible/CollapsiblePanel';
import { EMPTY_CHART_INTEGRATION_CONTEXT_STATE } from '../../../hooks/features/chartsIntegration/useGridChartsIntegration';
const GridChartsPanelCustomizeRoot = styled(GridShadowScrollArea)({
    height: '100%',
});
const GridChartsPanelCustomizeSection = styled(Collapsible, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelCustomizeSection',
})({
    margin: vars.spacing(0.5, 1),
});
const GridChartsPanelCustomizePanel = styled(CollapsiblePanel, {
    name: 'MuiDataGrid',
    slot: 'chartsPanelSection',
})({
    display: 'flex',
    flexDirection: 'column',
    padding: vars.spacing(2, 1.5),
    gap: vars.spacing(3),
});
const GridChartsPanelCustomizePanelTitle = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelCustomizePanelTitle',
})({
    font: vars.typography.font.body,
    fontWeight: vars.typography.fontWeight.medium,
});
export function GridChartsPanelCustomize(props) {
    const { activeChartId, sections } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const { chartStateLookup, setChartState } = useGridChartsIntegrationContext();
    const { type: chartType, configuration, dimensions, values, } = chartStateLookup[activeChartId] ?? EMPTY_CHART_INTEGRATION_CONTEXT_STATE;
    const handleChange = (field, value) => {
        setChartState(activeChartId, {
            ...configuration,
            configuration: { ...configuration, [field]: value },
        });
    };
    if (chartType === '') {
        return _jsx(GridOverlay, { children: apiRef.current.getLocaleText('chartsChartNotSelected') });
    }
    return (_jsx(GridChartsPanelCustomizeRoot, { children: sections.map((section, index) => (_jsxs(GridChartsPanelCustomizeSection, { initiallyOpen: index === 0, ownerState: rootProps, children: [_jsx(CollapsibleTrigger, { children: _jsx(GridChartsPanelCustomizePanelTitle, { ownerState: rootProps, children: section.label }) }), _jsx(GridChartsPanelCustomizePanel, { ownerState: rootProps, children: Object.entries(section.controls).map(([key, optRaw]) => {
                        const opt = optRaw;
                        const context = { configuration, dimensions, values };
                        const isHidden = opt.isHidden?.(context) ?? false;
                        if (isHidden) {
                            return null;
                        }
                        const isDisabled = opt.isDisabled?.(context) ?? false;
                        if (opt.type === 'boolean') {
                            return (_jsx(rootProps.slots.baseSwitch, { checked: Boolean(configuration[key] ?? opt.default), onChange: (event) => handleChange(key, event.target.checked), size: "small", label: opt.label, disabled: isDisabled, ...rootProps.slotProps?.baseSwitch }, key));
                        }
                        if (opt.type === 'select') {
                            return (_jsx(rootProps.slots.baseSelect, { fullWidth: true, size: "small", label: opt.label, value: configuration[key] ?? opt.default, onChange: (event) => handleChange(key, event.target.value), disabled: isDisabled, slotProps: {
                                    htmlInput: {
                                        ...opt.htmlAttributes,
                                    },
                                }, ...rootProps.slotProps?.baseSelect, children: (opt.options || []).map((option) => (_jsx(rootProps.slots.baseSelectOption, { value: option.value, native: false, children: option.content }, option.value))) }, key));
                        }
                        // string or number
                        return (_jsx(rootProps.slots.baseTextField, { "aria-label": opt.label, placeholder: opt.label, label: opt.label, type: opt.type === 'number' ? 'number' : 'text', size: "small", fullWidth: true, disabled: isDisabled, slotProps: {
                                htmlInput: {
                                    ...opt.htmlAttributes,
                                },
                            }, ...rootProps.slotProps?.baseTextField, value: (configuration[key] ?? opt.default ?? '').toString(), onChange: (event) => handleChange(key, opt.type === 'number' ? Number(event.target.value) : event.target.value) }, key));
                    }) })] }, section.id))) }));
}

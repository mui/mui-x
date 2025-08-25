"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var LineChart_1 = require("@mui/x-charts/LineChart");
var internal_test_utils_1 = require("@mui/internal-test-utils");
describe('<LineChart />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)(<LineChart_1.LineChart height={100} width={100} series={[{ data: [100, 200] }]}/>, function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiLineChart',
        testComponentPropWith: 'div',
        refInstanceof: window.SVGSVGElement,
        skip: [
            'componentProp',
            'componentsProp',
            'slotPropsProp',
            'slotPropsCallback',
            'slotsProp',
            'themeStyleOverrides',
            'themeVariants',
            'themeCustomPalette',
            'themeDefaultProps',
        ],
    }); });
    it('should render "No data to display" when axes are empty arrays', function () {
        render(<LineChart_1.LineChart series={[]} width={100} height={100} xAxis={[]} yAxis={[]}/>);
        expect(internal_test_utils_1.screen.getByText('No data to display')).toBeVisible();
    });
});

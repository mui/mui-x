"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeSlotsConformance = void 0;
exports.innerDescribeSlotsConformance = innerDescribeSlotsConformance;
var React = require("react");
var createDescribe_1 = require("@mui/internal-test-utils/createDescribe");
function innerDescribeSlotsConformance(params) {
    var getElement = params.getElement, render = params.render, slots = params.slots;
    Object.keys(slots).forEach(function (slotName) {
        describe("Slot: ".concat(slotName), function () {
            it('should replace the default slot when defined', function () {
                var _a;
                var slotConfig = slots[slotName];
                var response = render(getElement({
                    slotName: slotName,
                    props: {
                        slots: (_a = {},
                            _a[slotName] = React.forwardRef(function (props, ref) { return (<div ref={ref} data-testid="custom-slot"/>); }),
                            _a),
                    },
                }));
                // Check if the default slot is being rendered
                expect(response.container.querySelector(".".concat(slotConfig.className))).to.equal(null);
                // Check if the custom slot is being rendered
                expect(response.getByTestId('custom-slot')).not.to.equal(null);
            });
            it('should pass props to the default slot', function () {
                var _a;
                var slotConfig = slots[slotName];
                var response = render(getElement({
                    slotName: slotName,
                    props: {
                        slotProps: (_a = {},
                            _a[slotName] = { 'data-testid': 'default-slot', className: 'default-slot' },
                            _a),
                    },
                }));
                var slotElement = response.container.querySelector(".".concat(slotConfig.className));
                // Check if the default slot is being rendered
                expect(slotElement).not.to.equal(null);
                // Check if the default slot receives the `data-testid`
                expect(slotElement).to.have.attribute('data-testid', 'default-slot');
                // Check if the custom class is being applied
                expect(slotElement).to.have.class('default-slot');
                // Make sure that the default class has not been removed
                expect(slotElement).to.have.class(slotConfig.className);
            });
        });
    });
}
/**
 * Test the slots of the component.
 */
exports.describeSlotsConformance = (0, createDescribe_1.default)('Slots conformance', innerDescribeSlotsConformance);

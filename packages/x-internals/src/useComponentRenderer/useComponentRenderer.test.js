"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var useComponentRenderer_1 = require("./useComponentRenderer");
describe('useComponentRenderer', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function TestComponent(props) {
        var renderProp = props.render, other = __rest(props, ["render"]);
        return (0, useComponentRenderer_1.useComponentRenderer)('button', renderProp, other, { someState: 'state value' });
    }
    it('should render intrinsic element type as default element', function () {
        render(<TestComponent data-testid="rendered-element">children</TestComponent>);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLButtonElement);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.text('children');
    });
    it('should render component type as default element', function () {
        function CustomButton(props) {
            return <button {...props}/>;
        }
        function TestComponentWithCustomButton(props) {
            return (0, useComponentRenderer_1.useComponentRenderer)(CustomButton, undefined, props);
        }
        render(<TestComponentWithCustomButton data-testid="rendered-element">
        children
      </TestComponentWithCustomButton>);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLButtonElement);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.text('children');
    });
    it('should allow default element to be overridden by render prop set to a children', function () {
        render(<TestComponent data-testid="rendered-element" render={<div>children</div>}/>);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.text('children');
    });
    it('should allow default element to be overridden by render prop set to a function', function () {
        render(<TestComponent data-testid="rendered-element" render={function (props) { return (<div {...props}>children</div>); }}/>);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.text('children');
    });
    it('should pass state to render prop', function () {
        render(<TestComponent data-testid="rendered-element" render={function (props, state) { return (<div {...props}>{state.someState}</div>); }}/>);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.text('state value');
    });
    it('should merge className props', function () {
        render(<TestComponent data-testid="rendered-element" className="test-class-1" render={<div className="test-class-2"/>}/>);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.class('test-class-1');
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.class('test-class-2');
    });
    it('should merge style props', function () {
        render(<TestComponent data-testid="rendered-element" style={{ color: 'blue', outline: '1px solid red' }} render={<div style={{ backgroundColor: 'blue', outline: 'blue solid 1px' }}/>}/>);
        expect(internal_test_utils_1.screen.getByTestId('rendered-element')).to.have.attribute('style', 'color: blue; outline: blue solid 1px; background-color: blue;');
    });
});

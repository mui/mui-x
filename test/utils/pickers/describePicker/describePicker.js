"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.describePicker = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var SvgIcon_1 = require("@mui/material/SvgIcon");
function innerDescribePicker(ElementToTest, options) {
    var _this = this;
    var render = options.render, fieldType = options.fieldType, hasNoView = options.hasNoView, variant = options.variant;
    var propsToOpen = variant === 'static' ? {} : { open: true };
    it.skipIf(fieldType === 'multi-input' || variant === 'static')('should forward the `inputRef` prop to the text field (<input /> textfield DOM structure only)', function () {
        var inputRef = React.createRef();
        render(<ElementToTest inputRef={inputRef} enableAccessibleFieldDOMStructure={false}/>);
        expect(inputRef.current).to.have.tagName('input');
    });
    describe('Localization', function () {
        it.skipIf(Boolean(hasNoView))('should respect the `localeText` prop', function () {
            render(<ElementToTest {...propsToOpen} localeText={{ cancelButtonLabel: 'Custom cancel' }} slotProps={{ actionBar: { actions: ['cancel'] } }}/>);
            expect(internal_test_utils_1.screen.queryByText('Custom cancel')).not.to.equal(null);
        });
    });
    describe('Component slot: OpenPickerIcon', function () {
        it.skipIf(variant === 'static' || fieldType === 'multi-input')('should render custom component', function () {
            function HomeIcon(props) {
                return (<SvgIcon_1.default data-testid="component-test" {...props}>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </SvgIcon_1.default>);
            }
            var queryAllByTestId = render(<ElementToTest slots={{
                    openPickerIcon: HomeIcon,
                }}/>).queryAllByTestId;
            expect(queryAllByTestId('component-test')).to.have.length(hasNoView ? 0 : 1);
        });
    });
    describe('Component slot: DesktopPaper', function () {
        it.skipIf(hasNoView || variant !== 'desktop')('should forward onClick and onTouchStart', function () {
            var handleClick = (0, sinon_1.spy)();
            var handleTouchStart = (0, sinon_1.spy)();
            render(<ElementToTest {...propsToOpen} slotProps={{
                    desktopPaper: {
                        onClick: handleClick,
                        onTouchStart: handleTouchStart,
                        'data-testid': 'paper',
                    },
                }}/>);
            var paper = internal_test_utils_1.screen.getByTestId('paper');
            internal_test_utils_1.fireEvent.click(paper);
            internal_test_utils_1.fireEvent.touchStart(paper);
            expect(handleClick.callCount).to.equal(1);
            expect(handleTouchStart.callCount).to.equal(1);
        });
    });
    describe('Component slot: Popper', function () {
        it.skipIf(hasNoView || variant !== 'desktop')('should forward onClick and onTouchStart', function () {
            var handleClick = (0, sinon_1.spy)();
            var handleTouchStart = (0, sinon_1.spy)();
            render(<ElementToTest {...propsToOpen} slotProps={{
                    popper: {
                        onClick: handleClick,
                        onTouchStart: handleTouchStart,
                        'data-testid': 'popper',
                    },
                }}/>);
            var popper = internal_test_utils_1.screen.getByTestId('popper');
            internal_test_utils_1.fireEvent.click(popper);
            internal_test_utils_1.fireEvent.touchStart(popper);
            expect(handleClick.callCount).to.equal(1);
            expect(handleTouchStart.callCount).to.equal(1);
        });
    });
    describe('Component slot: Toolbar', function () {
        it.skipIf(Boolean(hasNoView))('should render toolbar on mobile but not on desktop when `hidden` is not defined', function () {
            render(<ElementToTest {...propsToOpen} slotProps={{ toolbar: { 'data-testid': 'pickers-toolbar' } }}/>);
            if (variant === 'desktop') {
                expect(internal_test_utils_1.screen.queryByTestId('pickers-toolbar')).to.equal(null);
            }
            else {
                expect(internal_test_utils_1.screen.getByTestId('pickers-toolbar')).toBeVisible();
            }
        });
        it.skipIf(Boolean(hasNoView))('should render toolbar when `hidden` is `false`', function () {
            render(<ElementToTest {...propsToOpen} slotProps={{ toolbar: { hidden: false, 'data-testid': 'pickers-toolbar' } }}/>);
            expect(internal_test_utils_1.screen.getByTestId('pickers-toolbar')).toBeVisible();
        });
        it.skipIf(Boolean(hasNoView))('should not render toolbar when `hidden` is `true`', function () {
            render(<ElementToTest {...propsToOpen} slotProps={{ toolbar: { hidden: true, 'data-testid': 'pickers-toolbar' } }}/>);
            expect(internal_test_utils_1.screen.queryByTestId('pickers-toolbar')).to.equal(null);
        });
    });
    describe('prop: disableOpenPicker', function () {
        it.skipIf(variant === 'static')('should not render the open picker button, but still render the picker if its open', function () {
            var _a;
            render(<ElementToTest disableOpenPicker {...propsToOpen} slotProps={{
                    layout: {
                        classes: {
                            contentWrapper: 'test-pickers-content-wrapper',
                        },
                    },
                }}/>);
            expect(internal_test_utils_1.screen.queryByRole('button', { name: /Choose/ })).to.equal(null);
            // check if anything has been rendered inside the layout content wrapper
            expect((_a = document.querySelector('.test-pickers-content-wrapper')) === null || _a === void 0 ? void 0 : _a.hasChildNodes()).to.equal(true);
        });
    });
    it.skipIf(variant === 'static' || fieldType === 'multi-input')('should bring the focus back to the open button when the picker is closed', function () { return __awaiter(_this, void 0, void 0, function () {
        var user, openButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<ElementToTest />).user;
                    openButton = internal_test_utils_1.screen.getByRole('button', { name: /Choose/ });
                    // open Picker
                    return [4 /*yield*/, user.click(openButton)];
                case 1:
                    // open Picker
                    _a.sent();
                    // close Picker
                    return [4 /*yield*/, user.keyboard('[Escape]')];
                case 2:
                    // close Picker
                    _a.sent();
                    expect(openButton).to.toHaveFocus();
                    expect(document.activeElement).to.equal(openButton);
                    return [2 /*return*/];
            }
        });
    }); });
}
/**
 * Test behaviors shared across all pickers.
 */
exports.describePicker = (0, internal_test_utils_1.createDescribe)('Pickers shared APIs', innerDescribePicker);

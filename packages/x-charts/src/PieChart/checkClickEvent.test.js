"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var vitest_1 = require("vitest");
var PieChart_1 = require("@mui/x-charts/PieChart");
var config = {
    width: 400,
    height: 400,
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
};
describe('PieChart - click event', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('onItemClick', function () {
        it('should add cursor="pointer" to arc elements', function () {
            var container = render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, __assign({}, config, { series: [
                    {
                        id: 's1',
                        data: [
                            { id: 'p1', value: 5 },
                            { id: 'p2', value: 2 },
                        ],
                    },
                ], onItemClick: function () { } }))).container;
            var slices = container.querySelectorAll('path.MuiPieArc-root');
            expect(Array.from(slices).map(function (slice) { return slice.getAttribute('cursor'); })).to.deep.equal([
                'pointer',
                'pointer',
            ]);
        });
        it('should provide the right context as second argument', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, slices;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        onItemClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, __assign({}, config, { series: [
                                {
                                    id: 's1',
                                    data: [
                                        { id: 'p1', value: 5 },
                                        { id: 'p2', value: 2 },
                                    ],
                                },
                            ], onItemClick: onItemClick }))).user;
                        slices = document.querySelectorAll('path.MuiPieArc-root');
                        return [4 /*yield*/, user.click(slices[0])];
                    case 1:
                        _c.sent();
                        expect((_a = onItemClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            type: 'pie',
                            seriesId: 's1',
                            dataIndex: 0,
                        });
                        return [4 /*yield*/, user.click(slices[1])];
                    case 2:
                        _c.sent();
                        expect((_b = onItemClick.mock.lastCall) === null || _b === void 0 ? void 0 : _b[1]).to.deep.equal({
                            type: 'pie',
                            seriesId: 's1',
                            dataIndex: 1,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});

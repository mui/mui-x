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
exports.openPickerAsync = exports.openPicker = void 0;
var internal_test_utils_1 = require("@mui/internal-test-utils");
var fields_1 = require("test/utils/pickers/fields");
/**
 * @deprecated use `openPickerAsync` instead
 */
var openPicker = function (params) {
    var isRangeType = params.type === 'date-range' ||
        params.type === 'date-time-range' ||
        params.type === 'time-range';
    if (isRangeType && params.fieldType === 'multi-input') {
        var fieldSectionsContainer = (0, fields_1.getFieldSectionsContainer)(params.initialFocus === 'end' ? 1 : 0);
        internal_test_utils_1.fireEvent.click(fieldSectionsContainer);
        return true;
    }
    var target = internal_test_utils_1.screen.getByLabelText(/(choose date)|(choose time)|(choose range)/i);
    internal_test_utils_1.fireEvent.click(target);
    return true;
};
exports.openPicker = openPicker;
var openPickerAsync = function (user, params) { return __awaiter(void 0, void 0, void 0, function () {
    var isRangeType, fieldSectionsContainer, target;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                isRangeType = params.type === 'date-range' ||
                    params.type === 'date-time-range' ||
                    params.type === 'time-range';
                if (!(isRangeType && params.fieldType === 'multi-input')) return [3 /*break*/, 2];
                fieldSectionsContainer = (0, fields_1.getFieldSectionsContainer)(params.initialFocus === 'end' ? 1 : 0);
                return [4 /*yield*/, user.click(fieldSectionsContainer)];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                target = internal_test_utils_1.screen.getByLabelText(/(choose date)|(choose time)|(choose range)/i);
                return [4 /*yield*/, user.click(target)];
            case 3:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.openPickerAsync = openPickerAsync;

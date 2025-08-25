#!/usr/bin/env node
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var yargs_1 = require("yargs");
var jscodeshiftPackage = require('jscodeshift/package.json');
var jscodeshiftDirectory = path_1.default.dirname(require.resolve('jscodeshift'));
var jscodeshiftExecutable = path_1.default.join(jscodeshiftDirectory, jscodeshiftPackage.bin.jscodeshift);
function runTransform(transform, files, flags, codemodFlags) {
    return __awaiter(this, void 0, void 0, function () {
        var transformerSrcPath, transformerBuildPath, transformerPath, srcPathError_1, buildPathError_1, args, jscodeshiftProcess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transformerSrcPath = path_1.default.resolve(__dirname, './src', transform);
                    transformerBuildPath = path_1.default.resolve(__dirname, transform);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, fs_1.promises.stat(transformerSrcPath)];
                case 2:
                    _a.sent();
                    transformerPath = transformerSrcPath;
                    return [3 /*break*/, 8];
                case 3:
                    srcPathError_1 = _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, fs_1.promises.stat(transformerBuildPath)];
                case 5:
                    _a.sent();
                    transformerPath = transformerBuildPath;
                    return [3 /*break*/, 7];
                case 6:
                    buildPathError_1 = _a.sent();
                    if (buildPathError_1.code === 'ENOENT') {
                        throw new Error("Transform '".concat(transform, "' not found. Check out ").concat(path_1.default.resolve(__dirname, './README.md for a list of available codemods.')));
                    }
                    throw buildPathError_1;
                case 7: return [3 /*break*/, 8];
                case 8:
                    args = __spreadArray(__spreadArray(__spreadArray([
                        // can't directly spawn `jscodeshiftExecutable` due to https://github.com/facebook/jscodeshift/issues/424
                        jscodeshiftExecutable,
                        '--transform',
                        transformerPath
                    ], codemodFlags, true), [
                        '--extensions',
                        'js,ts,jsx,tsx',
                        '--parser',
                        flags.parser || 'tsx',
                        '--ignore-pattern',
                        '**/node_modules/**'
                    ], false), flags.jscodeshift, true);
                    args.push.apply(args, files);
                    // eslint-disable-next-line no-console -- debug information
                    console.log("Executing command: jscodeshift ".concat(args.join(' ')));
                    console.warn("\n====================================\nIMPORTANT NOTICE ABOUT CODEMOD USAGE\n====================================\nNot all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies and etc., the changes are not properly identified and therefore must be handled manually.\n\nFor example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.\n<DatePicker {...pickerProps} />\n  \nAfter running the codemods, make sure to test your application and that you don't have any formatting or console errors.\n");
                    jscodeshiftProcess = child_process_1.default.spawnSync('node', args, { stdio: 'inherit' });
                    if (jscodeshiftProcess.error) {
                        throw jscodeshiftProcess.error;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function run(argv) {
    var codemod = argv.codemod, paths = argv.paths, other = argv._, jscodeshift = argv.jscodeshift, parser = argv.parser;
    return runTransform(codemod, paths.map(function (filePath) { return path_1.default.resolve(filePath); }), { jscodeshift: jscodeshift, parser: parser }, other || []);
}
(0, yargs_1.default)(process.argv.slice(2))
    .command({
    command: '$0 <codemod> <paths...>',
    describe: 'Applies a `@mui/x-codemod` to the specified paths',
    builder: function (command) {
        return command
            .positional('codemod', {
            description: 'The name of the codemod',
            type: 'string',
        })
            .positional('paths', {
            array: true,
            description: 'Paths forwarded to `jscodeshift`',
            type: 'string',
        })
            .option('parser', {
            description: 'which parser for jscodeshift to use',
            default: 'tsx',
            type: 'string',
        })
            .option('jscodeshift', {
            description: '(Advanced) Pass options directly to jscodeshift',
            default: [],
            type: 'array',
        });
    },
    handler: run,
})
    .scriptName('npx @mui/x-codemod')
    .example('$0 v6.0.0/preset-safe src', 'Run "preset-safe" codemod on "src" path')
    .example('$0 v6.0.0/component-rename-prop src -- --component=DataGrid --from=prop --to=newProp', 'Run "component-rename-prop" codemod in "src" path on "DataGrid" component with custom "from" and "to" arguments')
    .help()
    .parse();

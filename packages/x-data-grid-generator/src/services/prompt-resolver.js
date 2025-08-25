"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPromptResolver = void 0;
var prompts_1 = require("../constants/prompts");
var mockPromptResolver = function (query, _) {
    var resolved = prompts_1.mockPrompts.get(query.toLowerCase().trim());
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (resolved) {
                resolve(resolved);
            }
            else {
                console.error("Unsupported query: ".concat(query));
                reject(new Error('Could not process prompt'));
            }
        }, 1000);
    });
};
exports.mockPromptResolver = mockPromptResolver;

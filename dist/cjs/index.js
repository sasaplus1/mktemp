"use strict";
/*!
 * @license mktemp Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/mktemp
 * Released under the MIT license.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueName = void 0;
__exportStar(require("./creation"), exports);
var unique_name_1 = require("./unique_name");
Object.defineProperty(exports, "generateUniqueName", { enumerable: true, get: function () { return unique_name_1.generateUniqueName; } });
//# sourceMappingURL=index.js.map
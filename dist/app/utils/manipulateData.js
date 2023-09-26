"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class ManipulateData {
    validateData(text) {
        if (!(text.length === 5)) {
            return false;
        }
        else if (!(0, moment_timezone_1.default)(`${(0, moment_timezone_1.default)().format('YYYY')}-${text.substring(3, 5)}-${text.substring(0, 2)}`).isValid()) {
            return false;
        }
        else if (!(0, moment_timezone_1.default)(`${(0, moment_timezone_1.default)().format('YYYY')}-${text.substring(3, 5)}-${text.substring(0, 2)}`).isSameOrAfter((0, moment_timezone_1.default)().hours(0).minutes(0).seconds(0).milliseconds(0))) {
            return false;
        }
        return true;
    }
    formatData(text) {
        return (0, moment_timezone_1.default)(`${(0, moment_timezone_1.default)().format('YYYY')}-${text.substring(3, 5)}-${text.substring(0, 2)}`);
    }
}
exports.default = new ManipulateData();

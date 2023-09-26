"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Internal Server Error';
        this.statusCode = 500;
    }
}
exports.default = InternalServerError;

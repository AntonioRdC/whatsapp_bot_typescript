"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Not Found Error';
        this.statusCode = 404;
    }
}
exports.default = NotFoundError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Bad Request Error';
        this.statusCode = 400;
    }
}
exports.default = BadRequestError;

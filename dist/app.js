"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const index_router_1 = __importDefault(require("./routes/index.router"));
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middlewares();
        this.routes();
    }
    init() {
        return this.server;
    }
    middlewares() {
        this.server.use(express_1.default.json({}));
        this.server.use(express_1.default.urlencoded({
            extended: true,
        }));
        this.server.use((0, cors_1.default)());
    }
    routes() {
        this.server.use(...index_router_1.default);
    }
}
exports.default = App;

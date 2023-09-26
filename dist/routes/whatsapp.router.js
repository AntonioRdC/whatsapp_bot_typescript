"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WhatsAppController_1 = __importDefault(require("../app/controller/WhatsAppController"));
const router = (0, express_1.Router)();
router.post('/whatsapp', WhatsAppController_1.default.post);
router.get('/whatsapp', WhatsAppController_1.default.get);
exports.default = router;

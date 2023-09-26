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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class TutorRepository {
    postText(text, number) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.post(`https://graph.facebook.com/v17.0/${process.env.IDENTIFY_NUMBER_META}/messages`, {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: number,
                type: 'text',
                text: {
                    preview_url: true,
                    body: text,
                },
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.BEARER}`,
                },
            });
        });
    }
    postInteractive(text, number) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.post(`https://graph.facebook.com/v17.0/${process.env.IDENTIFY_NUMBER_META}/messages`, {
                messaging_product: 'whatsapp',
                to: number,
                type: 'interactive',
                interactive: {
                    type: 'button',
                    body: {
                        text: 'Selecione um dos horários disponíveis',
                    },
                    action: {
                        buttons: text,
                    },
                },
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.BEARER}`,
                },
            });
        });
    }
}
exports.default = new TutorRepository();

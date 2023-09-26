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
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const myConsole = new console.Console(fs_1.default.createWriteStream('./logs.txt'));
const calendarId = process.env.calendarId;
const serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
};
const serviceAccountAuth = new googleapis_1.google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: 'https://www.googleapis.com/auth/calendar',
});
const calendar = googleapis_1.google.calendar('v3');
class CalendarRepository {
    get(dateTimeStart, dateTimeEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield calendar.events.list({
                auth: serviceAccountAuth,
                calendarId,
                timeMin: dateTimeStart,
                timeMax: dateTimeEnd,
            });
            const result = [];
            if (request.data.items !== undefined) {
                const events = [];
                request.data.items.forEach((event, i) => {
                    var _a, _b, _c;
                    if (((_a = event.start) === null || _a === void 0 ? void 0 : _a.dateTime) !== null &&
                        ((_b = event.start) === null || _b === void 0 ? void 0 : _b.dateTime) !== undefined) {
                        const date = (_c = event.start) === null || _c === void 0 ? void 0 : _c.dateTime;
                        events.push(Number(date.split('T')[1].split('-')[0].split(':')[0]));
                    }
                });
                for (const i of events) {
                    myConsole.log(`events = ${i}`);
                }
                for (let index = 6; index < 18; index++) {
                    if (!events.includes(index)) {
                        result.push(index);
                    }
                }
            }
            return result;
        });
    }
    post(dateTimeStart, dateTimeEnd, name, phone, cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `Nome: ${name}\nTelefone: ${phone}\nCpf: ${cpf}`;
            const request = yield calendar.events.list({
                auth: serviceAccountAuth,
                calendarId,
                timeMin: dateTimeStart,
                timeMax: dateTimeEnd,
            });
            if (request.data.items === undefined || request.data.items.length > 0) {
                return 'O horário solicitado está em conflito com outro compromisso';
            }
            else {
                yield calendar.events
                    .insert({
                    auth: serviceAccountAuth,
                    calendarId,
                    requestBody: {
                        summary: name,
                        description,
                        start: { dateTime: dateTimeStart },
                        end: { dateTime: dateTimeEnd },
                    },
                })
                    .catch((e) => {
                    return 'Horário não agendado.';
                });
            }
            return 'Horário Cadastrado.';
        });
    }
}
exports.default = new CalendarRepository();

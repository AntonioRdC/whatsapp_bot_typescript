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
const getText_1 = __importDefault(require("../utils/getText"));
const UserSchema_1 = __importDefault(require("../schema/UserSchema"));
const manipulateData_1 = __importDefault(require("../utils/manipulateData"));
const WhatsAppRepository_1 = __importDefault(require("../repository/WhatsAppRepository"));
const CalendarRepository_1 = __importDefault(require("../repository/CalendarRepository"));
const gerador_validador_cpf_1 = require("gerador-validador-cpf");
const fs_1 = __importDefault(require("fs"));
const myConsole = new console.Console(fs_1.default.createWriteStream('./logs.txt'));
class WhatsAppService {
    post(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = payload.entry[0];
            const changes = entry.changes[0];
            const value = changes.value;
            const messageObject = value.messages;
            if (typeof messageObject !== 'undefined') {
                const messages = messageObject[0];
                const number = messages.from;
                const text = (0, getText_1.default)(messages);
                const indexUser = UserSchema_1.default.findIndex((value) => value.phone === number);
                setTimeout(() => {
                    UserSchema_1.default.splice(indexUser, 1);
                }, 180000);
                if (indexUser === -1) {
                    UserSchema_1.default.push({
                        phone: number,
                        name: '',
                        cpf: '',
                        data: '',
                        time: [],
                    });
                    yield WhatsAppRepository_1.default.postText('Oi, tudo bem? eu posso agendar seu horario no Pronto socorro de Ariquemes\nSe deseja fazer o agendamento, por favor, digite seu nome completo:', number);
                }
                else {
                    if (UserSchema_1.default[indexUser].name === '') {
                        UserSchema_1.default[indexUser].name = text.trim();
                        yield WhatsAppRepository_1.default.postText('Agora digite seu cpf como o exemplo abaixo\nExemplo: 11111111111 ou 111.111.111-11', number);
                    }
                    else if (UserSchema_1.default[indexUser].cpf === '') {
                        if (!(0, gerador_validador_cpf_1.validate)(text)) {
                            yield WhatsAppRepository_1.default.postText('Digite um cpf válido. Exemplo: 11111111111 ou 111.111.111-11', number);
                        }
                        else {
                            UserSchema_1.default[indexUser].cpf = text;
                            yield WhatsAppRepository_1.default.postText('Agora digite a data para a sua consulta no formato dia/mes\nExemplo: 26/05', number);
                        }
                    }
                    else if (UserSchema_1.default[indexUser].data === '') {
                        if (!manipulateData_1.default.validateData(text)) {
                            yield WhatsAppRepository_1.default.postText(`A data ${text} não é valida, digite uma data correta (dia/mes)\nExemplo: 02/10`, number);
                        }
                        else {
                            myConsole.log(`date = ${text}`);
                            let timeMin = manipulateData_1.default.formatData(text).hours(0).format();
                            let timeMax = manipulateData_1.default.formatData(text).hours(23).format();
                            timeMin = `${timeMin.substring(0, 19)}-04:00`;
                            timeMax = `${timeMax.substring(0, 19)}-04:00`;
                            myConsole.log(`timeMin = ${timeMin}`);
                            myConsole.log(`timeMax = ${timeMax}`);
                            UserSchema_1.default[indexUser].data = text;
                            const availables = yield CalendarRepository_1.default.get(timeMin, timeMax);
                            UserSchema_1.default[indexUser].time = availables;
                            let result = 'Esse são os Horários disponíveis:\n';
                            for (const [index, available] of availables.entries()) {
                                result += `${index + 1}.  ${available} horas da ${available < 12 ? 'manhã' : 'tarde'}.\n`;
                            }
                            result += '\nEscolha um horario digitando seu numero';
                            yield WhatsAppRepository_1.default.postText(result, number);
                        }
                    }
                    else {
                        if (!(Number(text) - 1 >= 0) ||
                            !(UserSchema_1.default[indexUser].time[Number(text)] >= UserSchema_1.default[indexUser].time.length)) {
                            yield WhatsAppRepository_1.default.postText('Por favor, digite um numero valido dos mostrados anteriormente', number);
                        }
                        else {
                            let dateTimeStart = manipulateData_1.default
                                .formatData(UserSchema_1.default[indexUser].data)
                                .hours(UserSchema_1.default[indexUser].time[Number(text) - 1])
                                .format();
                            let dateTimeEnd = manipulateData_1.default
                                .formatData(UserSchema_1.default[indexUser].data)
                                .hours(UserSchema_1.default[indexUser].time[Number(text) - 1] + 1)
                                .format();
                            dateTimeStart = `${dateTimeStart.substring(0, 19)}-04:00`;
                            dateTimeEnd = `${dateTimeEnd.substring(0, 19)}-04:00`;
                            myConsole.log(`dateTimeStart = ${dateTimeStart}`);
                            myConsole.log(`dateTimeEnd = ${dateTimeEnd}`);
                            const result = yield CalendarRepository_1.default.post(dateTimeStart, dateTimeEnd, UserSchema_1.default[indexUser].name, UserSchema_1.default[indexUser].phone, UserSchema_1.default[indexUser].cpf);
                            UserSchema_1.default.splice(indexUser, 1);
                            yield WhatsAppRepository_1.default.postText(result, number);
                        }
                    }
                }
            }
        });
    }
}
exports.default = new WhatsAppService();

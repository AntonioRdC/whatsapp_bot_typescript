import getText from '../utils/getText';
import User from '../schema/UserSchema';
import manipulateData from '../utils/manipulateData';
import WhatsAppRepository from '../repository/WhatsAppRepository';
import CalendarRepository from '../repository/CalendarRepository';
import { validate } from 'gerador-validador-cpf';
import fs from 'fs';

const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
class WhatsAppService {
  async post(payload): Promise<void> {
    const entry = payload.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;
    const messageObject = value.messages;

    if (typeof messageObject !== 'undefined') {
      const messages = messageObject[0];
      const number = messages.from;

      const text = getText(messages);

      const indexUser = User.findIndex((value) => value.phone === number);
      setTimeout(() => {
        User.splice(indexUser, 1);
      }, 180000);
      if (indexUser === -1) {
        User.push({
          phone: number,
          name: '',
          cpf: '',
          data: '',
          time: [],
        });

        await WhatsAppRepository.postText(
          'Oi, tudo bem? eu posso agendar seu horario no Pronto socorro de Ariquemes\nSe deseja fazer o agendamento, por favor, digite seu nome completo:',
          number
        );
      } else {
        if (User[indexUser].name === '') {
          User[indexUser].name = text.trim();
          await WhatsAppRepository.postText(
            'Agora digite seu cpf como o exemplo abaixo\nExemplo: 11111111111 ou 111.111.111-11',
            number
          );
        } else if (User[indexUser].cpf === '') {
          if (!validate(text)) {
            await WhatsAppRepository.postText(
              'Digite um cpf válido. Exemplo: 11111111111 ou 111.111.111-11',
              number
            );
          } else {
            User[indexUser].cpf = text;
            await WhatsAppRepository.postText(
              'Agora digite a data para a sua consulta no formato dia/mes\nExemplo: 26/05',
              number
            );
          }
        } else if (User[indexUser].data === '') {
          if (!manipulateData.validateData(text)) {
            await WhatsAppRepository.postText(
              `A data ${text} não é valida, digite uma data correta (dia/mes)\nExemplo: 02/10`,
              number
            );
          } else {
            myConsole.log(`date = ${text}`);
            let timeMin = manipulateData.formatData(text).hours(0).format();
            let timeMax = manipulateData.formatData(text).hours(23).format();
            timeMin = `${timeMin.substring(0, 19)}-04:00`;
            timeMax = `${timeMax.substring(0, 19)}-04:00`;
            myConsole.log(`timeMin = ${timeMin}`);
            myConsole.log(`timeMax = ${timeMax}`);

            User[indexUser].data = text;
            const availables = await CalendarRepository.get(timeMin, timeMax);
            User[indexUser].time = availables;

            let result = 'Esse são os Horários disponíveis:\n';
            for (const [index, available] of availables.entries()) {
              result += `${index + 1}.  ${available} horas da ${
                available < 12 ? 'manhã' : 'tarde'
              }.\n`;
            }
            result += '\nEscolha um horario digitando seu numero';

            await WhatsAppRepository.postText(result, number);
          }
        } else {
          if (
            !(Number(text) - 1 >= 0) ||
            !(User[indexUser].time[Number(text)] >= User[indexUser].time.length)
          ) {
            await WhatsAppRepository.postText(
              'Por favor, digite um numero valido dos mostrados anteriormente',
              number
            );
          } else {
            let dateTimeStart = manipulateData
              .formatData(User[indexUser].data)
              .hours(User[indexUser].time[Number(text) - 1])
              .format();
            let dateTimeEnd = manipulateData
              .formatData(User[indexUser].data)
              .hours(User[indexUser].time[Number(text) - 1] + 1)
              .format();
            dateTimeStart = `${dateTimeStart.substring(0, 19)}-04:00`;
            dateTimeEnd = `${dateTimeEnd.substring(0, 19)}-04:00`;
            myConsole.log(`dateTimeStart = ${dateTimeStart}`);
            myConsole.log(`dateTimeEnd = ${dateTimeEnd}`);
            const result = await CalendarRepository.post(
              dateTimeStart,
              dateTimeEnd,
              User[indexUser].name,
              User[indexUser].phone,
              User[indexUser].cpf
            );

            User.splice(indexUser, 1);
            await WhatsAppRepository.postText(result, number);
          }
        }
      }
    }
  }
}
export default new WhatsAppService();

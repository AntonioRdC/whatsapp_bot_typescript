import { google } from 'googleapis';
import fs from 'fs';

const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));

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

const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar',
});

const calendar = google.calendar('v3');

class CalendarRepository {
  async get(dateTimeStart: string, dateTimeEnd: string): Promise<number[]> {
    const request = await calendar.events.list({
      auth: serviceAccountAuth,
      calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
    });
    const result: number[] = [];
    if (request.data.items !== undefined) {
      const events: number[] = [];
      request.data.items.forEach((event, i) => {
        if (
          event.start?.dateTime !== null &&
          event.start?.dateTime !== undefined
        ) {
          const date = event.start?.dateTime;
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
  }

  async post(
    dateTimeStart: string,
    dateTimeEnd: string,
    name: string,
    phone: string,
    cpf: string
  ): Promise<string> {
    const description = `Nome: ${name}\nTelefone: ${phone}\nCpf: ${cpf}`;
    const request = await calendar.events.list({
      auth: serviceAccountAuth,
      calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
    });
    if (request.data.items === undefined || request.data.items.length > 0) {
      return 'O horário solicitado está em conflito com outro compromisso';
    } else {
      await calendar.events
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
  }
}

export default new CalendarRepository();

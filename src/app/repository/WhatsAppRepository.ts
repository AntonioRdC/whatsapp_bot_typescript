import axios from 'axios';

class TutorRepository {
  async postText(text: string, number: string): Promise<void> {
    await axios.post(
      `https://graph.facebook.com/v17.0/${
        process.env.IDENTIFY_NUMBER_META as string
      }/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'text',
        text: {
          preview_url: true,
          body: text,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BEARER as string}`,
        },
      }
    );
  }

  async postInteractive(text: object[], number: string): Promise<void> {
    await axios.post(
      `https://graph.facebook.com/v17.0/${
        process.env.IDENTIFY_NUMBER_META as string
      }/messages`,
      {
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
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BEARER as string}`,
        },
      }
    );
  }
}

export default new TutorRepository();

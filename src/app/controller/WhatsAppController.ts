import type { Request, Response } from 'express';
import WhatsAppService from '../service/WhatsAppService';
class WhatsAppController {
  get(req: Request, res: Response): Response {
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const accessToken = process.env.ACCESS_TOKEN_META;

    if (challenge != null && token != null && token === accessToken)
      return res.send(challenge);
    return res.json({});
  }

  async post(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await WhatsAppService.post(req.body);
      return res.send('EVENT_RECEIVED');
    } catch (error) {
      return res.send('EVENT_RECEIVED');
    }
  }
}

export default new WhatsAppController();

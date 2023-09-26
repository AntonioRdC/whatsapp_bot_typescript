import { Router } from 'express';
import WhatsAppController from '../app/controller/WhatsAppController';

const router = Router();

router.post('/whatsapp', WhatsAppController.post);
router.get('/whatsapp', WhatsAppController.get);

export default router;

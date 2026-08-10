import express from 'express';
import { placeOrder, getAllOrders } from '../controllers/orderController.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/', verifyAdmin, getAllOrders);

export default router;
import express, { Request, Response } from 'express';
import {
	requrieAuth,
	NotFoundError,
	NotAuthorizedError,
} from '@adh-learns/common';
import mongoose from 'mongoose';
import { Order } from '../models/order';

const router = express.Router();

router.get(
	'/api/orders/:orderId',
	requrieAuth,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;
		const isValid = mongoose.Types.ObjectId.isValid(orderId);
		if (!isValid) {
			throw new NotFoundError();
		}
		const order = await Order.findById(orderId);
		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		res.send(order);
	}
);

export { router as showOrderRouter };

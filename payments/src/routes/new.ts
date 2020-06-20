import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import {
	requrieAuth,
	validateRequest,
	NotFoundError,
	NotAuthorizedError,
	OrderStatus,
	BadRequestError,
} from '@adh-learns/common';

const router = express.Router();

router.post(
	'/api/payments',
	requrieAuth,
	[body('token').not().isEmpty(), body('orderId').not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;
		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		if (order.status === OrderStatus.Cancelled) {
			throw new BadRequestError('The Order Expired !');
		}

		await stripe.charges.create({
			currency: 'inr',
			amount: order.price * 100,
			source: token,
			description: 'This is a Test payment, not even real',
		});

		res.status(201).send({ success: true });
	}
);

export { router as CreateChargeRouter };

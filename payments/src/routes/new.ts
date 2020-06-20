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
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

		const charge = await stripe.charges.create({
			currency: 'inr',
			amount: order.price * 100,
			source: token,
			description: 'This is a Test payment, not even real',
		});

		const payment = Payment.build({
			orderId,
			stripeId: charge.id,
		});

		await payment.save();

		await new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			orderId: payment.orderId,
			stripeId: payment.stripeId,
		});

		res.status(201).send({ id: payment.id });
	}
);

export { router as CreateChargeRouter };

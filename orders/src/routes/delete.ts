import express, { Request, Response } from 'express';
import {
	requrieAuth,
	NotFoundError,
	NotAuthorizedError,
	OrderStatus,
} from '@adh-learns/common';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
	'/api/orders/:orderId',
	requrieAuth,
	async (req: Request, res: Response) => {
		// Get orderid from request
		const { orderId } = req.params;

		// Verify if the id is of mongoose id
		const isValid = mongoose.Types.ObjectId.isValid(orderId);
		if (!isValid) {
			throw new NotFoundError();
		}

		// fetch order from DB
		const order = await Order.findById(orderId).populate('ticket');
		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		// Update status to cancelled
		await order.update({ status: OrderStatus.Cancelled });

		// Publish cancellation event
		await new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.status(204).send(order);
	}
);

export { router as deleteOrderRoute };

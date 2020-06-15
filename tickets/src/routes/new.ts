import express, { Request, Response } from 'express';
import { requrieAuth, validateRequest } from '@adh-learns/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/tickets',
	requrieAuth,
	[
		body('title').not().isEmpty().withMessage('Title is Required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be Greater than 0')
			.not()
			.isEmpty(),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;
		const ticket = Ticket.build({
			title,
			price,
			userId: req.currentUser!.id,
		});
		await ticket.save();
		new TicketCreatedPublisher(natsWrapper.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
		});
		res.status(201).send(ticket);
	}
);

export { router as createTicketRouter };

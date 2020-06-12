import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
	validateRequest,
	NotFoundError,
	requrieAuth,
	NotAuthorizedError,
} from '@adh-learns/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
	'/api/tickets/:id',
	requrieAuth,
	[
		body('title').not().isEmpty().withMessage('Title is Required'),
		body('price').isFloat({ gt: 0 }).withMessage('Price must be a valid'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);
		if (!ticket) {
			throw new NotFoundError();
		}

		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		ticket.set({
			title: req.body.title,
			price: req.body.price,
		});
		ticket.save();

		res.send(ticket);
	}
);

export { router as updateTicketRouter };

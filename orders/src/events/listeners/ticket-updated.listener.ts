import { Message } from 'node-nats-streaming';
import { Listener, TicketUpdatedEvent, Subjects } from '@adh-learns/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findByEvent(data);

		if (!ticket) {
			throw new Error('Ticket not Found');
		}

		const { title, price } = data;
		ticket.set({ title, price });

		await ticket.save();

		msg.ack();
	}
}

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@adh-learns/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
	queueGroupName = 'orders-service';
	onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        
    }
}

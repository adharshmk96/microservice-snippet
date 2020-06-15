import { Publisher, Subjects, TicketCreatedEvent } from '@adh-learns/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}

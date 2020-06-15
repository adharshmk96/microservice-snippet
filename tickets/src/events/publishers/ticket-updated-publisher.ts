import { Publisher, Subjects, TicketUpdatedEvent } from '@adh-learns/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
